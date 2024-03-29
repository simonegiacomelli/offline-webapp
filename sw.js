const CACHE_NAME = 'v1';
const URLS_TO_CACHE = [
    '/',
    'main.js'
];

function sendText(msg) {
    console.log(msg);
    self.clients.matchAll().then(clients => {
        clients.forEach(client => {
            client.postMessage({
                msg: msg
            });
        });
    });
}

self.addEventListener('message', event => {
    console.log('SW Message:', event.data.msg);
    if (event.data.msg === 'refresh-cache') {
        self.skipWaiting();
        // clear cache and reload
        caches.keys().then(cacheNames => {
            cacheNames.forEach(cacheName => {
                caches.delete(cacheName);
            });
        });

        self.clients.matchAll().then(clients => {
            clients.forEach(client => {
                client.postMessage({
                    msg: 'refresh-browser'
                });
            });
        });

    }
});

self.addEventListener('activate', event => {
    sendText("activate-2");
});

self.addEventListener('install', event => {
    // sendText("install-1");

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(URLS_TO_CACHE);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                console.log('fetch-1 ' + event.request.url);
                // Cache hit - return response
                if (response) {
                    return response;
                }
                return fetch(event.request).then(
                    response => {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // IMPORTANT: Clone the response. A response is a stream
                        // and because we want the browser to consume the response
                        // as well as the cache consuming the response, we need
                        // to clone it so we have two streams.
                        var responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            })
    );
});


