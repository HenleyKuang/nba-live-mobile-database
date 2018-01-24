(function () {
    'use strict';

    angular
        .module('player')
        .factory('UserService', Service);

    function Service($http, $q) {
        var service = {};

        service.GetById = GetById;

        return service;

        function GetById(query) {
            return $http.get('/api/games/search', { params: query } ).then(handleSuccess, handleError);
        }

        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }
    }

})();
