/**
 * CareTech Progressive Web App - Service Worker
 * Version: 1.1.0 (Full Offline Local AI & Cardboard Cosmos Edition)
 *
 * Dioptimalkan untuk penggunaan 100% Offline:
 * - Mendukung AI Lokal Ollama (NVIDIA RTX 4050 / localhost:11434) & Web Speech TTS
 * - Seluruh halaman utama dan modul dicache di awal (precached)
 * - Tanpa layar error "offline" — aplikasi tetap berjalan penuh dari cache saat tanpa internet
 * - Bypass otomatis untuk request ke Ollama, ESP32, dan video streaming
 */

const CACHE_NAME = 'caretech-v1.1.0';

// Seluruh halaman & aset utama CareTech yang dicache agar bisa jalan offline penuh
const PRECACHE_ASSETS = [
    './',
    './index.html',
    './login.html',
    './dashboard.html',
    './chat.html',
    './play.html',
    './game.html',
    './jurnal.html',
    './modul.html',
    './komik.html',
    './studi-kasus.html',
    './bonus-game.html',
    './penilaian.html',
    './pretest.html',
    './posttest.html',
    './manifest.webmanifest',
    './dashboard.css',
    './landing.css',
    './dropdown.js',
    './js/pwa-register.js',
    './assets/icons/icon-192x192.png',
    './assets/icons/icon-512x512.png',
    './assets/icons/favicon-32x32.png',
    './assets/logo-care-tech.png',
    './assets/fonts/GROBOLD.ttf'
];

// Target yang WAJIB bypass cache Service Worker (langsung ke jaringan/proses lokal)
const BYPASS_PATTERNS = [
    /:11434/,                  // Server Ollama Lokal (AI offline)
    /\.(mp4|webm|ogg|wav)$/i,  // Video & audio stream (Range requests)
    /\/api\/generate|\/api\/chat|\/api\/tags/, // Endpoint Ollama
    /chrome-extension:\/\//    // Ekstensi browser
];

// Data dinamis yang dicek ke server saat online, tapi tetap jalan lancar via cache saat offline
const DYNAMIC_DATA_PATTERNS = [
    /scenarios-data\.js/i,
    /cases-data\.js/i,
    /GameState\.js/i,
    /dialogues\.js/i
];

// -------------------------------------------------------------
// 1. INSTALL EVENT
// -------------------------------------------------------------
self.addEventListener('install', (event) => {
    self.skipWaiting();

    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            // Precaching tangguh: jika ada salah satu asset non-kritis gagal, yang lain tetap tersimpan
            return Promise.allSettled(
                PRECACHE_ASSETS.map((asset) => {
                    return cache.add(asset).catch((err) => {
                        console.warn(`[CareTech PWA] Precache note for ${asset}:`, err);
                    });
                })
            );
        })
    );
});

// -------------------------------------------------------------
// 2. ACTIVATE EVENT (Bersihkan cache lama)
// -------------------------------------------------------------
self.addEventListener('activate', (event) => {
    event.waitUntil(
        Promise.all([
            self.clients.claim(),
            caches.keys().then((keys) => {
                return Promise.all(
                    keys.map((key) => {
                        if (key !== CACHE_NAME) {
                            console.log(`[CareTech PWA] Menghapus cache usang: ${key}`);
                            return caches.delete(key);
                        }
                    })
                );
            })
        ])
    );
});

// -------------------------------------------------------------
// 3. FETCH EVENT
// -------------------------------------------------------------
self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);

    // Hanya tangani GET HTTP/HTTPS
    if (request.method !== 'GET') return;
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

    // RULE 1: Bypass AI Ollama lokal (:11434), Video, dan request khusus
    if (request.headers.get('range') || BYPASS_PATTERNS.some((p) => p.test(url.href))) {
        return;
    }

    // RULE 2: Navigasi Halaman HTML
    // Prioritas: Ambil dari server jika online (agar update masuk) -> jika offline, sajikan langsung dari cache
    const isNavigation = request.mode === 'navigate' || 
                         request.destination === 'document' || 
                         url.pathname.endsWith('.html');

    if (isNavigation) {
        event.respondWith(
            fetch(request)
                .then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        const copy = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
                    }
                    return networkResponse;
                })
                .catch(async () => {
                    // Ketika OFFLINE: Langsung sajikan halaman yang diminta dari cache!
                    const cachedResponse = await caches.match(request);
                    if (cachedResponse) return cachedResponse;

                    // Fallback jika URL dengan parameter belum tersimpan: buka dashboard atau index
                    return caches.match('./dashboard.html') || caches.match('./index.html');
                })
        );
        return;
    }

    // RULE 3: Skenario & Data Game (Network-First dengan Fallback Cache)
    const isDynamicData = DYNAMIC_DATA_PATTERNS.some((p) => p.test(url.pathname));
    if (isDynamicData) {
        event.respondWith(
            fetch(request)
                .then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        const copy = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
                    }
                    return networkResponse;
                })
                .catch(() => caches.match(request))
        );
        return;
    }

    // RULE 4: Aset Statis (CSS, JS, Gambar, Font) - Stale-While-Revalidate
    // Buka instan dari cache lokal, update otomatis di latar belakang jika terhubung internet
    event.respondWith(
        caches.match(request).then((cachedResponse) => {
            const fetchPromise = fetch(request)
                .then((networkResponse) => {
                    if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
                        const copy = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
                    }
                    return networkResponse;
                })
                .catch(() => {
                    // Abaikan kegagalan jaringan saat offline
                });

            return cachedResponse || fetchPromise;
        })
    );
});
