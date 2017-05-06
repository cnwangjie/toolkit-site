const fs = require('fs')

let initdata = ({funcpath, type, lang, title}) => {
    return {
        gaid: DEBUG ? undefined : config.gaid,
        funcpath,
        type,
        sitename,
        tools,
        cates,
        langs: langlist,
        lang,
        title,
        __,
    }
}

let renderhome = (req, res, next) => {
    let lang = req.lang || 'en_US'
    let newitems = Object.keys(tools).sort((a, b) => {
        return tools[a].date > tools[b].date
    }).reverse().slice(0,24).map((i) => {
        let i18n = lang in tools[i].i18n ? tools[i].i18n[lang] : tools[i].i18n['en_US']
        return {
            tool: i,
            toolname: i18n.toolname,
            description: i18n.description
        }
    })
    let data = initdata({
        funcpath: '/',
        type: 'home',
        title: __('homepagetitle', lang),
        lang,
    })
    data.newitems = newitems
    res.render('home.ejs', data)
    next()
}

let rendercate = (req, res, next) => {
    let cate = req.params.cate
    let lang = req.lang || 'en_US'
    if (!(cate in cates)) {
        let data = initdata({
            funcpath: req.funcpath,
            type: 'cate',
            title: __('notfoundpagetitle', lang),
            lang,
        })
        res.status(404).render('notfound.ejs', data)
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
        let data = initdata({
            funcpath: req.funcpath,
            type: 'cate',
            title: __(`cate.${cate}`, lang),
            lang,
        })
        data.catename = __(`cate.${cate}`, lang)
        data.items = items
        res.render('cate.ejs', data)
        next()
    }
}

let rendertool = (req, res, next) => {
    let tool = req.params.toolname
    let lang = req.lang || 'en_US'
    if (!fs.existsSync(`./tools/${tool}/tool.json`)) {
        let data = initdata({
            funcpath: req.funcpath,
            title: __('notfoundpagetitle', lang),
            type: 'tool',
            lang,
        })
        res.status(404).render('notfound.ejs', data)
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

    for (let key in tooldata.css) {
        if (tooldata.css[key].charAt(0) == '@') {
            tooldata.css[key] = tooldata.css[key].replace('@', `/${tool}/static/`)
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
    let data = initdata({
        funcpath: req.funcpath,
        title: undefined,
        type: 'tool',
        lang,
    })
    data.tool = tool
    data.tpl = `../tools/${tool}/index`
    data.csslist = tooldata.css || []
    data.scriptlist = tooldata.script || []
    data.thistag = thistags
    data.similartag = similartag
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

let rendersearch = (req, res, next) => {
    let lang = req.lang || 'en_US'
    let q = req.query.q
    let re = new RegExp(q, 'i')
    let result = []
    for (let key in tools) {
        let i = tools[key]
        let text = lang in i.i18n ? i.i18n[lang] : i.i18n['en_US']
        let inname = re.test(text.toolname)
        let indes = false
        if (typeof text.description == 'string') {
            indes = re.test(text.description)
        } else {
            text.description.map(j => {
                if (re.test(j)) {
                    indes = true
                }
            })
        }
        if (inname || indes) {
            result.push(key)
        }
    }

    let data = initdata({
        funcpath: req.funcpath,
        title: undefined,
        type: 'search',
        lang,
    })
    data.q = q
    data.result = result

    res.render('search.ejs', data)
    next()
}

let renderer = (name) => {
    return renderer[name]
}

renderer.home = renderer.homerenderer = renderhome
renderer.cate = renderer.caterenderer = rendercate
renderer.tool = renderer.toolrenderer = rendertool
renderer.search = renderer.searchrenderer = rendersearch

module.exports = renderer
