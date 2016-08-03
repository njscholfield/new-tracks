(function() {
  var app = angular.module('new-tracks', ['ngSanitize', 'ngAnimate', 'ui.bootstrap']);

  app.controller('PanelController', ["$scope", function($scope) {
    $scope.panel = 1;
    this.currentPanel = function(input) {
      return $scope.panel === input;
    };
    $scope.setPanel = function(input) {
      $scope.panel = input;
    };
  }]);

  app.controller('addTrackModalController', function($http, $uibModalInstance, trackInfo, releaseDate, user) {
    this.trackInfo = trackInfo;
    this.releaseDate = releaseDate;
    this.submitInfo = {title: trackInfo.title, artist: trackInfo.user.username, releaseDate: releaseDate, trackID: trackInfo.id};
    this.ok = function() {
      this.submitInfo.me = {
        full_name: user.full_name,
        permalink: user.permalink,
        username: user.username,
        user_id: user.id
      };
      $http.post('/' + user.permalink + '/add', this.submitInfo)
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
