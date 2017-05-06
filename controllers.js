const renderer = require('./renderer.js')
     ,fs = require('fs')
     ,path = require('path')
let controllers = {}

controllers.staticFileOfTool = function staticFileOfTool(req, res, next) {
    if (res.headersSent) {
        next()
        return
    }
    let toolname = req.params.toolname
    let source = req.params.source
    res.sendFile(`./tools/${toolname}/static/${source}`, {
        root: './',
        dontfiles: 'deny',
    }, (err) => {
        next()
        return
    })
}

controllers.catePage = function catePage(req, res, next) {
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
    renderer('cate')(req, res, next)
}

controllers.searchPage = function searchPage(req, res, next) {
    if (res.headersSent) {
        next()
        return
    }
    let q = req.query.q || null
    if (!q) {
        res.redirect('/')
        next()
        return
    }

    req.lang = req.lang || req.params.lang
    if (!req.lang in langlist) {
        res.redirect(`/cate/${req.params.cate}`)
        next()
        return
    }
    renderer('search')(req, res, next)
}

controllers.toolPage = function toolPage(req, res, next) {
    if (res.headersSent) {
        next()
        return
    }

    if ('lang' in req.params && req.params.lang != req.lang) {
        next()
        return
    }

    req.lang = req.lang || req.params.lang
    renderer('tool')(req, res, next)
}

controllers.homePage = function homePage(req, res, next) {
    if (res.headersSent) {
        next()
        return
    }
    //
    // req.lang = req.lang || req.params.lang
    // if (!req.lang in langlist) {
    //     res.redirect(`/`)
    //     next()
    //     return
    // }
    let flag = false
    if ('lang' in req.params) {
        for (let tl of langlist) {
            if (tl.code == req.params.lang) {
                flag = true
                break
            }
        }
    } else {
        flag = true
    }

    if (flag) {
        renderer('home')(req, res, next)
        return
    }

    next()
}

module.exports = controllers
