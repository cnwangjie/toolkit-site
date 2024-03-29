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
        let cp = child_process.exec(`whois ${domain}`)
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
