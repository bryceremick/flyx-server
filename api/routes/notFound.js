var express = require('express');
var router = express.Router();
const apiRes = require('../helpers/apiResponse')

/* GET home page. */
router.get('/', function(req, res, next) {
    return apiRes.notFound(res, 'Invalid API Route');
});

module.exports = router;