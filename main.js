if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(() => {
        console.log('Service Worker Registered');
    });
}

function updateStatus() {
    document.getElementById('status').textContent = navigator.onLine ? 'You are online!' : 'You are offline!';
}

window.addEventListener('load', updateStatus);
window.addEventListener('online', updateStatus);
window.addEventListener('offline', updateStatus);
