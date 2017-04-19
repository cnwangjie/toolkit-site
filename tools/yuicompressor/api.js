const fs = require('fs')
    ,child_process = require('child_process')
    ,path = require('path')
    ,express = require('express')

let router = express.Router();

router.post('/', (req, res, next) => {
    let v = req.body.v || null
    let cl = req.body.cl || null
    let nomunge = req.body.nomunge || null
    let presemi = req.body.presemi || null
    let disopt = req.body.disopt || null
    if (v == null || cl == null) {
        res.status(400).end()
        next()
        return
    } else {
        let code = new Buffer(Math.random() + '').toString('base64').substr(4,13)
        let tmpfile = path.join(__dirname, `${code}.${cl}`)
        let jar = path.join(__dirname, `./yuicompressor-2.4.8-1492520253.jar`)
        fs.writeFileSync(tmpfile, v)

        let option = []
        if (nomunge == 'true') {
            option.push('--nomunge')
        }
        if (presemi == 'true') {
            option.push('--preserve-semi')
        }
        if (disopt == 'true') {
            option.push('--disable-optimizations')
        }


        let cmd = `java -Xmx32m -jar ${jar} ${tmpfile} -o '${tmpfile}' --charset UTF-8 --type ${cl} ${option.join(' ')}`
        child_process.exec(cmd).on('exit', () => {
            res.status(200)
              .set('Content-Type', 'text/plain')
              .send(fs.readFileSync(tmpfile))
            fs.unlinkSync(tmpfile)
            next()
        })
    }
})

module.exports = router
