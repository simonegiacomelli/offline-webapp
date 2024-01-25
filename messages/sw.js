
console.log('sw-1');
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

        self.clients.matchAll().then(clients => {
            clients.forEach(client => {
                client.postMessage({
                    msg: 'feedback-1'
                });
            });
        });

    }
});

self.addEventListener('activate', event => {
    let data = "activate-5";
    console.log(data);
    event.waitUntil( self.clients.claim() );
    sendText(data);
});

self.addEventListener('install', event => {
    console.log('install-2');
});




