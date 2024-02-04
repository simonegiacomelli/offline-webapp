const version = '10';
console.log(`sw-${version}`);

self.addEventListener('install', event => {
    console.log(`install-${version}`);
    // self.skipWaiting();
});

self.addEventListener('activate', event => {
    let data = `activate-${version}`;
    console.log(data);
    event.waitUntil( self.clients.claim() );
    sendText(data);
});

function sendText(msg) {
    console.log('sendText', msg);
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
        sendText(`refresh-cache-feedback-${version}`)
    }
});
