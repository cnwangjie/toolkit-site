const express = require('express')
     ,_ = require('lodash')
     ,port = 8088
     ,sitename = 'toolkit-site'
     ,cookieParser = require('cookie-parser')
     ,bodyParser = require('body-parser')
     ,fs = require('fs')
     ,path = require('path')
     ,ejs = require('ejs')
     ,app = express()
     ,i18n = require('./i18n.js')

i18n.init()
console.log(`i18n sources loaded!`)
let __ = i18n.__
let langlist = []
for (let code in i18n.langs) {
    langlist.push({
        code: code,
        name: i18n.langs[code].name,
    })
}

let rendercate = (req, res, next) => {
    let cate = req.params.cate
    let lang = req.lang || 'en_US'
    if (!(cate in cates)) {
        res.status(404).render('notfound.ejs', {
            path: req.rawpath,
            type: 'cate',
            sitename: sitename,
            title: 'notfound',
            cates: cates,
            langs: langlist,
            lang: lang,
            __: i18n.__,
        })
    }
}

let rendertool = (req, res, next) => {
    let tool = req.params.toolname
    let lang = req.lang || 'en_US'
    if (!fs.existsSync(`./tools/${tool}/tool.json`)) {
        res.status(404).render('notfound.ejs', {
            path: req.rawpath,
            type: 'tool',
            sitename: sitename,
            title: 'notfound',
            cates: cates,
            langs: langlist,
            lang: lang,
            __: i18n.__,
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
    let i18ndata = {}
    if (fs.existsSync(`./tools/${tool}/locales/${lang}.json`)) {
        i18ndata = JSON.parse(fs.readFileSync(`./tools/${tool}/locales/${lang}.json`))
    } else {
        i18ndata = JSON.parse(fs.existsSync(`./tools/${tool}/locales/en_US.json`))
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
        path: req.rawpath,
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
        __: i18n.__,
    }
    for (let key in i18ndata) {
        if (i18ndata.hasOwnProperty(key)) {
            data[key] = i18ndata[key]
        }
    }
    res.render('tool.ejs', data)
    next()
}

app.listen(port)
console.log(`listening port: ${port}`)

app.engine('html', ejs.renderFile)
app.set('view engine', 'html')
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())
app.use('/static', express.static('./static'))


app.use('*', (req, res, next) => {
    req.startTime = Date.now()
    next()
})

app.use('*', (req, res, next) => {
    // TODO: 获取解析rawpath
    next()
})

app.get('/:toolname/static/:source', (req, res, next) => {
    let toolname = req.params.toolname
    let source = req.params.source
    res.sendFile(`./tools/${toolname}/static/${source}`, {
        root: './',
        dontfiles: 'deny',
    })
    next()
})

// 注册工具的后端路由 & 读取分类标签信息
let cates = {}
let tags = {}
let tools = {}
let toolsdir = fs.readdirSync('./tools')
toolsdir.map((i) => {
    let tmpdata = JSON.parse(fs.readFileSync(`./tools/${i}/tool.json`))
    tools[i] = tmpdata
    tools[i].i18n = {}
    let localesdir = fs.readdirSync(`./tools/${i}/locales`)
    localesdir.map((ii) => {
        tools[i].i18n[path.basename(ii, '.json')] = JSON.parse(fs.readFileSync(`./tools/${i}/locales/${ii}`))
    })
    console.log(tools[i].i18n)

    for (let key of tmpdata.tag) {
        if (key in tags) {
            tags[key].push(i)
        } else {
            tags[key] = [i]
        }
    }

    for (let key of tmpdata.cate) {
        if (key in cates) {
            cates[key].push(i)
        } else {
            cates[key] = [i]
        }
    }

    if (fs.existsSync(`./tools/${i}/api.js`)) {
        app.use(`/${i}/api`, require(`./tools/${i}/api.js`))
    }
})

app.get('/:lang/cate/:cate', (req, res, next) => {
    req.lang = req.params.lang
    rendercate(req, res, next)
})

app.get('/cate/:cate', (req, res, next) => {
    rendercate(req, res, next)
})

app.get('/:lang/:toolname', (req, res, next) => {
    req.lang = req.params.lang
    rendertool(req, res, next)
})

app.get('/:lang', (req, res, next) => {
    req.lang = req.params.lang
    for (let tl of langlist) {
        if (tl.code == req.lang) {
            renderhome(req, res, next)
            return
        }
    }
    next()
})

app.get('/:toolname', (req, res, next) => {
    rendertool(req, res, next)
})

app.get('/:tpl', (req, res, next) => {
    if (res.statusCode != undefined) {
        next()
    } else {
        let tpl = req.params.tpl
        res.render(`${tpl}.ejs`, {
            toolname: '1',
            sitename: '2',
            cates: [],
            langs: [],
            cate: '',
            description: 'aaaa',
            items: [],
        })
        next()
    }
})

app.use('*', (req, res) => {
    console.log(`${new Date(req.startTime).toUTCString()} ${req.method} ${req.originalUrl} \u001b[32m${res.statusCode}\u001b[39m ${Date.now() - req.startTime} ms`)
})

console.log('all routes registered!')
