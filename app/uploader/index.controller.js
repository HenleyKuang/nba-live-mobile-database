(function () {
    'use strict';

    angular
      .module('database')
      .controller('Uploader.IndexController', Controller);

    function Controller($scope, $window, $timeout, $location, $http) {
      var appCtrls = this;

      appCtrls.sendFileAPI = function (apiUrl, file, successCallback, failCallback, alwaysCallback) {
        var formData = new FormData();
        formData.append('file', file);
        $http({
          url: apiUrl,
          method: 'POST',
          headers: {
            'Content-Type': undefined // 'multipart/form-data'
          },
          data: formData,
          transformRequest: angular.identity,
        }).success(function (json) {
          successCallback(json);
        }).error(function (data, status) {
          if (failCallback != null) failCallback(data, status);
        }).finally(function () {
          if (alwaysCallback != null) alwaysCallback();
        });
      };

      appCtrls.uploadFiles = []
      appCtrls.uploadFile = function () {
        appCtrls.uploadFiles = Array.from(document.getElementById('photo').files);
        angular.forEach(appCtrls.uploadFiles, function (file, index) {
          var reader = new FileReader();
          reader.onload = function (e) {
            $('#preview_' + index).attr('src', e.target.result);
          };
          reader.readAsDataURL(file);
        });

        appCtrls.parsedCardResponse = []
        angular.forEach(appCtrls.uploadFiles, function (file, index) {
          appCtrls.sendFileAPI('http://127.0.0.1:8000/parse/', file, function (card_json) {
            appCtrls.parsedCardResponse[index] = card_json;
            console.log(card_json);
            // appCtrls.parsedCardResponse[index] = JSON.stringify(card_json, null, "    ");
            // console.log(appCtrls.parsedCardResponse);
          });
        });
      };

      appCtrls.badCards = {}
      appCtrls.markCard = function (index, isBad) {
        appCtrls.badCards[index] = isBad;
      };
    }
})();
