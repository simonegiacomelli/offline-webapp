const version = '50';
const expectedCache = `static-v${version}`
const URLS_TO_CACHE = [
    '/',
    '/index.html',
    '/main.js',
    '/sw-main.js',
    '/sw-shared.js',
];

import * as sw_shared from './sw-shared.js';

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
    if (event.data.cmd === 'skip-waiting') {
        self.skipWaiting();
    }
    if (event.data.cmd === sw_shared.enumerate_cache) {
        // get all caches, not only expectedCache and for each one log all requests url
        async function enumerateCache() {
            for (let key of await caches.keys()) {
                let cache = await caches.open(key);
                let requests = await cache.keys();
                console.log(`cache ${key} enumerating ${requests.length} requests:`);
                for (let request of requests) {
                    // get the number of bytes in the response body
                    let response = await cache.match(request);
                    let len = (await response.blob()).size;
                    console.log(`  ${request.url} ${len} bytes`);
                }
            }
        }

        enumerateCache();
    }
});

self.addEventListener('fetch', event => {
    sendVersion();
    // caches.open(expectedCache).then(cache => {
    //     let match = cache.match(event.request).then(response => {
    //         if (response) {
    //             log(`fetch-cache-found ${event.request.url}`);
    //             return response;
    //         }
    //         log(`fetch-no-cache ${event.request.url}`);
    //         return fetch(event.request);
    //     });
    //     event.respondWith(match);
    // });

    event.respondWith(caches.match(event.request));
});