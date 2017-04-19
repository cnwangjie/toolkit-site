const fs = require('fs')
const path = require('path')
let i18n = {}
i18n.langs = {}
i18n.init = (opts) => {
    opts = opts || {}
    i18n.localesDir = opts.localesDir || './locales'

    let files = fs.readdirSync(i18n.localesDir)
    i18n.defaultLang = opts.defaultLang || path.basename(files[0], '.json')
    files.map((file) => {
        i18n.update(file)
        i18n.watch(file)
    })
    return i18n
}

i18n.watch = (filename) => {
    let filepath = path.join(i18n.localesDir, filename)
    fs.watch(filepath, (e, file) => {
        if (e == 'change') {
            i18n.update(file)
        }
    })
    return i18n
}

i18n.update = (file) => {
    try {
        let l = path.basename(file, '.json')
        let filepath = path.join(i18n.localesDir, file)
        i18n.langs[l] = JSON.parse(fs.readFileSync(filepath))
    } catch (e) {
        throw e
    }
    return i18n
}

i18n.__ = (key, lang) => {
    if (typeof lang == 'undefined' || !(lang in i18n.langs)) {
        lang = i18n.defaultLang
    }

    if (key in i18n.langs[lang].data) {
        return i18n.langs[lang].data[key]
    }

    if (key.indexOf('.')) {
        let keys = key.split('.')
        let cur = i18n.langs[lang].data
        while(keys.length) {
            let tmpkey = keys.shift()
            if (tmpkey in cur) {
                cur = cur[tmpkey]
            } else {
                return key
            }
        }

        if (typeof cur == 'string') {
            return cur
        } else {
            return key
        }
    }

    return key
}

module.exports = i18n;
