(function() {
  var app = angular.module('new-tracks');

  app.controller('trackController', ["$scope", "$http", "$uibModal", function($scope, $http, $uibModal) {
    var trk = this;
    trk.result = [];
    $scope.tracks = [];
    trk.showJSON = false;
    trk.toggleJSON = function() {
      trk.showJSON = !trk.showJSON;
    }
    $scope.SCAuth = function() {
      SC.initialize({
        client_id: '30cba84d4693746b0a2fbc0649b2e42c',
        redirect_uri: 'https://tracks.noahscholfield.com/callback.html'
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

    $scope.updateResult = function(input) {
      trk.result = input;
    };

    $scope.updateTrackIDList = function(tracks) {
      $scope.tracks = [];
      if(tracks.length > 0) {
        tracks.forEach(function(track) {
          $scope.tracks.push(track.trackID);
        });
      }
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
          $scope.updateResult(response.data);
          $scope.updateTrackIDList(response.data.tracks);
        }, function error(response) {
          console.log('Error getting tracks: ' + response);
        });
    };

    this.editTrack = function(track) {
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'directives/editTrackModal.html',
        controller: 'editTrackController',
        controllerAs: 'vm',
        resolve: {
          track: function() {
            return track;
          },
          user: function() {
            return $scope.user;
          }
        }
      });
      modalInstance.result.then(function close(response) {
        if(response.success) {
          $scope.updateResult({tracks: response.response});
          $scope.updateTrackIDList(response.response);
        } else {
          console.log('Error removing track: ' + response.response);
        }
      });
    };

  }]);

  app.controller('editTrackController', function($http, $uibModalInstance, track, user) {
    this.submitInfo = {
      permalink: user.permalink,
      trackID: track.trackID,
      title: track.title,
      artist: track.artist,
      releaseDate: new Date(track.releaseDate)
    };

    this.delete = function() {
      $http.post('/' + user.permalink + '/remove', this.submitInfo)
        .then(function success(response) {
          $uibModalInstance.close({success: true, response: response.data});
        }, function error(response) {
          $uibModalInstance.close({success: false, response: response});
        });
    };

    this.ok = function() {
      $http.post('/' + user.permalink + '/edit', this.submitInfo)
        .then(function success(response) {
          $uibModalInstance.close({success: true, response: response.data});
        }, function error(response) {
          $uibModalInstance.close({success: false, response: response});
        });
    };

    this.cancel = function() {
      $uibModalInstance.dismiss();
    };
  });

})();
