var config = require('../config.json');
var _ = require('lodash');
var Q = require('q');
var request = require ('request');
var util = require('util');

var service = {};

service.getById = getById;

module.exports = service;

function getById(referer, game_id, f) {
  var deferred = Q.defer();
  if ( referer != null && referer.includes('streamforce.herokuapp.com/player/') ) {
    let time = new Date().getTime().toString();
    let feed = (f == true) ? 4 : 1;
    let yql_query_link = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Feplstreams.club%2Fna.php%3Fid%3D" + game_id + "%26feed%3D" + feed + "%26cam%3D0%26" + time + "%22&format=json&diagnostics=true&callback=";

    request.get(yql_query_link, function ( error, response, body ) {
        var success = false;
        if( error )
          deferred.resolve();
        else {
          let data = JSON.parse(body);
          if( data.query.results != null ) {
            if( data.query.results.body != null ) {
              let htmlsource = data.query.results.body.div;
              for( let i = 0; i < htmlsource.length; i++ ) {
                let source = htmlsource[i];
                if( source.font != null && source.font.iframe != null && source.font.iframe.src != null ) {
                  let link = source.font.iframe.src;
                  console.log(link);
                  if( typeof link == 'string' && link.includes("cdnak.neulion.com/nlds/nba/") ) {
                    let link = source.match('http://.*cdnak.neulion.com/nlds/nba/.*"')[0].replace("_hd.m3u8", "_hd_4500_ipad.m3u8");
                    success = true;
                    deferred.resolve(link);
                  }
                }
              }
            }
          }
        }

        if( success == false )
          deferred.resolve();
      });
    }
    else {
      deferred.resolve('http://nlds16.cdnak.neulion.com/nlds/nba/nba247/as/live/ipad.m3u8');
    }
    return deferred.promise;
}
