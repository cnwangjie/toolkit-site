const fs = require('fs')
    ,child_process = require('child_process')
    ,path = require('path')
    ,express = require('express')

let router = express.Router();

router.post('/', (req, res, next) => {
    let c = req.body.c || null
    if (c == null) {
        res.status(400).end()
        next()
        return
    } else {
        let code = Buffer.from(Math.random() + '').toString('base64').substr(4,13)
        let tmpfile = path.join(__dirname, `${code}.php`)
        let phpcfpath = path.join(__dirname, `./phpcf/phpcf`)
        fs.writeFileSync(tmpfile, c)
        child_process.exec(`php ${phpcfpath} apply ${tmpfile}`).on('exit', () => {
            res.status(200)
              .set('Content-Type', 'text/plain')
              .send(fs.readFileSync(tmpfile))
            fs.unlinkSync(tmpfile)
            next()
        })
    }
})

module.exports = router
