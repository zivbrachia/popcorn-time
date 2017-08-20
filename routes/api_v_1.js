'use strict'

let express = require('express');
let router = express.Router();

router.get('/', function (req, res) {
    res.send('API V.1');
});

module.exports = router;
