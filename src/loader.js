const fs = require('fs')
     ,path = require('path')
     ,child_process = require('child_process')
     ,express = require('express')
     ,toolpath = path.join(__dirname, './../tools')

// 注册工具的后端路由 & 读取分类标签信息
let toolsloader = () => {
    global.cates = {}
    global.tags = {}
    global.tools = {}
    let toolsdir = fs.readdirSync(toolpath)
    toolsdir.map((i) => {
        try {
            var tmpdata = JSON.parse(fs.readFileSync(path.join(toolpath, `/${i}/tool.json`)))
        } catch (e) {
            console.log(`load tool ${i} error`)
            return
        }

        // 排除的工具
        if (tmpdata.display == 'none') {
            return
        }

        if ('requirement' in tmpdata) {
            tmpdata.requirement.map((requiredItem) => {
                if (typeof requiredItem == 'string') {
                    let cp = child_process.exec(`command -v ${requiredItem}`)
                    let thisOk = false
                    cp.stdout.on('data', (data) => {
                        if (data) {
                            thisOk = true
                        }
                    })
                    cp.on('exit', () => {
                        if (thisOk) {
                            return
                        }
                        console.log(`\u001b[31m\u2717 [WARNING]\u001b[0m \u001b[1;37m${i}\u001b[0m require \u001b[36m${requiredItem}\u001b[0m`)
                    })
                }
            })
        }

        tools[i] = tmpdata

        // 加载工具的语言文件
        tools[i].i18n = {}
        let localesdir = fs.readdirSync(path.join(toolpath, `./${i}/locales`))
        localesdir.map((ii) => {
            tools[i].i18n[path.basename(ii, '.json')] = JSON.parse(fs.readFileSync(path.join(toolpath, `./${i}/locales/${ii}`)))
        })

        // 创建关于标签和分类的索引
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

        app.use(`/${i}/static/`, express.static(path.join(toolpath, `./${i}/static`)))

        if (fs.existsSync(path.join(toolpath, `./${i}/api.js`))) {
            app.use(`/${i}/api`, require(path.join(toolpath, `./${i}/api.js`)))
            console.log(`\u001b[32m\u2714\u001b[39m load api of \u001b[1;37m${i}\u001b[0m`)
        }
    })
}

module.exports = toolsloader
