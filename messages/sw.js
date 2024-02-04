const version = '18';

function log(...data) {
    console.log(`sw-${version}`, ...data);
}

log(self);

self.addEventListener('install', event => {
    log(`install`);
    // self.skipWaiting();
});

self.addEventListener('activate', event => {
    let data = `activate`;
    log(data);
    event.waitUntil(self.clients.claim());
    sendText(data);
});

function sendText(msg) {
    log('sendText', msg);
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
