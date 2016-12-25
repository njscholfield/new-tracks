(function() {
  var app = angular.module('new-tracks');

  app.controller('trackController', ['$scope', '$http', '$uibModal', '$anchorScroll', 'uibButtonConfig', function($scope, $http, $uibModal, $anchorScroll, uibButtonConfig) {
    var trk = this;
    trk.result = [];
    $scope.tracks = [];
    trk.searchCollapsed = true;
    uibButtonConfig.activeClass = 'btn-primary';
    var sizeTester = document.getElementById('sizeTester');
    if(!sizeTester.offsetParent) {
      trk.displayMode = 'Block';
    } else {
      trk.displayMode = 'Table';
    }
    trk.currentMode = function(input) {
      return input === trk.displayMode;
    };
    trk.toggleSearch = function() {
      trk.searchCollapsed = !trk.searchCollapsed;
    };
    trk.focus = function() {
      document.getElementById('trackSearch').focus();
    };
    trk.showJSON = false;
    trk.toggleJSON = function() {
      trk.showJSON = !trk.showJSON;
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

    $scope.$watch('panel', function(newValue) {
      if(newValue === 3) {
        $scope.getTracks().then(function success() {
          window.setTimeout(function() {
            if($scope.currentTrack) {
              $anchorScroll($scope.currentTrack.toString());
            }
          }, 0);
        });
      }
    });

    $scope.getTracks = function() {
      return new Promise(function(resolve, reject) {
        $http.get('/api/' + $scope.user.username)
          .then(function success(response) {
            $scope.updateResult(response.data);
            $scope.updateTrackIDList(response.data.tracks);
            resolve('Tracks fetched sucessfully');
          }, function error(response) {
            if(response.status === 403) {
              $scope.checkLogin();
            }
            reject(Error(response));
          });
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
          },
          releaseDate: function() {
            if(track.releaseDate) {
              return new Date(track.releaseDate);
            } else {
              return undefined;
            }
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

  app.controller('editTrackController', function($http, $uibModalInstance, track, user, releaseDate) {
    this.submitInfo = {
      trackID: track.trackID,
      title: track.title,
      artist: track.artist,
      releaseDate: releaseDate
    };

    this.delete = function() {
      $http.post('/api/' + user.username + '/remove', this.submitInfo)
        .then(function success(response) {
          $uibModalInstance.close({success: true, response: response.data});
        }, function error(response) {
          $uibModalInstance.close({success: false, response: response});
        });
    };

    this.ok = function() {
      $http.post('/api/' + user.username + '/edit', this.submitInfo)
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
