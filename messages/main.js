if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(() => {
        console.log('Service Worker Registered');
    });
}

function updateStatus() {
    document.getElementById('status').textContent =
        (navigator.onLine ? 'You are online!' : 'You are offline!') + ' js-5';
}

navigator.serviceWorker.addEventListener('message', event => {
    console.log('Browser mg:', event.data.msg);
    document.getElementById('swid').textContent = event.data.msg;
    if (event.data.msg === 'refresh-browser') {
        // window.location.reload();
    }
});


document.getElementById('idbtn').addEventListener('click', () => {
    console.log('refresh');
    navigator.serviceWorker.controller.postMessage({msg: 'refresh-cache'});
});