(function() {
  var app = angular.module('new-tracks', ['ngSanitize', 'ngAnimate', 'ui.bootstrap']);

  app.controller('PanelController', ['$scope', '$http', function($scope, $http) {
    $scope.panel = 1;
    $scope.nearTopOfPage = true;
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
          if(response.data.loggedIn) {
            $scope.getTracks();
            $scope.checkForResumeTrack();
          }
        }, function error(response) {
          console.log('Error checking login status: ' + response);
        });
    };
    $scope.checkLogin();

    $scope.scrollToTop = function() {
      var top = document.getElementById('top');
      top.scrollIntoView({behavior: 'smooth'});
    };

    window.onscroll = function () {
      var oldstate = $scope.nearTopOfPage;
      if (document.body.scrollTop > 200 ) {
        $scope.nearTopOfPage = false;
      }
      else {
        $scope.nearTopOfPage = true;
      }
      if($scope.nearTopOfPage != oldstate) {
        $scope.$apply();
      }
    };
  }]);

  app.controller('resumeController', ['$scope', '$timeout', '$http', function($scope, $timeout, $http) {
    var resume = this;
    resume.visible = false;
    resume.trackInfo = {};
    resume.hide = function() {
      resume.visible = false;
    };
    resume.getTrackInfo = function(trackID) {
      return new Promise(function(resolve) {
        var url = 'https://api.soundcloud.com/tracks/' + trackID + '?client_id=30cba84d4693746b0a2fbc0649b2e42c';
        $http.get(url)
          .then(function success(response) {
            resume.trackInfo = response.data;
            resolve();
          });
      });
    };
    $scope.checkForResumeTrack = function() {
      $timeout(function() {
        if($scope.user && $scope.user.loggedIn && $scope.user.resumeTrack && $scope.user.resumeTrack !== $scope.currentTrack) {
          resume.getTrackInfo($scope.user.resumeTrack).then(function success() {
            resume.visible = true;
            $scope.$apply();
          });
        } else {
          resume.visible = false;
        }
      }, 0);
    };
  }]);

  app.controller('addTrackModalController', function($http, $uibModalInstance, trackInfo, releaseDate, user) {
    this.trackInfo = trackInfo;
    this.releaseDate = releaseDate;
    this.submitInfo = {title: trackInfo.title, artist: trackInfo.user.username, releaseDate: releaseDate, trackID: trackInfo.id, isFavorite: false};
    this.updateFavorite = function(newValue) {
      this.submitInfo.isFavorite = newValue;
    };
    this.ok = function() {
      $http.post('/api/' + user.username + '/add', this.submitInfo)
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

  app.directive('navbar', function() {
    return {
      restrict: 'E',
      controller: 'PanelController as panelCtrl',
      templateUrl: 'directives/loginNav.html'
    };
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

  app.directive('resumeAlert', function() {
    return {
      restrict: 'E',
      controller: 'resumeController as resumeCtrl',
      templateUrl: 'directives/resumeAlert.html'
    };
  });

})();
