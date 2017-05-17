const fs = require('fs')
    ,child_process = require('child_process')
    ,path = require('path')
    ,express = require('express')

let router = express.Router();

router.post('/', (req, res, next) => {
    let domain = req.body.domain || null
    if (domain == null) {
        res.status(400).end()
        next()
        return
    } else {
        let cmd = `curl "http://data.alexa.com/data/TCaX/0+qO000fV?cli=10&dat=snba&ver=7.0&cdt=alx_vw=20&wid=31472&act=00000000000&ss=1024×768&bw=639&t=0&ttl=4907&vis=1&rq=23&url=${domain}"`
        let cp = child_process.exec(cmd)
        let result = ''
        cp.stdout.on('data', (data) => {
            result += data
        })
        cp.on('exit', () => {
            res.status(200)
              .set('Content-Type', 'text/plain')
              .send(result)
            next()
        })
    }
})

module.exports = router
