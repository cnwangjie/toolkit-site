// TODO tool verify tool
// TODO server proccess manager
const express = require('express')
     ,_ = require('lodash')
     ,port = 8088
     ,cookieParser = require('cookie-parser')
     ,bodyParser = require('body-parser')
     ,fs = require('fs')
     ,path = require('path')
     ,ejs = require('ejs')
     ,i18n = require('./i18n.js')
     ,loader = require('./loader.js')
     ,controllers = require('./controllers.js')
     ,helper = require('./helper.js')

global.config = JSON.parse(fs.readFileSync('./config.json'))

global.DEBUG = config.debug

global.app = express()
global.sitename = 'toolkit-site'

let log = DEBUG ? console.log : ()=>{}

// init i18n
i18n.init()
console.log(`\u001b[32m\u2714\u001b[39m i18n sources loaded!`)
global.__ = i18n.__

app.listen(port)
console.log(`\u001b[32m\u2714\u001b[39m listening port: ${port}`)

app.engine('html', ejs.renderFile)
app.set('view engine', 'html')

// use basically middleware to handle http context
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())
app.use('/static', express.static('./static'))
app.use('/', express.static('./public'))
app.use(function addStartTime(req, res, next) {
    req.startTime = Date.now()
    next()
})

// init toolsdata (when load tool api will use body so run loader after register middleware)
loader()

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
                res.cookie('userlang', tl.code, {maxAge: 604800000})
                req.lang = tl.code
                next()
                return
            }
        }
    }

    next()
})

// 路由表
app.get('/:toolname/static/:source', controllers.staticFileOfTool)
app.get('/:lang/cate/:cate', controllers.catePage)
app.get('/:lang/search', controllers.searchPage)
app.get('/cate/:cate', controllers.catePage)
app.get('/:lang/home', controllers.homePage)
app.get('/:lang/:toolname', controllers.toolPage)
app.get('/search', controllers.searchPage)
app.get('/:lang', controllers.homePage)
app.get('/:toolname', controllers.toolPage)
app.get('/', controllers.homePage)

// 控制台信息
app.use('*', function logger(req, res) {
    if (!res.headersSent) {
        if (req.get('User-Agent')) {
            res.redirect('/')
        } else {
            res.status(404).end()
        }
    }
    console.log(`${new Date(req.startTime).toUTCString()} \u001b[32m${req.method}\u001b[39m ${req.originalUrl} \u001b[32m${res.statusCode}\u001b[39m ${Date.now() - req.startTime} ms`)
})

console.log('\u001b[32m\u2714\u001b[39m all routes registered!')
helper.genSitemap()
helper.genRobots()
