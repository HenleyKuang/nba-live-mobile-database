var config = require('../config.json');
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
service.searchCardData = searchCardData;
service.search = search;

module.exports = service;

function search(searchParameters) {
  var deferred = Q.defer();
  var search_q = Object.keys(searchParameters).length ? {
    //create search query using parameters passed through req.query
    "hash": searchParameters.hash
  } : {};
  db.cards.find(search_q, { card_img: 0 }).toArray(function(err, playerData) {
    // collInfos is an array of collection info objects that look like:
    // { name: 'test', options: {} }
    if(err) deferred.reject(err.name + ': ' + err.message);
    if(playerData) {
      deferred.resolve(playerData);
    }
    else {
      // user not found
      deferred.resolve();
    }
  });
  return deferred.promise;
}

function searchCardData(player_hash) {
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
      deferred.resolve(playerData[0]);
    }
    else {
      // user not found
      deferred.resolve();
    }
  });
  return deferred.promise;
}

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
