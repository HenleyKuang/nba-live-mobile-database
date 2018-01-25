(function () {
    'use strict';

    angular
      .module('player')
      .controller('Home.IndexController', Controller)
      .directive('columnRepeatDirective', function () {
        return {
          restrict: 'A',
          link: function (scope, element, attrs) {
            if (scope.$parent.$last && scope.$last) {
              setTimeout(function () {
                // initialize data table
                scope.tableParent = $('.table-parent').dataTable({
                  "columnDefs": [{
                    "targets": [0, 3, 5],
                    "orderable": false,
                    "width": "40px"
                  }],
                  "order": [[2, 'desc']],
                });
                // set click action to show card modal
                scope.tableParent.$('.show-card-img').click(function (elem) {
                  // var data = scope.tableParent.fnGetData(this);
                  var base64Image = elem.currentTarget.getAttribute('ng-src');
                  $('.card-img').attr('src', base64Image);
                });
                // set lazy load images
                /*
                scope.tableParent.on('page.dt', function (elem) {
                  // var data = scope.tableParent.fnGetData(this);
                  console.log(elem);
                  var imgSrc = $(elem.currentTarget).children('.show-card-img');
                  console.log(imgSrc);
                  elem.currentTarget.attr('src', imgSrc);
                });
                */  
                // set column filtering actions
                $('.drop-down-column > select').on('change', function () {
                  if (this.value == "ALL") {
                    scope.tableParent.api().column($(this).parent().index()).search('').draw();
                  } else {
                    scope.tableParent.api().column($(this).parent().index()).search(this.value).draw();
                  }
                });
              }, 1);
            }
          }
        };
      })
      .directive('getImgSrcDirective', function () {
        return function (scope, element, attrs) {
          // scope.tableParent = $('.table-parent').dataTable();
        };
      });

    function Controller($scope, $window, $timeout, $location, UserService, FlashService) {
        var appCtrls = this;

        //App Variables
        appCtrls.tableHeaders = [
            { headerName: "Card", headerClass: "p-0 text-center"},
            { headerName: "NAME"},
            { headerName: "OVR" },
            { headerName: "LU", headerClass: "drop-down-column", dropDownFilter: true, dropDownOptions: ["ALL", "BAL", "DEF", "SHT", "RUN", "POW"] },
            { headerName: "HT" },
            { headerName: "POS", headerClass: "drop-down-column", dropDownFilter: true, dropDownOptions: ["ALL", "PG", "SG", "SF", "PF", "C"] },
            { headerName: "SPD" },
            { headerName: "AGL" },
            { headerName: "MRS" },
            { headerName: "3PT" },
            { headerName: "IPS" },
            { headerName: "PST" },
            { headerName: "DNK" },
            { headerName: "SWC" },
            { headerName: "OBD" },
            { headerName: "BLK" },
            { headerName: "STL" },
            { headerName: "DRI" },
            { headerName: "PSA" },
            { headerName: "BOX" },
            { headerName: "ORB" },
            { headerName: "DRB" },
        ];
        appCtrls.showBoxScore = false;

        //list of NBA API EndPoints
        appCtrls.apiEndPoints = {};

      //custom JSON function to reduce lines
        appCtrls.callAPI = function ( apiUrl, successCallback, failCallback, alwaysCallback ) {
        $.getJSON (apiUrl).then( function (json) {
            $scope.$apply(function () { successCallback(json); });
            }).fail(function(jqxhr){
            if( failCallback != null ) $scope.$apply(function () { failCallback(); });
            }).always(function() {
            if( alwaysCallback != null ) $scope.$apply(function () { alwaysCallback(); });
            });
        };

        appCtrls.callAPI("parsed_players.json", function (parsed_players_raw) {
          console.log(parsed_players_raw);
          appCtrls.parsed_players = parsed_players_raw;
        });

        appCtrls.convertHeightInchToFeetInch = function (height_inches) {
          var feet = Math.floor(height_inches / 12);
          var inch = height_inches % 12;
          return feet.toString() + "'" + inch.toString() + '"';
        };
    }
})();
