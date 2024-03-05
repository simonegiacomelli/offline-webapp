const version = '4';

function log(...data) {
    console.log(`main-${version}`, ...data);
}

log('startup');


let cbSkipWaiting = document.getElementById('cbSkipWaiting');
cbSkipWaiting.checked = localStorage.getItem('skipWaiting') === 'true';
cbSkipWaiting.addEventListener('click', () => {
    localStorage.setItem('skipWaiting', cbSkipWaiting.checked);
    log('cbSkipWaiting', cbSkipWaiting.checked);
});

document.getElementById('btnSkipWaiting').addEventListener('click', () => {

    navigator.serviceWorker.getRegistration().then(reg => {
        log('btnSkipWaiting loop', reg);
        if (reg && reg.waiting) {
            postSkipWaiting(reg.waiting);
        }
    });

});

function postSkipWaiting(worker) {
    log('postSkipWaiting', worker);
    worker.postMessage({msg: 'skip-waiting'});
}

navigator.serviceWorker.register('sw.js').then(reg => {
    log(`Service Worker Registered reg.scope=${reg.scope}  `);

    reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        log('newWorker', newWorker);
        if (cbSkipWaiting.checked)
            postSkipWaiting(newWorker);
    });

});


function updateStatus() {
    document.getElementById('status').textContent =
        (navigator.onLine ? 'You are online!' : 'You are offline!') + ' js-5';
}

navigator.serviceWorker.addEventListener('message', event => {
    log('message:', event.data.msg);
    document.getElementById('swid').textContent = event.data.msg;
    if (event.data.msg === 'refresh-browser') {
        // window.location.reload();
    }
});


document.getElementById('idbtn').addEventListener('click', () => {
    log('refresh');
    navigator.serviceWorker.controller.postMessage({msg: 'refresh-cache'});
});