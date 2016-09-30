(function() {
  var app = angular.module('new-tracks', ['ngSanitize', 'ngAnimate', 'ui.bootstrap']);

  app.controller('PanelController', ["$scope", "$http", function($scope, $http) {
    $scope.panel = 1;
    this.currentPanel = function(input) {
      return $scope.panel === input;
    };
    $scope.setPanel = function(input) {
      $scope.panel = input;
    };

    $scope.checkLogin = function() {
      $http.get('/auth/verify')
        .then(function success(response) {
          $scope.user = response.data;
          $scope.getTracks();
        }, function error(response) {
          console.log('Error checking login status: ' + response);
        });
    };
    $scope.checkLogin();
  }]);

  app.controller('addTrackModalController', function($http, $uibModalInstance, trackInfo, releaseDate, user) {
    this.trackInfo = trackInfo;
    this.releaseDate = releaseDate;
    this.submitInfo = {title: trackInfo.title, artist: trackInfo.user.username, releaseDate: releaseDate, trackID: trackInfo.id};
    this.ok = function() {
      $http.post('/' + user.username + '/add', this.submitInfo)
        .then(function success(response) {
          $uibModalInstance.close({success: true, response: response.data});
        }, function error(response) {
          $uibModalInstance.close({success: false, response: response});
        });
    }
    this.cancel = function() {
      $uibModalInstance.dismiss();
    }
  });

  app.directive('navpills', function() {
    return {
      restrict: 'E',
      controller: 'PanelController as panelCtrl',
      templateUrl: 'directives/navpills.html'
    };
  });

  app.directive('inputForm', function() {
    return {
      restrict: 'E',
      controller: 'descriptionController as descriptionCtrl',
      templateUrl: 'directives/inputForm.html'
    };
  });

  app.directive('description', function() {
    return {
      restrict: 'E',
      controller: 'descriptionController as descriptionCtrl',
      templateUrl: 'directives/description.html'
    };
  });

  app.directive('tracks', function() {
    return {
      restrict: 'E',
      controller: 'trackController as trackCtrl',
      templateUrl: 'directives/tracks.html'
    };
  });

})();
