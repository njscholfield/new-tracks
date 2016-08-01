(function() {
  var app = angular.module('new-tracks');

  app.controller('trackController', ["$scope", function($scope) {
    $scope.SCAuth = function() {
      SC.initialize({
        client_id: '30cba84d4693746b0a2fbc0649b2e42c',
        redirect_uri: 'http://localhost:8000/callback.html'
      });

      // initiate auth popup
      SC.connect().then(function() {
        return SC.get('/me');
      }).then(function(me) {
        $scope.user = me;
        $scope.$apply();
      });
    };

    $scope.SCLogout = function() {
      $scope.user = undefined;
    };

  }]);

})();
