const fs = require('fs')
const path = require('path')

/**
 * @static i18n
 */
let i18n = {}

/**
 * @description storage language data
 * @type {map}
 * @private
 */
i18n.langs = {}

/**
 * @description load locales file and register watcher
 * @return i18n
 * @public
 */
i18n.init = (opts) => {
    opts = opts || {}
    i18n.localesDir = opts.localesDir || './locales'

    let files = fs.readdirSync(i18n.localesDir)
    i18n.defaultLang = opts.defaultLang || path.basename(files[0], '.json')
    files.map((file) => {
        i18n.update(file)
        i18n.watch(file)
    })
    global.langlist = []
    for (let code in i18n.langs) {
        langlist.push({
            code: code,
            name: i18n.langs[code].name,
        })
    }
    return i18n
}

/**
 * @description add file watcher
 * @return i18n
 * @private
 */
i18n.watch = (filename) => {
    let filepath = path.join(i18n.localesDir, filename)
    fs.watch(filepath, (e, file) => {
        if (e == 'change') {
            i18n.update(file)
        }
    })
    return i18n
}

/**
 * @description update langs map
 * @return i18n
 * @private
 */
i18n.update = (file) => {
    try {
        let l = path.basename(file, '.json')
        let filepath = path.join(i18n.localesDir, file)
        i18n.langs[l] = JSON.parse(fs.readFileSync(filepath))
    } catch (e) {
        console.log(`load ${file} error`)
    }
    return i18n
}

/**
 * @description return i18n text
 *          if the language is not exist return the default language
 *          if all language don't have this key then return the original key
 * @param  {string} key   use '.' to concat two level
 * @param  {string} lang  language
 * @return {string}
 * @public
 */
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
