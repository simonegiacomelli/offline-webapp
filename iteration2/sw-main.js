import {enumerate_cache} from "./sw-shared.js";

export const version = '12';
import * as sw_shared from './sw-shared.js';

export function handleServiceWorker(commandsCallback) {

    function log(...data) {
        console.log(`sw-main-${version}`, ...data);
        let str = data.reduce((acc, val) => acc + ' ' + val, '');
        commandsCallback({cmd: 'log', msg: `sw-main-${version} ` + str + '\n'});
    }

    function postTo(worker, cmd, msg) {
        log('postTo', worker, cmd, msg);
        worker.postMessage({cmd: cmd, msg: msg});
    }

    navigator.serviceWorker.register('sw.js', {type: 'module'}).then(reg => {
        log(`Service Worker Registered reg.scope=${reg.scope}  `);
        if (reg.active) postTo(reg.active, sw_shared.enumerate_cache);

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
            postTo(newWorker, 'skip-waiting');
        });

    });

    navigator.serviceWorker.addEventListener('message', event => {
        log('message:', JSON.stringify(event.data));
        if (event.data.cmd === 'sw_version') commandsCallback(event.data);
        if (event.data.msg === 'refresh-browser') window.location.reload();
    });

}


