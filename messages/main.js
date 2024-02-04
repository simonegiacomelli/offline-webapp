console.log('main.js v-3');
navigator.serviceWorker.register('sw.js').then(reg => {
    console.log(`Service Worker Registered reg.scope=${reg.scope}  `);

    reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        console.log('newWorker', newWorker);

        newWorker.addEventListener('statechange', () => {
            // newWorker.state has changed
            console.log('newWorker.state', newWorker.state);
            if(newWorker.state === 'installed'){
                newWorker.postMessage({msg: 'skip-waiting'});
            }
        });
    });


});

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