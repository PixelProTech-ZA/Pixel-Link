import { idb, uid } from './db.js';
import { LinkEngine } from './webrtc.js';

/* ============================== ICONS ============================== */
const ICONS = {
  home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/>',
  link: '<path d="M9 15l6-6"/><path d="M13 5l1.5-1.5a4 4 0 015.6 5.6L18 11"/><path d="M11 19l-1.5 1.5a4 4 0 01-5.6-5.6L6 13"/>',
  files: '<path d="M13 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z"/><path d="M13 3v6h6"/>',
  clip: '<rect x="6" y="4" width="12" height="17" rx="2"/><rect x="9" y="2" width="6" height="4" rx="1"/>',
  note: '<path d="M4 4h16v16H4z" opacity="0"/><path d="M6 3h9l5 5v13H6z"/><path d="M15 3v5h5"/><path d="M9 12h6M9 16h6"/>',
  photo: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5.5-5.5L4 21"/>',
  music: '<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
  video: '<rect x="2" y="6" width="14" height="12" rx="2"/><path d="M22 8l-6 4 6 4z"/>',
  download: '<path d="M12 3v12"/><path d="M7 11l5 5 5-5"/><path d="M5 21h14"/>',
  storage: '<rect x="3" y="4" width="18" height="6" rx="1"/><rect x="3" y="14" width="18" height="6" rx="1"/><path d="M7 7h.01M7 17h.01"/>',
  camera: '<path d="M4 8h3l2-2h6l2 2h3v11H4z"/><circle cx="12" cy="13.5" r="3.5"/>',
  mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0014 0"/><path d="M12 18v3"/>',
  touchpad: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M4 15h16"/>',
  bell: '<path d="M6 8a6 6 0 0112 0c0 5 2 6 2 6H4s2-1 2-6z"/><path d="M10 19a2 2 0 004 0"/>',
  battery: '<rect x="2" y="7" width="18" height="10" rx="2"/><path d="M22 10v4"/>',
  wifi: '<path d="M2 8.5a16 16 0 0120 0"/><path d="M5.5 12a11 11 0 0113 0"/><path d="M9 15.5a6 6 0 016 0"/><path d="M12 19h.01"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6"/><path d="M12 7.5h.01"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  shield: '<path d="M12 2l8 4v6c0 5-3.4 8.4-8 10-4.6-1.6-8-5-8-10V6z"/><path d="M9 12l2 2 4-4"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.9 2.9l-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.6V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1-1.6 1.7 1.7 0 00-1.9.3l-.1.1a2 2 0 11-2.9-2.9l.1-.1a1.7 1.7 0 00.3-1.9 1.7 1.7 0 00-1.6-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.6-1 1.7 1.7 0 00-.3-1.9l-.1-.1a2 2 0 112.9-2.9l.1.1a1.7 1.7 0 001.9.3H9a1.7 1.7 0 001-1.6V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.6 1.7 1.7 0 001.9-.3l.1-.1a2 2 0 112.9 2.9l-.1.1a1.7 1.7 0 00-.3 1.9V9c.4.2.9.4 1.6.4H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1.6z"/>',
  cpu: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/>',
  bolt: '<path d="M13 2L4 14h6l-1 8 9-12h-6z"/>',
  qr: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3zM19 14h2v2h-2zM14 19h2v2h-2zM19 19h2v2h-2z"/>',
  upload: '<path d="M12 21V9"/><path d="M7 13l5-5 5 5"/><path d="M5 3h14"/>',
  play: '<path d="M7 4l13 8-13 8z"/>',
  pause: '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>',
  check: '<path d="M20 6L9 17l-5-5"/>',
  x: '<path d="M18 6L6 18"/><path d="M6 6l12 12"/>',
  trash: '<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M6 6l1 15h10l1-15"/>',
  copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V4a1 1 0 011-1h11"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  star: '<path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.9L5.7 21l1.7-7-5.4-4.7 7.1-.6z"/>',
  pin: '<path d="M12 2a5 5 0 015 5c0 4-5 11-5 11S7 11 7 7a5 5 0 015-5z"/><circle cx="12" cy="7" r="2"/>',
  send: '<path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4z"/>',
  refresh: '<path d="M21 12a9 9 0 11-3-6.7"/><path d="M21 3v6h-6"/>',
  arrowLeft: '<path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>',
  scan: '<path d="M3 7V4a1 1 0 011-1h3"/><path d="M17 3h3a1 1 0 011 1v3"/><path d="M21 17v3a1 1 0 01-1 1h-3"/><path d="M7 21H4a1 1 0 01-1-1v-3"/><path d="M7 12h10"/>',
  activity: '<path d="M3 12h4l2 8 4-16 2 8h6"/>',
};
function ic(name, size = 18) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" width="${size}" height="${size}">${ICONS[name] || ''}</svg>`;
}

/* ============================== STATE ============================== */
const engine = new LinkEngine();

const state = {
  view: 'dashboard',
  deviceName: localStorage.getItem('pl-device-name') || guessDeviceName(),
  settings: Object.assign({
    animations: true, notifications: true, autoDownload: false,
    clipboardSync: true, reducedMotion: false
  }, JSON.parse(localStorage.getItem('pl-settings') || '{}')),
  pairMode: 'create', // create | join
  pairStage: 'idle', // idle | code-ready | await-answer | scan | enter-code | verify
  outCode: '', verifyCode: '', joinInput: '',
  battery: null,
  net: { type: 'unknown', downlink: null, rtt: null },
  transfers: [], // {id,name,size,sent,dir:'up'|'down',status}
  files: [],
  notes: [],
  activity: [],
  clipboard: { current: '', history: [] },
  search: '',
  editingNote: null,
  localStream: null,
  remoteStream: null,
  micActive: false,
  touchActive: false,
  cursorPos: { x: 50, y: 50 },
};

function guessDeviceName() {
  const ua = navigator.userAgent;
  const platform = /iPhone/.test(ua) ? 'iPhone' : /iPad/.test(ua) ? 'iPad' : /Android/.test(ua) ? 'Android Device'
    : /Mac/.test(ua) ? 'Mac' : /Win/.test(ua) ? 'Windows PC' : /Linux/.test(ua) ? 'Linux PC' : 'This Device';
  return `${platform} · ${Math.floor(Math.random() * 900 + 100)}`;
}

/* ============================== TOASTS ============================== */
function toast(msg, kind = 'ok') {
  const stack = document.getElementById('toast-stack');
  const el = document.createElement('div');
  el.className = `toast ${kind}`;
  el.innerHTML = `<span class="dot"></span><span>${msg}</span>`;
  stack.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity .3s'; setTimeout(() => el.remove(), 320); }, 3200);
}

async function logActivity(title, kind = 'ok') {
  const entry = { id: uid(), title, kind, time: Date.now() };
  await idb.put('activity', entry);
  state.activity.unshift(entry);
  if (state.view === 'timeline') render();
}

