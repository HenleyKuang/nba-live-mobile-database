(function () {
    if (location.protocol == 'https:')
      location.href = 'http:' + window.location.href.substring(window.location.protocol.length);

    'use strict';

    angular
      .module('database', ['ui.router', 'me-lazyload'])
      .config(config)
      .run(run);

    function config($stateProvider, $urlRouterProvider) {
        // default route
        $urlRouterProvider.otherwise("/");

        $stateProvider
          .state('home', {
            url: '/',
            templateUrl: 'home/index.html',
            controller: 'Home.IndexController',
            controllerAs: 'appCtrls'
          })
          .state('uploader', {
            url: '/uploader',
            templateUrl: 'uploader/index.html',
            controller: 'Uploader.IndexController',
            controllerAs: 'appCtrls'
          });
    }

    function run($rootScope) {
      $rootScope.convertHeightInchToFeetInch = function (height_inches) {
        var feet = Math.floor(height_inches / 12);
        var inch = height_inches % 12;
        return feet.toString() + "'" + inch.toString() + '"';
      };

      $rootScope.callGetAPI = function ( apiUrl, successCallback, failCallback, alwaysCallback ) {
        $.getJSON (apiUrl).then( function (json) {
          $rootScope.$apply(function () { successCallback(json); });
          }).fail(function(jqxhr){
          if( failCallback != null ) $rootScope.$apply(function () { failCallback(); });
          }).always(function() {
          if( alwaysCallback != null ) $rootScope.$apply(function () { alwaysCallback(); });
        });
      };

      $rootScope.callPostAPI = function ( apiUrl, postData, successCallback, failCallback, alwaysCallback ){
        $.post(apiUrl, postData, successCallback);
      };
    }

    // manually bootstrap angular after the JWT token is retrieved from the server
    $(function () {
        angular.bootstrap(document, ['database']);
    });
})();
