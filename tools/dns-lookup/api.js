const fs = require('fs')
    ,dns = require('dns')
    ,path = require('path')
    ,express = require('express')
    ,pc = require('async')

let router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).send('test').end()
    next()
})

router.post('/', (req, res, next) => {
    let domain = req.body.domain || null
    if (domain == null) {
        res.status(400).end()
        next()
        return
    } else {
        let result = {}
        pc.mapLimit([
            'A',
            'AAAA',
            'MX',
            'TXT',
            'SRV',
            'PTR',
            'NS',
            'CNAME',
            'SOA',
        ], 1, (item, cb) => {
            dns.resolve(domain, item, (err, addresses) => {
                result[item] = addresses
                cb()
            })
        }, (err, r) => {
            res.status(200)
              .set('Content-Type', 'application/json')
              .send(JSON.stringify(result))
            next()
        })

    }
})

module.exports = router
