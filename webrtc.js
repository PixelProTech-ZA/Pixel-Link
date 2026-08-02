// Pixel Link — Connection Engine
// Serverless pairing: the two devices exchange one QR/text code each way to
// bootstrap a WebRTC connection (no relay server required on the local
// network). Once the data channel is open, it is reused as an in-band
// signaling channel for everything afterwards (adding camera/mic tracks,
// etc.) using the "perfect negotiation" pattern — no further manual codes
// are ever needed again for that session.

const RTC_CONFIG = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
};

const CHUNK_SIZE = 16 * 1024; // 16KB — safe default for RTCDataChannel
const BUFFERED_AMOUNT_LOW = 1 * 1024 * 1024;

function waitForIceGathering(pc) {
  if (pc.iceGatheringState === 'complete') return Promise.resolve();
  return new Promise(resolve => {
    function check() {
      if (pc.iceGatheringState === 'complete') {
        pc.removeEventListener('icegatheringstatechange', check);
        resolve();
      }
    }
    pc.addEventListener('icegatheringstatechange', check);
    // Safety timeout — proceed with whatever candidates we have (works fine on LAN)
    setTimeout(resolve, 2500);
  });
}

async function shortHash(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  const arr = Array.from(new Uint8Array(buf));
  const num = arr.slice(0, 4).reduce((a, b) => a * 256 + b, 0);
  return String(num % 1000000).padStart(6, '0');
}

async function fileHash(buffers) {
  const total = new Blob(buffers);
  const buf = await crypto.subtle.digest('SHA-256', await total.arrayBuffer());
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 16);
}

export class LinkEngine extends EventTarget {
  constructor() {
    super();
    this.pc = null;
    this.channel = null;
    this.role = null; // 'host' | 'join'
    this.state = 'idle'; // idle | waiting | connecting | connected | disconnected
    this.deviceName = null;
    this.remoteName = null;
    this.verifyCode = null;
    this._pendingChunks = null;
    this._incomingMeta = null;
    this._fileQueue = [];
    this._localStream = null;
    this._makingOffer = false;
    this._transfers = new Map();
  }

  emit(name, detail) { this.dispatchEvent(new CustomEvent(name, { detail })); }

  _newPeer() {
    const pc = new RTCPeerConnection(RTC_CONFIG);
    pc.onconnectionstatechange = () => {
      this.emit('connstate', pc.connectionState);
      if (pc.connectionState === 'connected') {
        this.state = 'connected';
        this.emit('state', this.state);
      } else if (['disconnected', 'failed', 'closed'].includes(pc.connectionState)) {
        this.state = 'disconnected';
        this.emit('state', this.state);
      }
    };
    pc.ontrack = (ev) => this.emit('track', ev);

    // In-band renegotiation (perfect negotiation) once the bootstrap channel is open —
    // lets us add camera/mic tracks later without a second manual code exchange.
    pc.onnegotiationneeded = async () => {
      if (!this.channel || this.channel.readyState !== 'open') return;
      try {
        this._makingOffer = true;
        await pc.setLocalDescription();
        this._send({ __sig: true, kind: 'renego-offer', sdp: pc.localDescription });
      } catch (e) { /* ignore */ } finally { this._makingOffer = false; }
    };
    pc.onicecandidate = (ev) => {
      if (ev.candidate && this.channel && this.channel.readyState === 'open') {
        this._send({ __sig: true, kind: 'ice', candidate: ev.candidate });
      }
    };
    return pc;
  }

  _wireChannel(ch) {
    this.channel = ch;
    ch.binaryType = 'arraybuffer';
    ch.onopen = () => {
      this.state = 'connected';
      this.emit('state', this.state);
      this.emit('channelopen');
      this._send({ __hello: true, name: this.deviceName });
    };
    ch.onclose = () => { this.state = 'disconnected'; this.emit('state', this.state); };
    ch.onmessage = (ev) => this._onMessage(ev);
  }

  // ---------- Bootstrap pairing (host side) ----------
  async createOffer(deviceName) {
    this.deviceName = deviceName;
    this.role = 'host';
    this.pc = this._newPeer();
    const dc = this.pc.createDataChannel('pixel-link', { ordered: true });
    this._wireChannel(dc);

    const offer = await this.pc.createOffer();
    await this.pc.setLocalDescription(offer);
    await waitForIceGathering(this.pc);

    const payload = { t: 'offer', sdp: this.pc.localDescription, name: deviceName };
    const code = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
    this.verifyCode = await shortHash(code);
    this.state = 'waiting';
    return { code, verifyCode: this.verifyCode };
  }

  async applyAnswer(code) {
    const payload = JSON.parse(decodeURIComponent(escape(atob(code.trim()))));
    if (payload.t !== 'answer') throw new Error('That code is not a pairing answer.');
    this.remoteName = payload.name || 'Paired device';
    await this.pc.setRemoteDescription(payload.sdp);
    this.state = 'connecting';
    return this.remoteName;
  }

  // ---------- Bootstrap pairing (joining side) ----------
  async acceptOffer(code, deviceName) {
    const payload = JSON.parse(decodeURIComponent(escape(atob(code.trim()))));
    if (payload.t !== 'offer') throw new Error('That code is not a pairing offer.');
    this.deviceName = deviceName;
    this.role = 'join';
    this.remoteName = payload.name || 'Paired device';
    this.pc = this._newPeer();
    this.pc.ondatachannel = (ev) => this._wireChannel(ev.channel);

    await this.pc.setRemoteDescription(payload.sdp);
    const answer = await this.pc.createAnswer();
    await this.pc.setLocalDescription(answer);
    await waitForIceGathering(this.pc);

    const outPayload = { t: 'answer', sdp: this.pc.localDescription, name: deviceName };
    const outCode = btoa(unescape(encodeURIComponent(JSON.stringify(outPayload))));
    this.verifyCode = await shortHash(code);
    this.state = 'connecting';
    return { code: outCode, verifyCode: this.verifyCode, remoteName: this.remoteName };
  }

