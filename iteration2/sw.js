const version = '7';
const expectedCache = 'static-v5';
const URLS_TO_CACHE = [
    '/',
    '/index.html',
    'main.js'
];

function log(...data) {
    console.log(`sw-${version}`, ...data);
    sendText(`sw-${version} // ${data}`, ...data);
}

log(self);

self.addEventListener('install', event => {
    log(`install`);
    // self.skipWaiting();
    event.waitUntil(
        caches.open(expectedCache).then(cache => cache.addAll(URLS_TO_CACHE))
    );
});

self.addEventListener('activate', event => {
    let data = `activate`;
    log(data);

    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.map(key => {
                if (expectedCache !== key)
                    return caches.delete(key);
            })
        )).then(() => {
            console.log('V2 now ready to handle fetches!');
        })
    );

    event.waitUntil(self.clients.claim());
    sendText(data);

});

function sendText(msg) {
    // log('sendText', msg);
    self.clients.matchAll().then(clients => {
        clients.forEach(client => {
            client.postMessage({
                msg: msg
            });
        });
    });
}

self.addEventListener('message', event => {
    log('SW Message:', event.data.msg);
    if (event.data.msg === 'skip-waiting') {
        self.skipWaiting();
        sendText(`refresh-cache-feedback-${version}`)
    }
});

self.addEventListener('fetch', event => {


    // if (url.origin == location.origin && url.pathname == '/dog.svg') {
    //   event.respondWith(caches.match('/horse.svg'));
    // }

    //return cache if matches the URLS_TO_CACHE
    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) {
                log(`fetch-cache-found ${event.request.url}`);
                return response;
            }
            log(`fetch-no-cache ${event.request.url}`);
            return fetch(event.request);
        })
    );
});