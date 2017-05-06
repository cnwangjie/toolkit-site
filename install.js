const fs = require('fs')
     ,configfile = './config.json'
     ,defaultconfig = {
        debug: false,
        gaid: '0',
        domain: 'localhost',
     }


if (fs.existsSync(configfile)) {
    fs.writeFileSync(configfile, JSON.stringify(defaultconfig, null, 4))
}

console.log('done!')
