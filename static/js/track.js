(function() {
  var app = angular.module('new-tracks');

  app.controller('trackController', ["$scope", "$http", function($scope, $http) {
    var trk = this;
    trk.result = [];
    trk.showJSON = false;
    trk.toggleJSON = function() {
      trk.showJSON = !trk.showJSON;
    }
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
        $scope.getTracks();
      });
    };

    $scope.SCLogout = function() {
      $scope.user = undefined;
    };

    $scope.getTracks = function() {
      $http.get('/' + $scope.user.permalink, {headers: {username: $scope.user.permalink}})
        .then(function success(response) {
          console.log(response);
          trk.result = response.data;
        }, function error(response) {
          console.log('Error getting tracks: ' + response);
        });
    }

  }]);

})();
