(function () {
    'use strict';

    angular
      .module('database')
      .controller('Uploader.IndexController', Controller);

    function Controller($scope, $rootScope, $window, $timeout, $location, $http, $q) {
      var appCtrls = this;
      appCtrls.addingToDatabase = false;
      appCtrls.showExisting = false;
      appCtrls.readyAddDatabase = false;
      appCtrls.existList = [];

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

        appCtrls.parsedCardResponse = [];
        appCtrls.addStatus = {};
        let hashList = {};
        let cardsProcessed = 0;
        angular.forEach(appCtrls.uploadFiles, function (file, index) {
          appCtrls.sendFileAPI('http://127.0.0.1:8000/parse/', file, function (card_json) {
            appCtrls.parsedCardResponse[index] = card_json;
            // appCtrls.existCard(card_json["hash"], index);
            hashList[index] = card_json["hash"];
            cardsProcessed++;
            if (cardsProcessed == appCtrls.uploadFiles.length) {
              appCtrls.existCardList(hashList);
            }
          })
        });

      };

      appCtrls.addStatus = {}
      appCtrls.addCard = function (card_json, index) {
        $rootScope.callPostAPI('http://127.0.0.1:8000/add/', card_json, function (data, textStatus) {
          // console.log(`textStatus: ${textStatus}`);
          if (textStatus == "success") {
            let response = JSON.parse(data);
            $scope.$apply(function() { appCtrls.addStatus[index] = response["status"] });
          }
        });
      };

      appCtrls.existCard = function (card_hash, index) {
        $rootScope.callPostAPI('http://127.0.0.1:8000/exist/', card_hash, function (data, textStatus) {
          if (textStatus == "success") {
            let response = JSON.parse(data);
            $scope.$apply(function() { appCtrls.parsedCardResponse[index]["exists"] = response["status"] });
          }
        });
      }

      appCtrls.existCardList = function (card_hash_list) {
        $rootScope.callPostAPI('http://127.0.0.1:8000/exist_list/', JSON.stringify(card_hash_list), function (data, textStatus) {
          if (textStatus == "success") {
            let response = JSON.parse(data);
            for (let index in response) {
              $scope.$apply(function() { appCtrls.existList[index] = response[index] });
            }
          }
        });
      }

      appCtrls.badCards = {}
      appCtrls.markCard = function (index, isBad) {
        appCtrls.badCards[index] = isBad;
      };

      appCtrls.addCardsToDatabase = function () {
        appCtrls.addingToDatabase = true;
        angular.forEach(appCtrls.parsedCardResponse, function(card_json, index) {
          if (!!appCtrls.badCards[index] === false) {
            appCtrls.addCard(JSON.stringify(card_json), index);
          }
        });
        appCtrls.addingToDatabase = false;
      };
    }
})();
