const version = '11';

function log(...data) {
    console.log(`main-${version}`, ...data);
    // convert ...data to a string
    let str = data.reduce((acc, val) => acc + ' ' + val, '');
    document.getElementById('taLog').value += `main-${version} ` + str + '\n';

}

import * as sw_main from './sw-main.js';

sw_main.handleServiceWorker(obj => {
    if (obj.cmd === 'log')
        document.getElementById('taLog').value += obj.msg;
    else if (obj.cmd === 'sw_version')
        document.getElementById('ver_sw').innerHTML = obj.msg
});
document.getElementById('ver_main').innerHTML = sw_main.version;

log('handleServiceWorker() done.');