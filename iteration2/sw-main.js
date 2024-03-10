export const version = '7';

export function handleServiceWorker(commandsCallback) {

    function log(...data) {
        console.log(`sw-main-${version}`, ...data);
        let str = data.reduce((acc, val) => acc + ' ' + val, '');
        commandsCallback({cmd: 'log', msg: `sw-main-${version} ` + str + '\n'});
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
        if (event.data.cmd === 'sw_version') commandsCallback(event.data);
        if (event.data.msg === 'refresh-browser') window.location.reload();
    });

}


