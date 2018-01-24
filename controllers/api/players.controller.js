var config = require('../../config.json');
var express = require('express');
var router = express.Router();
var userService = require('../../services/user.service');

// routes
router.get('/search', searchGame);

module.exports = router;

function searchGame(req, res) {
  userService.getById( req.headers.referer, req.query._id, req.query.f )
  .then(function (link) {
    //console.log(link);
    if( link ) {
      //found link
      res.send(link);
    }
    else {
      //failed
      res.status(404).send('Could not locate stream.');
    }
  })
  .catch(function(err) {
    res.status(400).send(err);
  });
}
