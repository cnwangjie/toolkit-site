const fs = require('fs')
     ,path = require('path')

let helper = {}
helper.genSitemap = function genSitemap() {
    let r = []
    let prefix = [`https://${config.domain}/`]
    for (let key in langlist) {
        prefix.push(prefix[0] + langlist[key].code + '/')
    }

    prefix.map(i => {
        r.push(i)
    })

    for (let key in tools) {
        prefix.map(i => {
            r.push(`${i}${key}`)
        })
    }

    for (let key in cates) {
        prefix.map(i => {
            r.push(`${i}cate/${key}`)
        })
    }

    fs.writeFileSync(path.join(__dirname, './../public/sitemap.txt'), r.join('\n'))
}

helper.genRobots = function genRobots() {
    let r = `
User-agent: *
Disallow:
Crawl-delay: 5
Sitemap: https://${config.domain}/sitemap.txt
`
    fs.writeFileSync(path.join(__dirname, './../public/robots.txt'), r.trim())
}

module.exports = helper
