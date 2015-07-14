//'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MainCtrl', function ($scope, $http) {

    $scope.service_root = 'http://maven.ai:9000/hangman/api/';
    $scope.status = "initial";
    $scope.game = "";
    $scope.answer = "";
    $scope.failedGuess = [];

    /*start a new game*/
    $scope.startGame = function () {
      //retrieve game from webservice
      var promise = $http.get($scope.service_root + 'create');
      promise.then(function (result) {
        $scope.game = result.data;
        $scope.failedGuess = $scope.game.failedGuesses.split('');
        //empty dashes
        for (i = 0; i < $scope.game.wordLength; i++) {
          $scope.answer += '-';
        }
        $scope.status = "play"
      });
    }

    /*set a game status on client based on server response*/
    $scope.setStatus = function (status) {
      if (status == "won") {
        $scope.status = "won";
      }
      else if (status == "lost") {
        $scope.status = "lost";
      }
      else {
        $scope.status = "play"
      }
    }

    /*load an existing game and continue*/
    $scope.loadGame = function (gameId) {
      $scope.gameId = "";

      if (isNaN(gameId)) {
          alert("Please only numbers are allowed.");
        return;
      }

      //retrieve game from webservice
      var promise = $http.get($scope.service_root + 'load/' + gameId);
      promise.then(function (result) {

        //handle case where game is unavailable
        if (result.data == "NA") {
          alert("No game with the id: " + gameId);
          return;
        }

        //restore game state
        $scope.game = result.data;
        $scope.failedGuess = $scope.game.failedGuesses.split('');
        var rightGuesses = JSON.parse($scope.game.rightGuesses);

          //empty dashes
          for (i = 0; i < $scope.game.wordLength; i++) {
            $scope.answer += '-';
          }
        $scope.answer = $scope.answer.split("");
        angular.forEach(rightGuesses, function (item) {
          var ch = item.guess;
          var indices = (item.index);
          angular.forEach(indices, function (index) {
            $scope.answer[parseInt(index)] = ch;
          })
        });

        $scope.answer = $scope.answer.join("");
        $scope.setStatus($scope.game.status);

        if($scope.status == "won" || $scope.status == "lost"){
          $scope.answer = $scope.game.answer;
        }
      });
    }


    $scope.guess = function (ch) {
      ch = ch.toLowerCase();
      $scope.charGuess = "";
      if (ch.length != 1) {
        if (ch.length > 1) {
          alert("Please only enter one character at a time");
        }
        return;
      }

      //if the character has been guessed
      for (i in $scope.failedGuess) {
        if (ch == $scope.failedGuess[i]) return;
      }

      var promise = $http.get($scope.service_root + 'play/' + $scope.game.id + "/" + ch);
      promise.then(function (result) {
        //set game status
        $scope.setStatus(result.data.state);
        if ($scope.status == "won") {
          $scope.answer = result.data.answer;
        }
        else if ($scope.status == "lost") {
          $scope.answer = result.data.answer;
        }
        else {
          //if it was a correct char
          if (result.data.status) {
            $scope.answer = $scope.answer.split("");
            //loop through indeces and assign indices value to anser index
            if (result.data.indices) {
              var indices = result.data.indices.split(',');
              for (i in indices) {
                $scope.answer[indices[i]] = ch;
              }
            }
            $scope.answer = $scope.answer.join("");
          }
          else {
            $scope.failedGuess.push(ch);
          }
        }
      });
    }
  });
