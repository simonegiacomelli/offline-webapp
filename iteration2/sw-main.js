export const version = '4';

export function handleServiceWorker(callerLog) {

    function log(...data) {
        console.log(`sw-main-${version}`, ...data);
        let str = data.reduce((acc, val) => acc + ' ' + val, '');
        callerLog(`sw-main-${version} ` + str + '\n');
    }

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
                {
                    log('statechange activated. Reloading page.');
                    window.location.reload();
                }
            });
            postSkipWaiting(newWorker);
        });

    });

    navigator.serviceWorker.addEventListener('message', event => {
        log('message:', JSON.stringify(event.data));
        if (event.data.cmd === 'version') document.getElementById('ver_sw').innerHTML = event.data.msg;
        if (event.data.msg === 'refresh-browser') window.location.reload();
    });

}


