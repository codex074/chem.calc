const CACHE_NAME = 'chemo-calc-v2';
const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    'https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;700&display=swap'
];

// ติดตั้ง Service Worker และ Cache ไฟล์
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// ดึงข้อมูลจาก Cache เมื่อไม่มีเน็ต
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // ถ้ามีใน Cache ให้ใช้เลย
                if (response) {
                    return response;
                }
                // ถ้าไม่มี ให้โหลดจากเน็ต
                return fetch(event.request);
            })
    );
});

// ลบ Cache เก่าเมื่อมีการอัปเดตเวอร์ชัน
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});