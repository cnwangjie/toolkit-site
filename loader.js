const fs = require('fs')
     ,path = require('path')

// 注册工具的后端路由 & 读取分类标签信息
let toolsloader = () => {
    global.cates = {}
    global.tags = {}
    global.tools = {}
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
}

module.exports = toolsloader
