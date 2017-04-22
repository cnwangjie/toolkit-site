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
            __: i18n.__,
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
            __: i18n.__,
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
        __: i18n.__,
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

// 获取解析funcpath
app.use('*', (req, res, next) => {
    let curpath = req.originalUrl
    req.funcpath = curpath
    req.langpath = undefined
    for (let tl of langlist) {
        if (new RegExp(`${tl.code}`).test(curpath)) {
            req.langpath = tl.code
            req.funcpath = curpath.replace(`/${tl.code}`, '')
            break
        }
    }
    next()
})
// 解析用户语言
app.use('*', (req, res, next) => {
    let cookie = req.cookies.userlang || null
    if (cookie) {
        for (let tl of langlist) {
            if (cookie == tl.code) {
                req.lang = tl.code
            }
        }
        res.clearCookie('lang')
    }

    if (req.langpath) {
        for (let tl of langlist) {
            if (req.langpath == tl.code) {
                console.log(tl.code)
                res.cookie('userlang', tl.code, {maxAge: 604800000})
                req.lang = tl.code
                next()
                return
            }
        }
    }

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

    console.log('!')
    if (res.headersSent) {
        next()
        return
    }
    req.lang = req.lang || req.params.lang
    console.log(req.lang)
    if (!req.lang in langlist) {
        res.redirect(`/cate/${req.params.cate}`)
        next()
        return
    }
    rendercate(req, res, next)
})

app.get('/cate/:cate', (req, res, next) => {
    if (res.headersSent) {
        next()
        return
    }
    rendercate(req, res, next)
})

app.get('/:lang/:toolname', (req, res, next) => {
    if (res.headersSent) {
        next()
        return
    }
    req.lang = req.lang || req.params.lang
    rendertool(req, res, next)
})

app.get('/:lang/home', (req, res, next) => {
    req.lang = req.lang || req.params.lang
    if (!req.lang in langlist) {
        res.redirect(`/`)
        next()
        return
    }
    for (let tl of langlist) {
        if (tl.code == req.lang) {
            renderhome(req, res, next)
            return
        }
    }
    next()
})

app.get('/:toolname', (req, res, next) => {
  console.log('1')
    rendertool(req, res, next)
})

app.get('/', (req, res, next) => {
    renderhome(req, res, next)
})

app.use('*', (req, res) => {
    // if (!res.headersSent) {
    //     if (req.get('User-Agent')) {
    //         res.redirect('/')
    //     } else {
    //         res.status(404).end()
    //     }
    // }
    console.log(`${new Date(req.startTime).toUTCString()} ${req.method} ${req.originalUrl} \u001b[32m${res.statusCode}\u001b[39m ${Date.now() - req.startTime} ms`)
})

console.log('all routes registered!')
