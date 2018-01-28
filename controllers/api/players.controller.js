var config = require('../../config.json');
var express = require('express');
var router = express.Router();
var playerService = require('../../services/players.service');

// routes
router.get('/searchCardImage', searchCardImage);
router.get('/search', search);

module.exports = router;

function searchCardImage(req, res) {
  playerService.searchCardImage( req.query.hash )
    .then(function (base64Image) {
    if (base64Image) {
      //found link
      var img = new Buffer(base64Image, 'base64');
      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': img.length,
      });
      res.end(img);
    }
    else {
      //failed
      res.status(404).send('Could not find image.');
    }
  })
  .catch(function(err) {
    res.status(400).send(err);
  });
}


function search(req, res) {
  playerService.search(req.query.searchParameters)
    .then(function (result) {
      if (result) {
        //found link
        res.send(result);
      }
      else {
        //failed
        res.status(404).send({});
      }
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
}