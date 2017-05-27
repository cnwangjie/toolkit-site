const fs = require('fs')
     ,configfile = './../config.json'
     ,defaultconfig = {
        debug: false,
        gaid: '0',
        domain: 'localhost',
        sitename: 'toolkit-space',
     }


if (fs.existsSync(configfile)) {
    console.log('installed!')
} else {
    fs.writeFileSync(configfile, JSON.stringify(defaultconfig, null, 4))
    console.log('install success!')
}
