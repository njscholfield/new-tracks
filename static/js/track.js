(function() {
  var app = angular.module('new-tracks');

  app.controller('trackController', ["$scope", "$http", "$uibModal", function($scope, $http, $uibModal) {
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
      });
    };

    $scope.SCLogout = function() {
      $scope.user = undefined;
    };

    $scope.$watch('panel', function(newValue) {
      if(newValue === 3) {
        $scope.getTracks();
      }
    });

    $scope.getTracks = function() {
      $http.get('/' + $scope.user.permalink, {headers: {username: $scope.user.permalink}})
        .then(function success(response) {
          trk.result = response.data;
        }, function error(response) {
          console.log('Error getting tracks: ' + response);
        });
    };

    this.removeTrack = function(title, trackID) {
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'directives/removeTrackModal.html',
        controller: 'removeTrackController',
        controllerAs: 'vm',
        resolve: {
          title: function() {
            return title;
          },
          trackID: function() {
            return trackID;
          },
          user: function() {
            return $scope.user;
          }
        }
      });
      modalInstance.result.then(function close(response) {
        if(response.success) {
          trk.result = response.response;
        } else {
          console.log('Error removing track: ' + response.response);
        }
      });
    };

  }]);

  app.controller('removeTrackController', function($http, $uibModalInstance, title, trackID, user) {
    this.title = title;
    this.trackID = trackID;
    this.submitInfo = {
      permalink: user.permalink,
      trackID: trackID
    };

    this.ok = function() {
      $http.post('/' + user.permalink + '/remove', this.submitInfo)
        .then(function success(response) {
          $uibModalInstance.close({success: true, response: response.data});
        }, function error(response) {
          $uibModalInstance.close({success: false, response: response});
        });
    }

    this.cancel = function() {
      $uibModalInstance.dismiss();
    }
  })

})();
