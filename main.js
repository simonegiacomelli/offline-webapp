if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(() => {
        console.log('Service Worker Registered');
    });
}

function updateStatus() {
    document.getElementById('status').textContent =
        (navigator.onLine ? 'You are online!' : 'You are offline!') + ' js-1';
}

window.addEventListener('load', updateStatus);
window.addEventListener('online', updateStatus);
window.addEventListener('offline', updateStatus);

navigator.serviceWorker.addEventListener('message', event => {
    console.log('Message from Service Worker:', event.data.msg);
    document.getElementById('swid').textContent = event.data.msg;
});
