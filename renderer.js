const fs = require('fs')

let renderhome = (req, res, next) => {
    let lang = req.lang || 'en_US'
    res.send('home')
    next()
}

let rendercate = (req, res, next) => {
    let cate = req.params.cate
    let lang = req.lang || 'en_US'
    if (!(cate in cates)) {
        res.status(404).render('notfound.ejs', {
            funcpath: req.funcpath,
            type: 'cate',
            sitename: sitename,
            title: 'notfound',
            langs: langlist,
            lang: lang,
            __: __,
        })
        next()
    } else {
        let items = []
        cates[cate].forEach((i) => {
            let toollang = 'en_US'
            if (lang in tools[i].i18n) {
                toollang = lang
            }
            let tooli18n = tools[i].i18n[toollang]
            let item = {
                tool: i,
                toolname: tooli18n.toolname,
                description: tooli18n.description
            }
            items.push(item)
        })
        res.render('cate.ejs', {
            funcpath: req.funcpath,
            type: 'cate',
            sitename: sitename,
            catename: __(`cate.${cate}`, lang),
            items: items,
            cates: cates,
            langs: langlist,
            lang: lang,
            __: __,
        })
        next()
    }
}

let rendertool = (req, res, next) => {
    let tool = req.params.toolname
    let lang = req.lang || 'en_US'
    if (!fs.existsSync(`./tools/${tool}/tool.json`)) {
        res.status(404).render('notfound.ejs', {
            funcpath: req.funcpath,
            type: 'tool',
            sitename: sitename,
            title: 'notfound',
            cates: cates,
            langs: langlist,
            lang: lang,
            __: __,
        })
        next()
        return
    }
    let tooldata = JSON.parse(fs.readFileSync(`./tools/${tool}/tool.json`))
    if (tooldata.display == 'none') {
        next()
        return
    }
    for (let key in tooldata.script) {
        if (tooldata.script[key].charAt(0) == '@') {
            tooldata.script[key] = tooldata.script[key].replace('@', `/${tool}/static/`)
        }
    }

    let thistags = tools[tool].tag
    let similartag = new Set()
    thistags.map((i) => {
        tags[i].map((ii) => {
            similartag.add(ii)
        })
    })
    similartag = Array.from(similartag)
    similartag = similartag.map((i) => {
        let tmptoolname = i
        if (lang in tools[i].i18n) {
            tmptoolname = tools[i].i18n[lang].toolname
        }
        return {
            tool: i,
            toolname: tmptoolname
        }
    })
    let data = {
        funcpath: req.funcpath,
        sitename: sitename,
        tool: tool,
        tpl: `../tools/${tool}/index`,
        csslist: tooldata.css || [],
        scriptlist: tooldata.script || [],
        cates: cates,
        thistag: thistags,
        similartag: similartag,
        langs: langlist,
        lang: lang,
        __: __,
    }
    let toollang = 'en_US'
    if (lang in tools[tool].i18n) {
        toollang = lang
    }
    for (let key in tools[tool].i18n[toollang]) {
        if (tools[tool].i18n[toollang].hasOwnProperty(key)) {
            data[key] = tools[tool].i18n[toollang][key]
        }
    }
    res.render('tool.ejs', data)
    next()
}

let renderer = {
    homerenderer: renderhome,
    caterenderer: rendercate,
    toolrenderer: rendertool,
}

module.exports = renderer;
