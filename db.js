// Pixel Link — local-first storage (IndexedDB)
// Stores: notes, activity, trusted devices, settings, clipboard history

const DB_NAME = 'pixel-link';
const DB_VERSION = 1;
const STORES = ['notes', 'activity', 'trusted', 'clipboard', 'kv'];

let _dbPromise = null;

function openDB() {
  if (_dbPromise) return _dbPromise;
  _dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('notes')) {
        const s = db.createObjectStore('notes', { keyPath: 'id' });
        s.createIndex('updated', 'updated');
      }
      if (!db.objectStoreNames.contains('activity')) {
        const s = db.createObjectStore('activity', { keyPath: 'id' });
        s.createIndex('time', 'time');
      }
      if (!db.objectStoreNames.contains('trusted')) {
        db.createObjectStore('trusted', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('clipboard')) {
        const s = db.createObjectStore('clipboard', { keyPath: 'id' });
        s.createIndex('time', 'time');
      }
      if (!db.objectStoreNames.contains('kv')) {
        db.createObjectStore('kv', { keyPath: 'key' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return _dbPromise;
}

async function tx(store, mode, fn) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const t = db.transaction(store, mode);
    const s = t.objectStore(store);
    const result = fn(s);
    t.oncomplete = () => resolve(result);
    t.onerror = () => reject(t.error);
  });
}

export const idb = {
  async put(store, value) {
    return tx(store, 'readwrite', s => s.put(value));
  },
  async get(store, key) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const r = db.transaction(store, 'readonly').objectStore(store).get(key);
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
    });
  },
  async delete(store, key) {
    return tx(store, 'readwrite', s => s.delete(key));
  },
  async all(store, { index, direction = 'prev', limit } = {}) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const out = [];
      const os = db.transaction(store, 'readonly').objectStore(store);
      const src = index ? os.index(index) : os;
      const req = src.openCursor(null, direction);
      req.onsuccess = () => {
        const cur = req.result;
        if (cur && (!limit || out.length < limit)) {
          out.push(cur.value);
          cur.continue();
        } else {
          resolve(out);
        }
      };
      req.onerror = () => reject(req.error);
    });
  },
  async clear(store) {
    return tx(store, 'readwrite', s => s.clear());
  }
};

export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
