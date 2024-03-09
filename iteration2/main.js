const version = '5';

document.getElementById('ver_main').innerHTML = version;

function log(...data) {
    console.log(`main-${version}`, ...data);
    // convert ...data to a string
    let str = data.reduce((acc, val) => acc + ' ' + val, '');
    document.getElementById('taLog').value += `main-${version} ` + str + '\n';

}

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
        log('updatefound', newWorker);
        newWorker.addEventListener('statechange', () => {
            log('statechange', newWorker.state);
            if (newWorker.state === 'activated') // refresh the page
                window.location.reload();
        });
        if (cbSkipWaiting.checked)
            postSkipWaiting(newWorker);
    });

});


function updateStatus() {
    document.getElementById('status').textContent =
        (navigator.onLine ? 'You are online!' : 'You are offline!') + ' js-5';
}

navigator.serviceWorker.addEventListener('message', event => {
    log('message:', JSON.stringify(event.data));
    if (event.data.cmd === 'version')
        document.getElementById('ver_sw').innerHTML = event.data.msg;


    if (event.data.msg === 'refresh-browser') {
        // window.location.reload();
    }
});


document.getElementById('idbtn').addEventListener('click', () => {
    log('refresh');
    navigator.serviceWorker.controller.postMessage({msg: 'refresh-cache'});
});