  disconnect() {
    try { this.channel && this.channel.close(); } catch (e) {}
    try { this.pc && this.pc.close(); } catch (e) {}
    if (this._localStream) { this._localStream.getTracks().forEach(t => t.stop()); this._localStream = null; }
    this.pc = null; this.channel = null; this.state = 'idle';
    this.emit('state', this.state);
  }

  // ---------- Messaging ----------
  _send(obj) {
    if (this.channel && this.channel.readyState === 'open') this.channel.send(JSON.stringify(obj));
  }

  sendClipboard(text) {
    this._send({ type: 'clipboard', text, time: Date.now() });
  }

  sendTouch(action, dx, dy) {
    this._send({ type: 'touch', action, dx, dy });
  }

  async _onMessage(ev) {
    if (typeof ev.data === 'string') {
      let msg;
      try { msg = JSON.parse(ev.data); } catch (e) { return; }

      if (msg.__hello) { this.remoteName = msg.name; this.emit('paired', msg.name); return; }

      if (msg.__sig) {
        if (msg.kind === 'renego-offer') {
          const polite = this.role === 'join';
          if (this._makingOffer && !polite) return;
          await this.pc.setRemoteDescription(msg.sdp);
          const answer = await this.pc.createAnswer();
          await this.pc.setLocalDescription(answer);
          this._send({ __sig: true, kind: 'renego-answer', sdp: this.pc.localDescription });
        } else if (msg.kind === 'renego-answer') {
          await this.pc.setRemoteDescription(msg.sdp);
        } else if (msg.kind === 'ice') {
          try { await this.pc.addIceCandidate(msg.candidate); } catch (e) {}
        }
        return;
      }

      if (msg.type === 'clipboard') { this.emit('clipboard', msg); return; }
      if (msg.type === 'touch') { this.emit('touch', msg); return; }
      if (msg.type === 'file-meta') {
        this._incomingMeta = msg;
        this._pendingChunks = [];
        this.emit('file-start', msg);
        return;
      }
      if (msg.type === 'file-done') {
        const buffers = this._pendingChunks;
        const meta = this._incomingMeta;
        const hash = await fileHash(buffers);
        const blob = new Blob(buffers, { type: meta.mime || 'application/octet-stream' });
        this.emit('file-complete', { meta, blob, hashOk: hash === meta.hash });
        this._pendingChunks = null; this._incomingMeta = null;
        return;
      }
      if (msg.type === 'file-cancel') {
        this._pendingChunks = null; this._incomingMeta = null;
        this.emit('file-cancelled', msg);
        return;
      }
      return;
    }

    // binary chunk
    if (this._pendingChunks) {
      this._pendingChunks.push(ev.data);
      const received = this._pendingChunks.reduce((a, b) => a + b.byteLength, 0);
      this.emit('file-progress', { received, total: this._incomingMeta.size, id: this._incomingMeta.id });
    }
  }

  // ---------- File transfer ----------
  async sendFile(file, { id, onProgress } = {}) {
    if (!this.channel || this.channel.readyState !== 'open') throw new Error('Not connected.');
    const fid = id || (Date.now().toString(36) + Math.random().toString(36).slice(2, 6));
    const buffers = [];
    const arrBuf = await file.arrayBuffer();
    for (let off = 0; off < arrBuf.byteLength; off += CHUNK_SIZE) {
      buffers.push(arrBuf.slice(off, off + CHUNK_SIZE));
    }
    const hash = await fileHash(buffers);

    this._send({
      type: 'file-meta', id: fid, name: file.name, size: file.size,
      mime: file.type, hash, chunks: buffers.length
    });

    let sent = 0;
    let cancelled = false;
    this._transfers.set(fid, { cancel: () => { cancelled = true; } });

    for (const chunk of buffers) {
      if (cancelled) { this._send({ type: 'file-cancel', id: fid }); return { cancelled: true }; }
      if (this.channel.bufferedAmount > BUFFERED_AMOUNT_LOW) {
        await new Promise(res => {
          const h = () => { this.channel.removeEventListener('bufferedamountlow', h); res(); };
          this.channel.bufferedAmountLowThreshold = BUFFERED_AMOUNT_LOW / 2;
          this.channel.addEventListener('bufferedamountlow', h);
        });
      }
      this.channel.send(chunk);
      sent += chunk.byteLength;
      onProgress && onProgress(sent, file.size);
      await new Promise(r => setTimeout(r, 0));
    }
    this._send({ type: 'file-done', id: fid });
    this._transfers.delete(fid);
    return { cancelled: false, hash };
  }

  cancelSend(id) {
    const t = this._transfers.get(id);
    if (t) t.cancel();
  }

  // ---------- Media (camera / mic) — added via in-band renegotiation ----------
  async shareMedia({ video = false, audio = false } = {}) {
    if (!this.pc) throw new Error('Not connected.');
    const stream = await navigator.mediaDevices.getUserMedia({ video, audio });
    this._localStream = stream;
    stream.getTracks().forEach(track => this.pc.addTrack(track, stream));
    return stream;
  }

  stopMedia() {
    if (this._localStream) {
      this._localStream.getTracks().forEach(t => t.stop());
      this._localStream = null;
    }
  }
}
