const express = require('express')
     ,_ = require('lodash')
     ,port = 8088
     ,cookieParser = require('cookie-parser')
     ,bodyParser = require('body-parser')
     ,fs = require('fs')
     ,path = require('path')
     ,ejs = require('ejs')
     ,i18n = require('./i18n.js')
     ,renderer = require('./renderer.js')
     ,loader = require('./loader.js')

global.app = express()
global.sitename = 'toolkit-site'

i18n.init()
console.log(`i18n sources loaded!`)
global.__ = i18n.__
loader()
let renderhome = renderer.homerenderer
let rendercate = renderer.caterenderer
let rendertool = renderer.toolrenderer

app.listen(port)
console.log(`listening port: ${port}`)

app.engine('html', ejs.renderFile)
app.set('view engine', 'html')
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())
app.use('/static', express.static('./static'))
app.use(function addStartTime(req, res, next) {
    req.startTime = Date.now()
    next()
})

// 获取解析funcpath
app.use('*', function pathParser(req, res, next) {
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
app.use('*', function langParser(req, res, next) {
    let cookie = req.cookies.userlang || null
    if (cookie) {
        let verifiedLang = false
        for (let tl of langlist) {
            if (cookie == tl.code) {
                req.lang = tl.code
                verifiedLang = true
            }
        }

        if (verifiedLang == false) {
            res.clearCookie('userlang')
        }
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


app.get('/:lang/cate/:cate', (req, res, next) => {

    if (res.headersSent) {
        next()
        return
    }
    req.lang = req.lang || req.params.lang
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
    if (req.langpath == req.lang) {
        next()
        return
    } else {
        rendertool(req, res, next)
    }
})

app.get('/:lang', (req, res, next) => {
    renderhome(req, res, next)
})

app.get('/', (req, res, next) => {
    renderhome(req, res, next)
})

app.use('*', function logger(req, res) {
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
