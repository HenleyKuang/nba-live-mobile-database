(function () {
    'use strict';

    angular
      .module('database')
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

    function Controller($rootScope, $http, $q, $location) {
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

        $rootScope.callGetAPI("/api/players/search", function (parsed_players_raw) {
          appCtrls.parsed_players = parsed_players_raw;
        });

        appCtrls.selectedCard = {}
        appCtrls.getCardAPI = function (card_hash) {
          $location.search('player_id',card_hash);
          var q = {
            hash: card_hash
          };
          $rootScope.getSearchAPI(q).then(function(res) {
            appCtrls.selectedCard = res[0];
          })
        }

        $rootScope.getSearchAPI = function(query) {
          return $http.get('/api/players/search', { params: query } )
            .then(function handleSuccess(res) {
              return res.data;
            }, function handleError(res) {
              return $q.reject(res.data);
            });
        }

        appCtrls.onLoad = function () {
          //check URL parameter if user is linking directly to a specific game
          let searchObject = $location.search();
          if( searchObject.hasOwnProperty('player_id') ) {
            let base64Image = '/api/players/searchCardImage?hash=' + searchObject.player_id
            $('.card-img').attr('src', base64Image);
            appCtrls.getCardAPI(searchObject.player_id);
            $('#cardModal').modal('show');
          }
        }

        appCtrls.onLoad();
    }
})();
