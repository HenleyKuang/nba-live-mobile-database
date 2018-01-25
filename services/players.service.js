﻿var config = require('../config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var request = require ('request');
var util = require('util');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('cards');

var service = {};

service.searchCardImage = searchCardImage;

module.exports = service;

function searchCardImage(player_hash) {
  var deferred = Q.defer();
  // if ( referer != null && referer.includes('nba-live-mobile-database.herokuapp.com/database/') ) {
  var search_q = {
    //create search query using parameters passed through req.query
    "hash": player_hash
  };
  db.cards.find(search_q).toArray(function (err, playerData) {
    // collInfos is an array of collection info objects that look like:
    // { name: 'test', options: {} }
    if (err) deferred.reject(err.name + ': ' + err.message);
    if (playerData && playerData[0]) {
      deferred.resolve(playerData[0].card_img);
    }
    else {
      // user not found
      deferred.resolve();
    }
  });
  return deferred.promise;
}