(function () {
    if (location.protocol == 'https:')
      location.href = 'http:' + window.location.href.substring(window.location.protocol.length);

    'use strict';

    angular
        .module('player', ['ui.router'])
        .config(config);


    function config($stateProvider, $urlRouterProvider) {
        // default route
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'home/index.html',
                controller: 'Home.IndexController',
                controllerAs: 'appCtrls'
            });
    }

    // manually bootstrap angular after the JWT token is retrieved from the server
    $(function () {
        angular.bootstrap(document, ['player']);
    });
})();
