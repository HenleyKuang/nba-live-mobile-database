var express = require('express');
var router = express.Router();

// use session auth to secure the angular app files
router.use('/', function (req, res, next) {

    next();
});

// serve angular app files from the '/app' route
router.use('/', express.static('app'));

module.exports = router;
