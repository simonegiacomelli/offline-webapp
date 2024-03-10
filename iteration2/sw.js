const version = '31';
const expectedCache = `static-v${version}`
const URLS_TO_CACHE = [
    '/',
    '/index.html',
    '/main.js',
    '/sw-main.js',
];

function log(...data) {
    console.log(`sw-${version}`, ...data);
    sendText(`sw-${version} // ${data}`, ...data);
}

log(self);

self.addEventListener('install', event => {
    log(`install`);
    // debugger;
    // self.skipWaiting();
    event.waitUntil(
        caches.open(expectedCache).then(cache => cache.addAll(URLS_TO_CACHE))
    );
});

function sendVersion() {
    postMessageAll({cmd: 'sw_version', msg: version});
}


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
    sendVersion();
});

function sendText(msg) {
    postMessageAll({msg: msg});
}

function postMessageAll(msg) {
    self.clients.matchAll().then(clients => {
        clients.forEach(client => {
            client.postMessage(msg);
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
    sendVersion();
    caches.open(expectedCache).then(cache => {
        let match = cache.match(event.request).then(response => {
            if (response) {
                log(`fetch-cache-found ${event.request.url}`);
                return response;
            }
            log(`fetch-no-cache ${event.request.url}`);
            return fetch(event.request);
        });
        event.respondWith(match);
    });
});