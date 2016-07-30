(function() {
  var app = angular.module('new-tracks', ['ngSanitize']);

  app.controller('PanelController', ["$scope", function($scope) {
    $scope.panel = 1;
    this.currentPanel = function(input) {
      return $scope.panel === input;
    };
    $scope.setPanel = function(input) {
      $scope.panel = input;
    };
  }]);

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

  // Use function in templateUrl to show logged in or logged out navbar

})();
