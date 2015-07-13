'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:ManagementCtrl
 * @description
 * # ManagementCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('ManagementCtrl', function ($scope, $http) {

    $scope.service_root = 'http://localhost:9099/hangman/api/';
    $scope.games_data = [];
    $scope.status = "initial";

    //load all game records
    $scope.loadAllGames = function () {
      //retrieve game from webservice
      var promise = $http.get($scope.service_root + 'management');
      promise.then(function (result) {
        $scope.games_data = result.data;
        $scope.status = "show";
      });

    }
  });