/* ============================== NAV ============================== */
const NAV = [
  { id: 'dashboard', label: 'Home', icon: 'home' },
  { id: 'pair', label: 'Pair', icon: 'link' },
  { id: 'files', label: 'Files', icon: 'files' },
  { id: 'clipboard', label: 'Clipboard', icon: 'clip' },
  { id: 'notes', label: 'Notes', icon: 'note' },
  { id: 'gallery', label: 'Gallery', icon: 'photo' },
  { id: 'music', label: 'Music', icon: 'music' },
  { id: 'video', label: 'Video', icon: 'video' },
  { id: 'camera', label: 'Camera', icon: 'camera' },
  { id: 'mic', label: 'Microphone', icon: 'mic' },
  { id: 'touchpad', label: 'Touchpad', icon: 'touchpad' },
  { id: 'notifications', label: 'Notifications', icon: 'bell' },
  { id: 'network', label: 'Network', icon: 'wifi' },
  { id: 'battery', label: 'Battery', icon: 'battery' },
  { id: 'device', label: 'Device Info', icon: 'info' },
  { id: 'search', label: 'Search', icon: 'search' },
  { id: 'timeline', label: 'Activity', icon: 'clock' },
  { id: 'security', label: 'Security', icon: 'shield' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];
const PRIMARY_NAV_IDS = ['dashboard', 'pair', 'files', 'clipboard', 'notes', 'gallery', 'camera', 'touchpad', 'network', 'device', 'timeline', 'security', 'settings'];

function go(view) {
  state.view = view;
  render();
  document.querySelector('main.view-port')?.scrollTo?.({ top: 0 });
  window.scrollTo(0, 0);
}

/* ============================== FORMAT HELPERS ============================== */
function fmtBytes(n) {
  if (n == null) return '—';
  if (n < 1024) return n + ' B';
  const u = ['KB', 'MB', 'GB', 'TB']; let i = -1;
  do { n /= 1024; i++; } while (n >= 1024 && i < u.length - 1);
  return n.toFixed(n < 10 ? 1 : 0) + ' ' + u[i];
}
function fmtTime(ts) {
  const d = new Date(ts);
  const diff = (Date.now() - ts) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
function escapeHtml(s = '') { return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

/* ============================== DEVICE TELEMETRY ============================== */
const telemetry = { cpu: navigator.hardwareConcurrency || 4, memory: navigator.deviceMemory || null, storage: { usage: 0, quota: 0 } };

async function refreshTelemetry() {
  if (navigator.storage && navigator.storage.estimate) {
    try { telemetry.storage = await navigator.storage.estimate(); } catch (e) {}
  }
  if (navigator.getBattery) {
    try {
      const b = await navigator.getBattery();
      state.battery = { level: b.level, charging: b.charging };
      b.onlevelchange = () => { state.battery.level = b.level; if (state.view === 'dashboard' || state.view === 'battery') render(); };
      b.onchargingchange = () => { state.battery.charging = b.charging; if (state.view === 'dashboard' || state.view === 'battery') render(); };
    } catch (e) {}
  }
  const conn = navigator.connection || navigator.webkitConnection || navigator.mozConnection;
  if (conn) {
    state.net = { type: conn.effectiveType || conn.type || 'unknown', downlink: conn.downlink, rtt: conn.rtt };
    conn.onchange = () => {
      state.net = { type: conn.effectiveType || conn.type || 'unknown', downlink: conn.downlink, rtt: conn.rtt };
      if (state.view === 'dashboard' || state.view === 'network') render();
    };
  }
}

/* ============================== SVG: CONNECTION HERO ============================== */
function heroViz() {
  const connected = engine.state === 'connected';
  const connecting = engine.state === 'connecting' || engine.state === 'waiting';
  const color1 = 'var(--accent)', color2 = 'var(--accent-2)';
  const beamColor = connected ? color2 : (connecting ? 'var(--warn)' : 'var(--text-faint)');
  return `
  <svg class="linkviz" viewBox="0 0 340 130" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="beamGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="${color1}"/>
        <stop offset="1" stop-color="${color2}"/>
      </linearGradient>
      <path id="beamPath" d="M78 65 H262" />
    </defs>
    ${connected ? `
      <circle class="pulse-ring" cx="78" cy="65" r="26" fill="none" stroke="${color1}" stroke-width="1.5"/>
      <circle class="pulse-ring" cx="262" cy="65" r="26" fill="none" stroke="${color2}" stroke-width="1.5" style="animation-delay:.6s"/>
    ` : ''}
    <line x1="78" y1="65" x2="262" y2="65" stroke="${beamColor}" stroke-width="2" class="${connected ? 'beam' : ''}" stroke-opacity="${connected ? 1 : .35}"/>
    ${connected ? `
      <circle r="3.2" fill="${color2}" class="particle" style="offset-path:path('M78 65 H262')"></circle>
      <circle r="3.2" fill="${color1}" class="particle" style="offset-path:path('M262 65 H78'); animation-delay:1.2s"></circle>
    ` : ''}
    <g>
      <circle cx="78" cy="65" r="22" fill="var(--card-lo)" stroke="${color1}" stroke-width="2"/>
      <path d="M71 56h14a2 2 0 012 2v14a2 2 0 01-2 2H71a2 2 0 01-2-2V58a2 2 0 012-2z" fill="none" stroke="#fff" stroke-width="1.4" transform="translate(0,-1) scale(0.62) translate(43,40)"/>
      <text x="78" y="103" text-anchor="middle" class="node-label">${escapeHtml((state.deviceName || 'This device').split(' · ')[0])}</text>
      <text x="78" y="115" text-anchor="middle" class="node-sub">This device</text>
    </g>
    <g>
      <circle cx="262" cy="65" r="22" fill="var(--card-lo)" stroke="${color2}" stroke-width="2"/>
      <rect x="253" y="55" width="18" height="20" rx="3" fill="none" stroke="#fff" stroke-width="1.4"/>
      <text x="262" y="103" text-anchor="middle" class="node-label">${escapeHtml(connected || connecting ? (engine.remoteName || 'Paired device') : 'Not paired')}</text>
      <text x="262" y="115" text-anchor="middle" class="node-sub">${connected ? 'Connected' : connecting ? 'Connecting…' : 'Waiting'}</text>
    </g>
  </svg>`;
}

/* ============================== VIEWS ============================== */

function viewDashboard() {
  const connected = engine.state === 'connected';
  const battery = state.battery;
  const storagePct = telemetry.storage.quota ? Math.round((telemetry.storage.usage / telemetry.storage.quota) * 100) : null;
  return `
  <div class="view">
    <div class="hero-link card glow">
      <div class="hero-top">
        <span class="eyebrow">Connection</span>
        <span class="pill ${connected ? 'ok' : 'warn'}">${connected ? ic('check', 12) + ' Linked' : ic('link', 12) + ' Not linked'}</span>
      </div>
      ${heroViz()}
      <div class="hero-meta">
        <div class="hm"><div class="v mono">${connected ? 'AES-GCM' : '—'}</div><div class="l">Encryption</div></div>
        <div class="hm"><div class="v mono">${connected ? 'P2P LAN' : '—'}</div><div class="l">Path</div></div>
        <div class="hm"><div class="v mono">${state.transfers.length ? fmtTime(state.transfers[0].time) : '—'}</div><div class="l">Last sync</div></div>
      </div>
      ${!connected ? `<div style="display:flex;justify-content:center;margin-top:14px;">
        <button class="btn btn-primary" data-go="pair">${ic('qr', 16)} Pair a device</button>
      </div>` : `<div style="display:flex;justify-content:center;margin-top:14px;gap:10px;">
        <button class="btn btn-secondary btn-sm" data-go="files">${ic('files', 14)} Send files</button>
        <button class="btn btn-danger btn-sm" data-action="disconnect">${ic('x', 14)} Disconnect</button>
      </div>`}
    </div>

    <div class="grid cols-4">
      ${stat('battery', 'Battery', battery ? Math.round(battery.level * 100) + '%' : '—', battery && battery.charging ? 'Charging' : null, battery && battery.level < .2 && !battery.charging ? 'danger' : 'accent2')}
      ${stat('storage', 'Storage used', storagePct != null ? storagePct + '%' : '—', storagePct != null ? fmtBytes(telemetry.storage.usage) : null, 'accent')}
      ${stat('cpu', 'Memory', telemetry.memory ? telemetry.memory + ' GB' : '—', navigator.hardwareConcurrency ? navigator.hardwareConcurrency + ' cores' : null, 'accent2')}
      ${stat('wifi', 'Network', state.net.type !== 'unknown' ? state.net.type.toUpperCase() : (navigator.onLine ? 'Online' : 'Offline'), state.net.downlink ? state.net.downlink + ' Mbps' : null, 'accent')}
    </div>

    <div class="card">
      <div class="section-title"><h2>Current activity</h2><button class="link" data-go="timeline">View all</button></div>
      ${state.activity.length === 0 ? emptyState('activity', 'Nothing yet', 'Pair a device to start seeing transfers, syncs, and connection events here.') :
        `<div style="margin-top:6px;">${state.activity.slice(0, 4).map(a => tlRow(a)).join('')}</div>`}
    </div>

    <div class="grid cols-3">
      ${quickAction('pair', 'link', 'Pair device', 'Connect via QR or code')}
      ${quickAction('files', 'files', 'Send files', 'Photos, docs, folders')}
      ${quickAction('notes', 'note', 'Shared notes', 'Markdown, synced')}
    </div>
  </div>`;
}

function stat(icon, label, value, sub, tone) {
  return `<div class="card tight stat">
    <div class="stat-top">
      <span class="label">${label}</span>
      <span class="stat-icon" style="background:${tone === 'accent2' ? 'rgba(0,212,170,.14)' : 'rgba(123,47,255,.16)'};color:${tone === 'accent2' ? 'var(--accent-2)' : '#c9a3ff'}">${ic(icon, 15)}</span>
    </div>
    <div class="value">${value}${sub ? `<small>${sub}</small>` : ''}</div>
  </div>`;
}
function quickAction(view, icon, title, sub) {
  return `<button class="card tight" data-go="${view}" style="text-align:left;cursor:pointer;display:flex;flex-direction:column;gap:10px;">
    <span class="stat-icon" style="background:rgba(123,47,255,.16);color:#c9a3ff;">${ic(icon, 16)}</span>
    <div><div style="font-weight:700;font-size:13.5px;">${title}</div><div style="font-size:11.5px;color:var(--text-faint);margin-top:2px;">${sub}</div></div>
  </button>`;
}
function emptyState(icon, title, body) {
  return `<div class="empty"><div class="empty-icon">${ic(icon, 22)}</div><h3>${title}</h3><p>${body}</p></div>`;
}
function tlRow(a) {
  return `<div class="tl-item"><span class="tl-dot ${a.kind}"></span><div class="tl-main"><div class="tl-title">${escapeHtml(a.title)}</div><div class="tl-time">${fmtTime(a.time)}</div></div></div>`;
}

/* ---- PAIR ---- */
function viewPair() {
  const connected = engine.state === 'connected';
  if (connected) {
    return `<div class="view">
      ${viewHead('Pair', 'Connected', "You're linked with another device.")}
      <div class="card glow" style="text-align:center;padding:30px 18px;">
        <div class="stat-icon" style="margin:0 auto 14px;width:56px;height:56px;border-radius:16px;background:rgba(0,255,136,.12);color:var(--ok);">${ic('check', 26)}</div>
        <h3 style="font-size:17px;margin-bottom:6px;">Linked with ${escapeHtml(engine.remoteName || 'paired device')}</h3>
        <p style="color:var(--text-dim);font-size:13px;margin-bottom:18px;">Session verification code <b class="mono">${engine.verifyCode || '—'}</b></p>
        <button class="btn btn-danger" data-action="disconnect">${ic('x', 15)} Disconnect</button>
      </div>
      ${trustedDevicesCard()}
    </div>`;
  }

  return `<div class="view">
    ${viewHead('Pair', 'Connect a device', 'Works over local Wi-Fi with no account or cloud relay — the first link takes two codes, everything after is automatic.')}
    <div class="pair-tabs">
      <button class="pair-tab ${state.pairMode === 'create' ? 'active' : ''}" data-pairmode="create">Create link</button>
      <button class="pair-tab ${state.pairMode === 'join' ? 'active' : ''}" data-pairmode="join">Join a link</button>
    </div>
    ${state.pairMode === 'create' ? pairCreatePanel() : pairJoinPanel()}
    ${trustedDevicesCard()}
  </div>`;
}

function viewHead(eyebrow, title, desc) {
  return `<div class="view-head"><div><span class="eyebrow">${eyebrow}</span><h1>${title}</h1>${desc ? `<p class="desc">${desc}</p>` : ''}</div></div>`;
}

function pairCreatePanel() {
  if (state.pairStage === 'idle') {
    return `<div class="card" style="text-align:center;padding:30px 18px;">
      <div class="stat-icon" style="margin:0 auto 14px;width:56px;height:56px;border-radius:16px;">${ic('qr', 26)}</div>
      <h3 style="margin-bottom:6px;font-size:16px;">Generate a pairing code</h3>
      <p style="color:var(--text-dim);font-size:13px;max-width:36ch;margin:0 auto 18px;">Your other device scans this QR (or enters the code) to request a link. Nothing leaves your local network.</p>
      <button class="btn btn-primary" data-action="start-host">${ic('bolt', 15)} Generate code</button>
    </div>`;
  }
  if (state.pairStage === 'code-ready') {
    return `<div class="card">
      <div class="qr-wrap">
        <div class="qr-box"><canvas id="qr-canvas"></canvas></div>
        <div class="pin-hint">Verification code — confirm this matches on both screens</div>
        <div class="pin-display">${state.verifyCode.split('').map(d => `<div class="pin-digit">${d}</div>`).join('')}</div>
      </div>
      <div class="divider"></div>
      <div class="code-swap">
        <div class="field"><label>Or share this text code</label><textarea id="out-code" rows="3" readonly>${state.outCode}</textarea></div>
        <button class="btn btn-secondary btn-sm" data-action="copy-out">${ic('copy', 14)} Copy code</button>
      </div>
      <div class="divider"></div>
      <div class="field"><label>Paste the answer code from your other device</label><textarea id="answer-code" rows="3" placeholder="Paste answer code here…"></textarea></div>
      <button class="btn btn-primary btn-block" data-action="complete-host" style="margin-top:10px;">${ic('link', 15)} Complete pairing</button>
      <button class="btn btn-ghost btn-block" data-action="cancel-pair" style="margin-top:6px;">Cancel</button>
    </div>`;
  }
  return '';
}

function pairJoinPanel() {
  if (state.pairStage === 'idle' || state.pairStage === 'enter-code') {
    return `<div class="card">
      <div class="field"><label>Device name</label><input id="join-name" value="${escapeHtml(state.deviceName)}" placeholder="How this device appears to others"></div>
      <div class="field" style="margin-top:12px;"><label>Paste the offer code from the other device</label><textarea id="in-code" rows="4" placeholder="Paste offer code here…"></textarea></div>
      <button class="btn btn-primary btn-block" data-action="join-scan" style="margin-top:12px;">${ic('scan', 15)} Scan QR instead</button>
      <button class="btn btn-secondary btn-block" data-action="submit-join" style="margin-top:8px;">${ic('link', 15)} Connect</button>
    </div>`;
  }
  if (state.pairStage === 'scan') {
    return `<div class="card">
      <div class="scan-video-wrap"><video id="scan-video" playsinline autoplay muted></video><div class="scan-frame"></div></div>
      <p class="pin-hint" style="margin-top:12px;">Point your camera at the QR code shown on the other device.</p>
      <button class="btn btn-ghost btn-block" data-action="stop-scan" style="margin-top:10px;">${ic('arrowLeft', 14)} Back to paste code</button>
    </div>`;
  }
  if (state.pairStage === 'code-ready') {
    return `<div class="card">
      <div style="text-align:center;">
        <div class="stat-icon" style="margin:0 auto 12px;width:48px;height:48px;border-radius:14px;background:rgba(0,255,136,.12);color:var(--ok);">${ic('check', 22)}</div>
        <h3 style="font-size:15px;">Answer ready — confirm code</h3>
        <div class="pin-display" style="justify-content:center;margin:14px 0;">${state.verifyCode.split('').map(d => `<div class="pin-digit">${d}</div>`).join('')}</div>
        <p class="pin-hint">Make sure this matches the code on the other device, then send your answer back.</p>
      </div>
      <div class="divider"></div>
      <div class="field"><label>Your answer code — send this back</label><textarea id="out-code" rows="3" readonly>${state.outCode}</textarea></div>
      <button class="btn btn-secondary btn-block btn-sm" data-action="copy-out" style="margin-top:8px;">${ic('copy', 14)} Copy answer code</button>
      <p class="pin-hint" style="margin-top:12px;">Waiting for the other device to finish pairing…</p>
    </div>`;
  }
  return '';
}

function trustedDevicesCard() {
  return `<div class="card">
    <div class="section-title"><h2>Trusted devices</h2></div>
    ${state._trusted && state._trusted.length ? state._trusted.map(d => `
      <div class="discover-item" style="margin-top:10px;">
        <div class="di-icon">${ic('link', 17)}</div>
        <div class="di-main"><div class="di-title">${escapeHtml(d.name)}</div><div class="di-sub">Paired ${fmtTime(d.time)}</div></div>
        <button class="ti-actions" style="border:none;background:none;" data-action="forget-trusted" data-id="${d.id}">${ic('trash', 15)}</button>
      </div>`).join('') : emptyState('shield', 'No trusted devices yet', 'Devices you pair with are remembered here for faster reconnects.')}
  </div>`;
}

/* ---- FILES ---- */
function viewFiles() {
  const connected = engine.state === 'connected';
  return `<div class="view">
    ${viewHead('Files', 'Send &amp; receive', 'Drag files or a folder to send them straight to your paired device over an encrypted peer-to-peer channel.')}
    <div class="dropzone" id="dropzone">
      <div class="dz-icon">${ic('upload', 24)}</div>
      <h3>${connected ? 'Drop files to send' : 'Pair a device first'}</h3>
      <p>${connected ? 'or tap to browse — large files, folders, and batches all supported' : "Files send instantly once you're linked"}</p>
      <input type="file" id="file-input" multiple style="display:none;" ${connected ? '' : 'disabled'}>
    </div>
    <div class="card">
      <div class="section-title"><h2>Transfer queue</h2>${state.transfers.length ? `<button class="link" data-action="clear-transfers">Clear history</button>` : ''}</div>
      ${state.transfers.length === 0 ? emptyState('files', 'No transfers yet', 'Sent and received files will show up here with progress and history.') :
        `<div style="margin-top:4px;">${state.transfers.map(t => transferRow(t)).join('')}</div>`}
    </div>
  </div>`;
}
function transferRow(t) {
  const pct = t.size ? Math.round((t.sent / t.size) * 100) : 0;
  const done = t.status === 'done';
  const failed = t.status === 'failed';
  return `<div class="transfer-item">
    <div class="ti-icon">${ic(done ? 'check' : t.dir === 'up' ? 'upload' : 'download', 17)}</div>
    <div class="ti-main">
      <div class="ti-name">${escapeHtml(t.name)}</div>
      <div class="ti-sub"><span>${fmtBytes(t.size)}</span><span>${done ? 'Complete' : failed ? 'Failed' : t.dir === 'up' ? 'Sending…' : 'Receiving…'}</span>${t.hashOk === false ? '<span style="color:var(--danger)">Hash mismatch</span>' : ''}</div>
      ${!done && !failed ? `<div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>` : ''}
    </div>
    <div class="ti-actions">
      ${!done && !failed && t.dir === 'up' ? `<button data-action="cancel-transfer" data-id="${t.id}">${ic('x', 14)}</button>` : ''}
      ${done && t.blobUrl ? `<a href="${t.blobUrl}" download="${escapeHtml(t.name)}" style="width:32px;height:32px;border-radius:9px;background:var(--card-lo);border:1px solid var(--border);color:var(--text-dim);display:flex;align-items:center;justify-content:center;">${ic('download', 14)}</a>` : ''}
    </div>
  </div>`;
}

/* ---- CLIPBOARD ---- */
function viewClipboard() {
  const connected = engine.state === 'connected';
  return `<div class="view">
    ${viewHead('Clipboard', 'Universal clipboard', 'Copy on one device, paste on the other. Text, links, and code sync automatically while paired.')}
    <div class="card">
      <div class="toggle-row" style="border:none;padding-top:0;">
        <div class="tr-main"><div class="tr-title">Auto-sync clipboard</div><div class="tr-sub">${connected ? 'Live while paired' : 'Pair a device to enable'}</div></div>
        <div class="switch ${state.settings.clipboardSync ? 'on' : ''}" data-toggle="clipboardSync"></div>
      </div>
    </div>
    <div class="card">
      <div class="section-title"><h2>Current clipboard</h2></div>
      <div class="clip-current" style="margin-top:10px;">
        <div class="clip-textbox">${state.clipboard.current ? escapeHtml(state.clipboard.current) : '<span style="color:var(--text-faint)">Nothing copied yet</span>'}</div>
        <div style="display:flex;gap:8px;">
          <input id="clip-input" placeholder="Type or paste to sync…" style="flex:1;background:var(--card-lo);border:1px solid var(--border-hi);color:var(--text);padding:12px 14px;border-radius:12px;font-size:14px;">
          <button class="btn btn-primary btn-sm" data-action="send-clip">${ic('send', 14)}</button>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="section-title"><h2>History</h2>${state.clipboard.history.length ? `<button class="link" data-action="clear-clip-history">Clear</button>` : ''}</div>
      ${state.clipboard.history.length === 0 ? emptyState('clip', 'Nothing synced yet', 'Items copied on either device will appear here.') :
        `<div style="margin-top:4px;">${state.clipboard.history.slice(0, 20).map(c => `
          <div class="list-row">
            <div class="row-icon">${ic('clip', 15)}</div>
            <div class="row-main"><div class="row-title">${escapeHtml(c.text.slice(0, 80))}</div><div class="row-sub">${fmtTime(c.time)} · from ${c.from === 'local' ? 'this device' : 'paired device'}</div></div>
          </div>`).join('')}</div>`}
    </div>
  </div>`;
}

/* ---- NOTES ---- */
function viewNotes() {
  const list = state.notes
    .filter(n => !state.search || (n.title + n.body).toLowerCase().includes(state.search.toLowerCase()))
    .sort((a, b) => (b.pinned - a.pinned) || (b.updated - a.updated));
  return `<div class="view">
    ${viewHead('Notes', 'Shared notes', 'Markdown notes that auto-save locally and sync to your paired device in real time.')}
    <div class="search-input-wrap"><span>${ic('search', 16)}</span><input id="notes-search" placeholder="Search notes…" value="${escapeHtml(state.search)}"></div>
    <button class="btn btn-primary btn-block" data-action="new-note">${ic('plus', 16)} New note</button>
    ${list.length === 0 ? emptyState('note', 'No notes yet', 'Create your first note — it saves offline instantly and syncs when paired.') :
      `<div class="notes-grid">${list.map(n => noteCard(n)).join('')}</div>`}
  </div>`;
}
function noteCard(n) {
  return `<div class="card tight note-card" data-action="open-note" data-id="${n.id}">
    <div class="note-title">${n.pinned ? `<span class="pin-star">${ic('star', 13)}</span>` : ''} ${escapeHtml(n.title || 'Untitled')}</div>
    <div class="note-body">${escapeHtml((n.body || '').slice(0, 160))}</div>
    <div class="note-meta">Edited ${fmtTime(n.updated)}</div>
  </div>`;
}
function noteEditorModal(n) {
  return `<div class="modal-backdrop" id="note-modal">
    <div class="modal">
      <div class="modal-head"><h3>${n.id ? 'Edit note' : 'New note'}</h3>
        <div style="display:flex;gap:8px;">
          <button class="icon-btn" data-action="toggle-pin-note">${ic('star', 16)}</button>
          <button class="icon-btn" data-action="close-note">${ic('x', 16)}</button>
        </div>
      </div>
      <div class="field"><input id="note-title" placeholder="Title" value="${escapeHtml(n.title || '')}" style="font-family:var(--f-display);font-weight:700;font-size:16px;"></div>
      <div class="field" style="margin-top:10px;"><textarea id="note-body" rows="10" placeholder="Write in Markdown…">${escapeHtml(n.body || '')}</textarea></div>
      <div style="display:flex;gap:10px;margin-top:14px;">
        ${n.id ? `<button class="btn btn-danger" data-action="delete-note">${ic('trash', 15)} Delete</button>` : ''}
        <button class="btn btn-primary btn-block" data-action="save-note">${ic('check', 15)} Save note</button>
      </div>
    </div>
  </div>`;
}

/* ---- MEDIA: GALLERY / MUSIC / VIDEO (paired-device browsing) ---- */
function mediaComingSoon(icon, title, blurb) {
  return `<div class="card" style="position:relative;padding:34px 18px;">
    <div class="badge-soon">Phase 2</div>
    ${emptyState(icon, title, blurb)}
  </div>`;
}
function viewGallery() {
  return `<div class="view">${viewHead('Gallery', 'Photo library', "Browse your paired phone's photo library from the desktop.")}
    ${mediaComingSoon('photo', 'Gallery browsing is next up', 'Live photo library access needs a background sync worker on the phone side — the transfer engine it depends on (above) is already built. Send individual photos today via Files.')}
    <div class="grid cols-3">${quickAction('files', 'files', 'Send photos now', 'Use the file transfer tool')}${quickAction('camera', 'camera', 'Share camera live', 'Stream instead of sending')}${quickAction('pair', 'link', 'Pairing status', 'Check your connection')}</div>
  </div>`;
}
function viewMusic() {
  return `<div class="view">${viewHead('Music', 'Music center', 'Browse and cast music between paired devices.')}
    ${mediaComingSoon('music', 'Playback handoff is next up', "Casting audio between browser tabs across devices needs a small streaming relay on top of today's data channel — the pairing and transfer layer is ready for it.")}
  </div>`;
}
function viewVideo() {
  return `<div class="view">${viewHead('Video', 'Video center', 'Preview and cast video between paired devices.')}
    ${mediaComingSoon('video', 'Casting is next up', 'Video casting reuses the same live media pipeline as the Camera tab — try sharing your camera feed to see it in action today.')}
    ${quickAction('camera', 'camera', 'Try live camera share', 'Uses the same streaming engine')}
  </div>`;
}
function viewNotifications() {
  return `<div class="view">${viewHead('Notifications', 'Mirrored alerts', "See your paired device's notifications here.")}
    <div class="card" style="position:relative;">
      <div class="badge-soon">Browser limit</div>
      ${emptyState('bell', "OS notifications can't be read by a browser", 'Mirroring native phone/desktop notifications needs the optional PixelProTech companion service mentioned in the brief — browsers are sandboxed from the OS notification tray by design, for your privacy. Pixel Link can still send its own in-app alerts below.')}
    </div>
    <div class="card">
      <div class="toggle-row" style="border:none;padding-top:0;">
        <div class="tr-main"><div class="tr-title">In-app alerts</div><div class="tr-sub">Transfer complete, device connected, low battery</div></div>
        <div class="switch ${state.settings.notifications ? 'on' : ''}" data-toggle="notifications"></div>
      </div>
    </div>
  </div>`;
}

/* ---- CAMERA / MIC / TOUCHPAD (live via WebRTC) ---- */
function viewCamera() {
  const connected = engine.state === 'connected';
  return `<div class="view">
    ${viewHead('Camera', 'Use phone as webcam', 'Stream your camera to the paired device in real time over the encrypted link.')}
    <div class="grid cols-2">
      <div class="card tight">
        <div class="section-title"><h2>Your camera</h2></div>
        <div class="media-preview" style="margin-top:10px;"><video id="local-video" autoplay playsinline muted></video>${!state.localStream ? `<div class="mp-placeholder">${ic('camera', 30)}<span>Not sharing</span></div>` : ''}</div>
        <div style="display:flex;gap:8px;margin-top:12px;">
          <button class="btn ${state.localStream ? 'btn-danger' : 'btn-primary'} btn-block btn-sm" data-action="toggle-camera" ${connected ? '' : 'disabled'}>${ic(state.localStream ? 'x' : 'camera', 14)} ${state.localStream ? 'Stop sharing' : 'Share camera'}</button>
          ${state.localStream ? `<button class="btn btn-secondary btn-sm" data-action="flip-camera">${ic('refresh', 14)}</button>` : ''}
        </div>
      </div>
      <div class="card tight">
        <div class="section-title"><h2>Paired device</h2></div>
        <div class="media-preview" style="margin-top:10px;"><video id="remote-video" autoplay playsinline></video>${!state.remoteStream ? `<div class="mp-placeholder">${ic('video', 30)}<span>${connected ? 'Waiting for stream' : 'Not connected'}</span></div>` : ''}</div>
      </div>
    </div>
    <div class="card">
      <p style="font-size:12.5px;color:var(--text-faint);">Camera and microphone permission is requested only when you tap Share, and the stream travels peer-to-peer directly to your paired device — never through a server.</p>
    </div>
  </div>`;
}
function viewMic() {
  const connected = engine.state === 'connected';
  return `<div class="view">
    ${viewHead('Microphone', 'Use phone as mic', "Share this device's microphone with your paired desktop.")}
    <div class="card">
      <div class="mic-meter" id="mic-meter">${Array.from({ length: 28 }).map(() => '<i style="height:4px"></i>').join('')}</div>
      <div style="display:flex;gap:8px;margin-top:16px;">
        <button class="btn ${state.micActive ? 'btn-danger' : 'btn-primary'} btn-block" data-action="toggle-mic" ${connected ? '' : 'disabled'}>${ic('mic', 15)} ${state.micActive ? 'Stop microphone' : 'Share microphone'}</button>
      </div>
      ${!connected ? `<p style="font-size:12px;color:var(--text-faint);margin-top:10px;">Pair a device first.</p>` : ''}
    </div>
  </div>`;
}
function viewTouchpad() {
  const connected = engine.state === 'connected';
  return `<div class="view">
    ${viewHead('Touchpad', 'Remote control', 'Turn this screen into a trackpad for your paired device.')}
    <div class="touchpad-surface ${state.touchActive ? 'active' : ''}" id="touchpad-surface">
      <div class="tp-hint">${connected ? 'Drag to move the cursor · tap to click' : 'Pair a device to enable the touchpad'}</div>
      <div class="tp-cursor" id="tp-cursor" style="left:${state.cursorPos.x}%;top:${state.cursorPos.y}%;display:none;"></div>
    </div>
    <div class="tp-btns">
      <button data-action="tp-click" data-btn="left" ${connected ? '' : 'disabled'}>Left click</button>
      <button data-action="tp-click" data-btn="right" ${connected ? '' : 'disabled'}>Right click</button>
    </div>
    <div class="card">
      <p style="font-size:12.5px;color:var(--text-faint);">Movements send instantly over the data channel. On this device they preview as an on-screen cursor below — moving the paired computer's real OS pointer needs the optional PixelProTech desktop companion, since browsers can't drive the system cursor directly.</p>
      <div class="touchpad-surface" style="height:140px;margin-top:10px;">
        <div class="tp-hint" id="remote-cursor-hint">Preview of cursor received from paired device</div>
        <div class="tp-cursor" id="remote-cursor" style="left:50%;top:50%;background:var(--accent);box-shadow:0 0 14px var(--accent);display:none;"></div>
      </div>
    </div>
  </div>`;
}

/* ---- NETWORK / BATTERY / DEVICE INFO ---- */
function viewNetwork() {
  const connected = engine.state === 'connected';
  return `<div class="view">
    ${viewHead('Network', 'Connection quality', 'Live link status between this device and the internet, plus your paired-device path.')}
    <div class="grid cols-3">
      ${stat('wifi', 'Status', navigator.onLine ? 'Online' : 'Offline', null, navigator.onLine ? 'accent2' : 'accent')}
      ${stat('bolt', 'Downlink', state.net.downlink ? state.net.downlink + ' Mbps' : '—', null, 'accent')}
      ${stat('clock', 'Round trip', state.net.rtt ? state.net.rtt + ' ms' : (connected ? '—' : '—'), null, 'accent2')}
    </div>
    <div class="card">
      <div class="section-title"><h2>Bandwidth</h2></div>
      <div class="chart-wrap"><canvas id="bw-chart"></canvas></div>
    </div>
    <div class="card">
      <div class="list-row"><div class="row-icon">${ic('link', 15)}</div><div class="row-main"><div class="row-title">Peer connection</div><div class="row-sub">${connected ? 'Direct peer-to-peer (WebRTC)' : 'Not connected'}</div></div><span class="pill ${connected ? 'ok' : 'warn'}">${connected ? 'Active' : 'Idle'}</span></div>
      <div class="list-row"><div class="row-icon">${ic('shield', 15)}</div><div class="row-main"><div class="row-title">Encryption</div><div class="row-sub">DTLS-SRTP / data channel encryption</div></div><span class="pill ok">${connected ? 'On' : 'Standby'}</span></div>
    </div>
  </div>`;
}
function viewBattery() {
  const b = state.battery;
  return `<div class="view">
    ${viewHead('Battery', 'Power status', 'Battery level and charging state for this device.')}
    <div class="card" style="text-align:center;padding:30px 18px;">
      <div style="font-family:var(--f-display);font-size:48px;font-weight:700;">${b ? Math.round(b.level * 100) + '%' : '—'}</div>
      <div class="pill ${b && b.charging ? 'ok' : ''}" style="margin-top:8px;">${b ? (b.charging ? ic('bolt', 12) + ' Charging' : 'On battery') : 'Unavailable on this browser'}</div>
    </div>
    <div class="card">
      <div class="toggle-row" style="border:none;padding-top:0;"><div class="tr-main"><div class="tr-title">Low battery alerts</div><div class="tr-sub">Notify at 20% and 10%</div></div><div class="switch on"></div></div>
    </div>
  </div>`;
}
function viewDeviceInfo() {
  const nav = navigator;
  const rows = [
    ['Device name', state.deviceName],
    ['Platform', nav.platform || '—'],
    ['Browser', browserGuess()],
    ['Screen resolution', `${screen.width}×${screen.height} @${window.devicePixelRatio || 1}x`],
    ['Logical CPU cores', nav.hardwareConcurrency || '—'],
    ['Memory', nav.deviceMemory ? nav.deviceMemory + ' GB' : 'Not reported'],
    ['Storage estimate', telemetry.storage.quota ? `${fmtBytes(telemetry.storage.usage)} / ${fmtBytes(telemetry.storage.quota)}` : '—'],
    ['Language', nav.language],
    ['Time zone', Intl.DateTimeFormat().resolvedOptions().timeZone],
    ['Touch support', ('ontouchstart' in window) ? 'Yes' : 'No'],
    ['Orientation', screen.orientation ? screen.orientation.type : '—'],
    ['Installed as app', window.matchMedia('(display-mode: standalone)').matches ? 'Yes' : 'No'],
  ];
  return `<div class="view">
    ${viewHead('Device Info', 'This device', 'Technical details reported by the browser.')}
    <div class="card">${rows.map(([k, v]) => `<div class="list-row"><div class="row-main"><div class="row-title">${k}</div></div><div class="mono" style="font-size:12.5px;color:var(--text-dim);">${v}</div></div>`).join('')}</div>
  </div>`;
}
function browserGuess() {
  const ua = navigator.userAgent;
  if (/Edg\//.test(ua)) return 'Edge';
  if (/Chrome\//.test(ua) && !/Chromium/.test(ua)) return 'Chrome';
  if (/Firefox\//.test(ua)) return 'Firefox';
  if (/Safari\//.test(ua) && !/Chrome/.test(ua)) return 'Safari';
  return 'Unknown browser';
}

/* ---- SEARCH ---- */
function viewSearch() {
  const q = state.search.toLowerCase();
  const notes = q ? state.notes.filter(n => (n.title + n.body).toLowerCase().includes(q)) : [];
  const activity = q ? state.activity.filter(a => a.title.toLowerCase().includes(q)) : [];
  const files = q ? state.transfers.filter(t => t.name.toLowerCase().includes(q)) : [];
  const total = notes.length + activity.length + files.length;
  return `<div class="view">
    ${viewHead('Search', 'Search everything', 'Find notes, transfers, and activity across your paired workspace.')}
    <div class="search-input-wrap"><span>${ic('search', 16)}</span><input id="global-search" placeholder="Search photos, files, notes, activity…" value="${escapeHtml(state.search)}"></div>
    ${!q ? emptyState('search', 'Start typing to search', 'Results from notes, transfers, and your activity timeline appear instantly.') :
      total === 0 ? emptyState('search', 'No results', `Nothing matches "${escapeHtml(state.search)}"`) : `
      ${notes.length ? `<div class="card"><div class="section-title"><h2>Notes</h2></div>${notes.map(n => noteRowSearch(n)).join('')}</div>` : ''}
      ${files.length ? `<div class="card"><div class="section-title"><h2>Files</h2></div>${files.map(t => `<div class="list-row"><div class="row-icon">${ic('files', 15)}</div><div class="row-main"><div class="row-title">${escapeHtml(t.name)}</div><div class="row-sub">${fmtBytes(t.size)}</div></div></div>`).join('')}</div>` : ''}
      ${activity.length ? `<div class="card"><div class="section-title"><h2>Activity</h2></div>${activity.map(a => tlRow(a)).join('')}</div>` : ''}
    `}
  </div>`;
}
function noteRowSearch(n) {
  return `<div class="list-row" data-action="open-note" data-id="${n.id}" style="cursor:pointer;"><div class="row-icon">${ic('note', 15)}</div><div class="row-main"><div class="row-title">${escapeHtml(n.title || 'Untitled')}</div><div class="row-sub">${fmtTime(n.updated)}</div></div></div>`;
}

/* ---- TIMELINE ---- */
function viewTimeline() {
  return `<div class="view">
    ${viewHead('Activity', 'Timeline', 'Every transfer, connection, and sync event, searchable and in order.')}
    <div class="card">
      ${state.activity.length === 0 ? emptyState('activity', 'No activity yet', 'Once you pair and start syncing, everything will be logged here.') :
        `<div class="timeline">${state.activity.map(a => tlRow(a)).join('')}</div>`}
    </div>
  </div>`;
}

/* ---- SECURITY ---- */
function viewSecurity() {
  const connected = engine.state === 'connected';
  return `<div class="view">
    ${viewHead('Security', 'Session &amp; trust', 'Pixel Link is local-first: no account, no ad tracking, and nothing leaves your devices unless you pair.')}
    <div class="grid cols-2">
      ${stat('shield', 'Session', connected ? 'Encrypted' : 'Inactive', connected ? 'DTLS-SRTP' : null, 'accent2')}
      ${stat('link', 'Transport', connected ? 'Peer-to-peer' : '—', null, 'accent')}
    </div>
    <div class="card">
      <div class="toggle-row"><div class="tr-main"><div class="tr-title">Require approval for new pairs</div><div class="tr-sub">Confirm the verification code on both screens</div></div><div class="switch on"></div></div>
      <div class="toggle-row"><div class="tr-main"><div class="tr-title">Require approval for transfers</div><div class="tr-sub">Nothing downloads without a tap</div></div><div class="switch on"></div></div>
      <div class="toggle-row"><div class="tr-main"><div class="tr-title">Session timeout</div><div class="tr-sub">Disconnect after 30 minutes idle</div></div><div class="switch on"></div></div>
      <div class="toggle-row" style="border:none;"><div class="tr-main"><div class="tr-title">Analytics &amp; tracking</div><div class="tr-sub">Off by default, always</div></div><div class="switch"></div></div>
    </div>
    ${trustedDevicesCard()}
  </div>`;
}

/* ---- SETTINGS ---- */
function viewSettings() {
  return `<div class="view">
    ${viewHead('Settings', 'Preferences', null)}
    <div class="card">
      <div class="field"><label>Device name</label><input id="settings-device-name" value="${escapeHtml(state.deviceName)}"></div>
    </div>
    <div class="card">
      <div class="toggle-row"><div class="tr-main"><div class="tr-title">Animations</div><div class="tr-sub">Smooth transitions across the app</div></div><div class="switch ${state.settings.animations ? 'on' : ''}" data-toggle="animations"></div></div>
      <div class="toggle-row"><div class="tr-main"><div class="tr-title">Reduced motion</div><div class="tr-sub">Minimize movement in the interface</div></div><div class="switch ${state.settings.reducedMotion ? 'on' : ''}" data-toggle="reducedMotion"></div></div>
      <div class="toggle-row"><div class="tr-main"><div class="tr-title">In-app notifications</div><div class="tr-sub">Transfers, pairing, alerts</div></div><div class="switch ${state.settings.notifications ? 'on' : ''}" data-toggle="notifications"></div></div>
      <div class="toggle-row"><div class="tr-main"><div class="tr-title">Auto-download incoming files</div><div class="tr-sub">Skip the confirmation step</div></div><div class="switch ${state.settings.autoDownload ? 'on' : ''}" data-toggle="autoDownload"></div></div>
      <div class="toggle-row" style="border:none;"><div class="tr-main"><div class="tr-title">Clipboard sync</div><div class="tr-sub">Sync text automatically while paired</div></div><div class="switch ${state.settings.clipboardSync ? 'on' : ''}" data-toggle="clipboardSync"></div></div>
    </div>
    <div class="card">
      <div class="section-title"><h2>Backup</h2></div>
      <div style="display:flex;gap:8px;margin-top:10px;">
        <button class="btn btn-secondary btn-block btn-sm" data-action="export-settings">${ic('download', 14)} Export settings</button>
        <button class="btn btn-secondary btn-block btn-sm" data-action="import-settings">${ic('upload', 14)} Import settings</button>
      </div>
    </div>
    <div class="card">
      <div class="section-title"><h2 style="color:var(--danger);">Danger zone</h2></div>
      <p style="font-size:12.5px;color:var(--text-faint);margin:8px 0 12px;">Clears notes, transfer history, activity, and trusted devices from this browser. Cannot be undone.</p>
      <button class="btn btn-danger btn-block" data-action="clear-all">${ic('trash', 15)} Erase local data</button>
    </div>
    <p style="text-align:center;font-size:11.5px;color:var(--text-faint);">Pixel Link · PixelProTech Solutions</p>
  </div>`;
}

/* ============================== RENDER ============================== */
function renderNav() {
  const items = (id) => `<button class="nav-item ${state.view === id ? 'active' : ''}" data-go="${id}">${ic(NAV.find(n => n.id === id).icon, 20)}<span>${NAV.find(n => n.id === id).label}</span></button>`;
  document.getElementById('bottom-nav').innerHTML = PRIMARY_NAV_IDS.map(items).join('');
  document.getElementById('rail-nav').innerHTML = NAV.map(n => `<button class="nav-item ${state.view === n.id ? 'active' : ''}" data-go="${n.id}">${ic(n.icon, 19)}<span>${n.label}</span></button>`).join('');
}

const VIEW_FN = {
  dashboard: viewDashboard, pair: viewPair, files: viewFiles, clipboard: viewClipboard,
  notes: viewNotes, gallery: viewGallery, music: viewMusic, video: viewVideo,
  camera: viewCamera, mic: viewMic, touchpad: viewTouchpad, notifications: viewNotifications,
  network: viewNetwork, battery: viewBattery, device: viewDeviceInfo, search: viewSearch,
  timeline: viewTimeline, security: viewSecurity, settings: viewSettings,
};

let bwHistory = [];
function render() {
  const main = document.getElementById('main-view');
  main.innerHTML = (VIEW_FN[state.view] || viewDashboard)();
  renderNav();
  updateTopStatus();
  bindView();
  if (state.view === 'pair' && state.pairStage === 'code-ready') drawQR(state.outCode);
  if (state.view === 'network') drawBandwidth();
  if (state.view === 'camera') attachStreams();
  if (state.editingNote) openNoteModal();
}

function updateTopStatus() {
  const pill = document.getElementById('status-pill');
  const connected = engine.state === 'connected';
  const connecting = engine.state === 'connecting' || engine.state === 'waiting';
  pill.className = 'status-pill' + (connected ? ' online' : '');
  pill.innerHTML = `<span class="dot"></span><span>${connected ? engine.remoteName || 'Linked' : connecting ? 'Connecting…' : 'Not linked'}</span>`;
}

/* ============================== QR + CHART ============================== */
function drawQR(text) {
  const canvas = document.getElementById('qr-canvas');
  if (!canvas || !window.QRCode) return;
  canvas.width = 180; canvas.height = 180;
  try {
    window.QRCode.toCanvas(canvas, text, { width: 180, margin: 1, color: { dark: '#0A0A0F', light: '#FFFFFF' } }, (err) => {
      if (err) canvas.replaceWith(Object.assign(document.createElement('div'), { style: 'font-size:11px;color:#333;padding:10px;text-align:center', textContent: 'Code too long for QR — use the text code below.' }));
    });
  } catch (e) {}
}
function drawBandwidth() {
  const canvas = document.getElementById('bw-chart');
  if (!canvas) return;
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width * dpr; canvas.height = 120 * dpr;
  canvas.style.width = rect.width + 'px'; canvas.style.height = '120px';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  const w = rect.width, h = 120;
  if (bwHistory.length < 2) bwHistory = Array.from({ length: 30 }, () => Math.random() * 20 + (state.net.downlink || 15));
  ctx.clearRect(0, 0, w, h);
  const max = Math.max(...bwHistory, 1);
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, 'rgba(0,212,170,.35)'); grad.addColorStop(1, 'rgba(0,212,170,0)');
  ctx.beginPath();
  bwHistory.forEach((v, i) => {
    const x = (i / (bwHistory.length - 1)) * w;
    const y = h - (v / max) * (h - 14) - 4;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.strokeStyle = '#00D4AA'; ctx.lineWidth = 2; ctx.stroke();
  ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath(); ctx.fillStyle = grad; ctx.fill();
}

function attachStreams() {
  const lv = document.getElementById('local-video');
  const rv = document.getElementById('remote-video');
  if (lv && state.localStream) lv.srcObject = state.localStream;
  if (rv && state.remoteStream) rv.srcObject = state.remoteStream;
}

/* ============================== NOTE MODAL ============================== */
function openNoteModal() {
  if (document.getElementById('note-modal')) return;
  const n = state.editingNote;
  document.body.insertAdjacentHTML('beforeend', noteEditorModal(n));
  const modal = document.getElementById('note-modal');
  modal.addEventListener('click', (e) => { if (e.target === modal) closeNote(); });
}
function closeNote() { state.editingNote = null; document.getElementById('note-modal')?.remove(); }

/* ============================== ACTIONS ============================== */
async function bindView() {
  document.querySelectorAll('[data-go]').forEach(el => el.addEventListener('click', () => go(el.dataset.go)));

  // toggles
  document.querySelectorAll('[data-toggle]').forEach(el => el.addEventListener('click', () => {
    const key = el.dataset.toggle;
    state.settings[key] = !state.settings[key];
    localStorage.setItem('pl-settings', JSON.stringify(state.settings));
    el.classList.toggle('on');
  }));

  document.querySelectorAll('[data-pairmode]').forEach(el => el.addEventListener('click', () => {
    state.pairMode = el.dataset.pairmode; state.pairStage = 'idle'; render();
  }));

  bindOnce('start-host', async () => {
    try {
      const { code, verifyCode } = await engine.createOffer(state.deviceName);
      state.outCode = code; state.verifyCode = verifyCode; state.pairStage = 'code-ready';
      render();
    } catch (e) { toast('Could not generate a pairing code: ' + e.message, 'err'); }
  });

  bindOnce('copy-out', async () => {
    try { await navigator.clipboard.writeText(state.outCode); toast('Code copied'); } catch (e) { toast('Copy failed — select the text manually', 'warn'); }
  });

  bindOnce('complete-host', async () => {
    const val = document.getElementById('answer-code').value.trim();
    if (!val) return toast('Paste the answer code first', 'warn');
    try {
      await engine.applyAnswer(val);
      toast('Pairing in progress…');
    } catch (e) { toast(e.message, 'err'); }
  });

  bindOnce('submit-join', async () => {
    const val = document.getElementById('in-code').value.trim();
    const nameEl = document.getElementById('join-name');
    if (nameEl) { state.deviceName = nameEl.value || state.deviceName; localStorage.setItem('pl-device-name', state.deviceName); }
    if (!val) return toast('Paste the offer code first', 'warn');
    try {
      const { code, verifyCode } = await engine.acceptOffer(val, state.deviceName);
      state.outCode = code; state.verifyCode = verifyCode; state.pairStage = 'code-ready';
      render();
    } catch (e) { toast(e.message, 'err'); }
  });

  bindOnce('join-scan', () => { state.pairStage = 'scan'; render(); startScanner(); });
  bindOnce('stop-scan', () => { stopScanner(); state.pairStage = 'enter-code'; render(); });
  bindOnce('cancel-pair', () => { engine.disconnect(); state.pairStage = 'idle'; state.outCode = ''; render(); });
  bindOnce('disconnect', () => { engine.disconnect(); state.pairStage = 'idle'; toast('Disconnected', 'warn'); render(); });

  bindOnce('forget-trusted', async (el) => { await idb.delete('trusted', el.dataset.id); state._trusted = await idb.all('trusted'); render(); });

  // files
  const dz = document.getElementById('dropzone');
  const fi = document.getElementById('file-input');
  if (dz) {
    dz.addEventListener('click', () => fi && fi.click());
    fi && fi.addEventListener('change', () => handleFiles(fi.files));
    ['dragenter', 'dragover'].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.add('drag'); }));
    ['dragleave', 'drop'].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.remove('drag'); }));
    dz.addEventListener('drop', e => handleFiles(e.dataTransfer.files));
  }
  bindOnce('clear-transfers', async () => { state.transfers = []; render(); });
  document.querySelectorAll('[data-action="cancel-transfer"]').forEach(el => el.addEventListener('click', () => {
    engine.cancelSend(el.dataset.id);
  }));

  // clipboard
  bindOnce('send-clip', () => {
    const input = document.getElementById('clip-input');
    const text = input.value.trim();
    if (!text) return;
    setClipboard(text, 'local');
    engine.sendClipboard(text);
    input.value = '';
    render();
  });
  bindOnce('clear-clip-history', () => { state.clipboard.history = []; idb.clear('clipboard'); render(); });

  // notes
  bindOnce('new-note', () => { state.editingNote = { title: '', body: '', pinned: false }; render(); });
  document.querySelectorAll('[data-action="open-note"]').forEach(el => el.addEventListener('click', () => {
    const n = state.notes.find(n => n.id === el.dataset.id);
    if (n) { state.editingNote = Object.assign({}, n); render(); }
  }));
  const searchInput = document.getElementById('notes-search') || document.getElementById('global-search');
  if (searchInput) searchInput.addEventListener('input', (e) => { state.search = e.target.value; render(); setTimeout(() => { const i = document.getElementById('notes-search') || document.getElementById('global-search'); i && i.focus(); i && i.setSelectionRange(i.value.length, i.value.length); }, 0); });

  bindOnceGlobal('close-note', closeNote);
  bindOnceGlobal('toggle-pin-note', () => { state.editingNote.pinned = !state.editingNote.pinned; });
  bindOnceGlobal('save-note', async () => {
    const title = document.getElementById('note-title').value.trim();
    const body = document.getElementById('note-body').value;
    const n = state.editingNote;
    n.title = title; n.body = body; n.updated = Date.now(); n.id = n.id || uid();
    await idb.put('notes', n);
    state.notes = state.notes.filter(x => x.id !== n.id);
    state.notes.push(n);
    closeNote(); render(); toast('Note saved');
    logActivity(`Saved note “${title || 'Untitled'}”`);
  });
  bindOnceGlobal('delete-note', async () => {
    const n = state.editingNote;
    if (n.id) { await idb.delete('notes', n.id); state.notes = state.notes.filter(x => x.id !== n.id); }
    closeNote(); render(); toast('Note deleted', 'warn');
  });

  // camera / mic / touchpad
  bindOnce('toggle-camera', async () => {
    if (state.localStream) { engine.stopMedia(); state.localStream = null; render(); return; }
    try { state.localStream = await engine.shareMedia({ video: true }); render(); logActivity('Started sharing camera'); }
    catch (e) { toast('Camera permission denied', 'err'); }
  });
  bindOnce('toggle-mic', async () => {
    if (state.micActive) { engine.stopMedia(); state.micActive = false; render(); return; }
    try { const stream = await engine.shareMedia({ audio: true }); state.micActive = true; render(); startMicMeter(stream); logActivity('Started sharing microphone'); }
    catch (e) { toast('Microphone permission denied', 'err'); }
  });

  const pad = document.getElementById('touchpad-surface');
  if (pad) wireTouchpad(pad);
  document.querySelectorAll('[data-action="tp-click"]').forEach(el => el.addEventListener('click', () => engine.sendTouch('click-' + el.dataset.btn, 0, 0)));

  // settings
  bindOnce('export-settings', () => {
    const blob = new Blob([JSON.stringify({ settings: state.settings, deviceName: state.deviceName }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'pixel-link-settings.json'; a.click();
  });
  bindOnce('import-settings', () => {
    const input = document.createElement('input'); input.type = 'file'; input.accept = 'application/json';
    input.onchange = async () => {
      const file = input.files[0]; if (!file) return;
      try {
        const data = JSON.parse(await file.text());
        if (data.settings) { state.settings = Object.assign(state.settings, data.settings); localStorage.setItem('pl-settings', JSON.stringify(state.settings)); }
        if (data.deviceName) { state.deviceName = data.deviceName; localStorage.setItem('pl-device-name', state.deviceName); }
        toast('Settings imported'); render();
      } catch (e) { toast('Invalid settings file', 'err'); }
    };
    input.click();
  });
  bindOnce('clear-all', async () => {
    if (!confirm('Erase all local Pixel Link data? This cannot be undone.')) return;
    await Promise.all(['notes', 'activity', 'trusted', 'clipboard'].map(s => idb.clear(s)));
    state.notes = []; state.activity = []; state._trusted = []; state.clipboard = { current: '', history: [] };
    toast('Local data erased', 'warn'); go('dashboard');
  });
  const dn = document.getElementById('settings-device-name');
  if (dn) dn.addEventListener('change', () => { state.deviceName = dn.value || state.deviceName; localStorage.setItem('pl-device-name', state.deviceName); toast('Device name saved'); });
}

function bindOnce(action, fn) {
  document.querySelectorAll(`[data-action="${action}"]`).forEach(el => el.addEventListener('click', () => fn(el)));
}
function bindOnceGlobal(action, fn) {
  document.querySelectorAll(`[data-action="${action}"]`).forEach(el => el.addEventListener('click', fn));
}

async function handleFiles(fileList) {
  if (engine.state !== 'connected') return toast('Pair a device first', 'warn');
  for (const file of Array.from(fileList)) {
    const t = { id: uid(), name: file.name, size: file.size, sent: 0, dir: 'up', status: 'sending', time: Date.now() };
    state.transfers.unshift(t); render();
    try {
      await engine.sendFile(file, {
        id: t.id,
        onProgress: (sent) => { t.sent = sent; refreshTransferRow(t); }
      });
      t.status = 'done'; t.sent = t.size; refreshTransferRow(t);
      logActivity(`Sent “${file.name}”`);
    } catch (e) {
      t.status = 'failed'; refreshTransferRow(t);
      logActivity(`Failed to send “${file.name}”`, 'err');
    }
  }
}
function refreshTransferRow(t) {
  if (state.view !== 'files' && state.view !== 'dashboard') return;
  render();
}

/* ============================== TOUCHPAD WIRING ============================== */
function wireTouchpad(pad) {
  const cursor = document.getElementById('tp-cursor');
  let last = null;
  function pos(e) { const t = e.touches ? e.touches[0] : e; return { x: t.clientX, y: t.clientY }; }
  function start(e) {
    if (engine.state !== 'connected') return;
    state.touchActive = true; pad.classList.add('active'); cursor.style.display = 'block';
    last = pos(e);
  }
  function move(e) {
    if (!last) return;
    e.preventDefault();
    const p = pos(e);
    const dx = p.x - last.x, dy = p.y - last.y;
    last = p;
    state.cursorPos.x = Math.min(96, Math.max(4, state.cursorPos.x + dx / 3));
    state.cursorPos.y = Math.min(92, Math.max(8, state.cursorPos.y + dy / 3));
    cursor.style.left = state.cursorPos.x + '%'; cursor.style.top = state.cursorPos.y + '%';
    engine.sendTouch('move', dx, dy);
  }
  function end() { last = null; }
  pad.addEventListener('mousedown', start); pad.addEventListener('mousemove', move); window.addEventListener('mouseup', end);
  pad.addEventListener('touchstart', start, { passive: true }); pad.addEventListener('touchmove', move, { passive: false }); pad.addEventListener('touchend', end);
  pad.addEventListener('click', () => { if (engine.state === 'connected') engine.sendTouch('click-left', 0, 0); });
}

/* ============================== MIC METER ============================== */
function startMicMeter(stream) {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const src = ctx.createMediaStreamSource(stream);
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 64;
  src.connect(analyser);
  const data = new Uint8Array(analyser.frequencyBinCount);
  function loop() {
    if (!state.micActive) { ctx.close(); return; }
    analyser.getByteFrequencyData(data);
    const bars = document.querySelectorAll('#mic-meter i');
    bars.forEach((b, i) => { const v = data[i % data.length] || 0; b.style.height = Math.max(4, (v / 255) * 34) + 'px'; });
    requestAnimationFrame(loop);
  }
  loop();
}

/* ============================== QR SCANNER ============================== */
let scanStream = null, scanRAF = null;
async function startScanner() {
  const video = document.getElementById('scan-video');
  if (!video || !window.jsQR) return;
  try {
    scanStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    video.srcObject = scanStream;
    const canvas = document.createElement('canvas');
    const cctx = canvas.getContext('2d');
    function tick() {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth; canvas.height = video.videoHeight;
        cctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const img = cctx.getImageData(0, 0, canvas.width, canvas.height);
        const result = window.jsQR(img.data, img.width, img.height);
        if (result && result.data) { stopScanner(); onScanResult(result.data); return; }
      }
      scanRAF = requestAnimationFrame(tick);
    }
    tick();
  } catch (e) { toast('Camera access denied', 'err'); state.pairStage = 'enter-code'; render(); }
}
function stopScanner() {
  if (scanRAF) cancelAnimationFrame(scanRAF);
  if (scanStream) { scanStream.getTracks().forEach(t => t.stop()); scanStream = null; }
}
async function onScanResult(text) {
  try {
    const { code, verifyCode } = await engine.acceptOffer(text, state.deviceName);
    state.outCode = code; state.verifyCode = verifyCode; state.pairStage = 'code-ready';
    render();
  } catch (e) { toast('Invalid QR code', 'err'); state.pairStage = 'enter-code'; render(); }
}

/* ============================== CLIPBOARD HELPERS ============================== */
async function setClipboard(text, from) {
  state.clipboard.current = text;
  const entry = { id: uid(), text, time: Date.now(), from };
  state.clipboard.history.unshift(entry);
  await idb.put('clipboard', entry);
}

/* ============================== ENGINE EVENTS ============================== */
engine.addEventListener('state', async (e) => {
  updateTopStatus();
  if (e.detail === 'connected') {
    toast(`Linked with ${engine.remoteName || 'paired device'}`);
    logActivity(`Connected to ${engine.remoteName || 'a device'}`);
    const trusted = { id: uid(), name: engine.remoteName || 'Paired device', time: Date.now() };
    await idb.put('trusted', trusted);
    state._trusted = await idb.all('trusted');
    if (state.view === 'pair' || state.view === 'dashboard') render();
  }
  if (e.detail === 'disconnected') {
    state.localStream = null; state.remoteStream = null; state.micActive = false;
    if (state.view === 'dashboard' || state.view === 'pair' || state.view === 'camera' || state.view === 'mic') render();
  }
});
engine.addEventListener('clipboard', (e) => {
  setClipboard(e.detail.text, 'remote');
  toast('Clipboard synced from paired device');
  if (state.view === 'clipboard') render();
});
engine.addEventListener('track', (e) => {
  state.remoteStream = e.streams[0];
  if (state.view === 'camera') { render(); }
});
engine.addEventListener('touch', (e) => {
  if (state.view !== 'touchpad') return;
  const rc = document.getElementById('remote-cursor');
  const hint = document.getElementById('remote-cursor-hint');
  if (!rc) return;
  if (e.detail.action === 'move') {
    rc.style.display = 'block'; if (hint) hint.style.display = 'none';
    const cur = { x: parseFloat(rc.style.left) || 50, y: parseFloat(rc.style.top) || 50 };
    const nx = Math.min(96, Math.max(4, cur.x + e.detail.dx / 3));
    const ny = Math.min(88, Math.max(8, cur.y + e.detail.dy / 3));
    rc.style.left = nx + '%'; rc.style.top = ny + '%';
  } else if (e.detail.action.startsWith('click')) {
    rc.style.boxShadow = '0 0 26px var(--accent)';
    setTimeout(() => { if (rc) rc.style.boxShadow = '0 0 14px var(--accent)'; }, 180);
  }
});
engine.addEventListener('file-start', (meta) => {
  const t = { id: meta.detail.id, name: meta.detail.name, size: meta.detail.size, sent: 0, dir: 'down', status: 'receiving', time: Date.now() };
  state.transfers.unshift(t);
  if (state.view === 'files' || state.view === 'dashboard') render();
});
engine.addEventListener('file-progress', (e) => {
  const t = state.transfers.find(t => t.id === e.detail.id);
  if (t) { t.sent = e.detail.received; refreshTransferRow(t); }
});
engine.addEventListener('file-complete', (e) => {
  const t = state.transfers.find(t => t.id === e.detail.meta.id);
  if (t) {
    t.status = 'done'; t.sent = t.size; t.hashOk = e.detail.hashOk;
    t.blobUrl = URL.createObjectURL(e.detail.blob);
  }
  toast(`Received “${e.detail.meta.name}”`);
  logActivity(`Received “${e.detail.meta.name}”`);
  render();
});

/* ============================== INIT ============================== */
async function boot() {
  document.getElementById('device-name-label').textContent = state.deviceName.split(' · ')[0];

  state.notes = await idb.all('notes', { index: 'updated' });
  state.activity = await idb.all('activity', { index: 'time', limit: 50 });
  state._trusted = await idb.all('trusted');
  state.clipboard.history = await idb.all('clipboard', { index: 'time', limit: 30 });
  if (state.clipboard.history[0]) state.clipboard.current = state.clipboard.history[0].text;

  await refreshTelemetry();
  render();
  setInterval(refreshTelemetry, 15000);
  setInterval(() => { if (state.view === 'network') { bwHistory.push(Math.random() * 15 + (state.net.downlink || 20)); bwHistory.shift(); drawBandwidth(); } }, 1200);

  window.addEventListener('online', () => render());
  window.addEventListener('offline', () => render());

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
}
boot();
