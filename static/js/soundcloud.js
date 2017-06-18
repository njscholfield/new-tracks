(function() {
  var app = angular.module('new-tracks');
  var scapi = 'https://api.soundcloud.com/resolve.json?url=';
  var client = 'client_id=30cba84d4693746b0a2fbc0649b2e42c';

  app.controller('descriptionController', ['$http', '$location', '$scope', '$uibModal', '$sce', function($http, $location, $scope, $uibModal, $sce) {
    var sc = this;
    sc.showJSON = false;
    sc.html = [];
    sc.addTrackToList = function(trackID) {
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'directives/addTrackModal.html',
        controller: 'addTrackModalController',
        controllerAs: 'vm',
        resolve: {
          trackInfo: function() {
            return trackID;
          },
          releaseDate: function() {
            if(trackID.release_year) {
              return new Date(trackID.release_year, trackID.release_month - 1, trackID.release_day);
            } else {
              return undefined;
            }
          },
          user: function() {
            return $scope.user;
          }
        }
      });
      modalInstance.result.then(function close(response) {
        if(response.success) {
          $scope.updateTrackList(response.response);
          $scope.updateTrackIDList(response.response);
        } else {
          console.log('Error adding: ' + response.response);
        }
      });
    };
    sc.submit = function(callURL) {
      loading(true);
      if(callURL === undefined) {
        callURL = scapi + sc.url + '&' + client;
      }
      $http.get(callURL)
        .then(function success(response) {
          processJSON(response);
          $location.url(response.data.id);
        }, function error(response) {
          if(response.status === 403) {
            sc.trackJSON = {'error': 'The information for this track is not available', 'code': 403};
          } else if(response.status === 404) {
            sc.trackJSON = {'error': 'Invalid URL, please try again', 'code': 404};
          } else {
            $http.jsonp($sce.trustAsResourceUrl(callURL))
              .then(function success(response) {
                processJSON(response);
                $scope.setPanel(2);
                $location.url(response.data.id);
              }, function error(response) {
                sc.trackJSON = {'error': 'Something went wrong... This could have been caused by a track for which the information is not available, or a server/network problem. Please try again.', 'code': 'JSONP Response Code ' + response.status};
              });
          }
          console.log(response.status + ' ' + response.statusText);
        })
        .then(function() {
          $scope.setPanel(2);
          loading(false);
          if($scope.user.loggedIn) {
            $http.post('/api/' + $scope.user.username + '/current', {currentTrack: $scope.currentTrack});
          }
        });
      function processJSON(response) {
        sc.trackJSON = response.data;
        sc.html = JSONtoHTML(sc.trackJSON.description);
        sc.tags = processTags(sc.trackJSON.tag_list);
        sc.postDate = new Date(sc.trackJSON.created_at);
        $scope.currentTrack = sc.trackJSON.id;
        if(sc.trackJSON.artwork_url) {
          sc.imgURL = sc.trackJSON.artwork_url.replace('large', 't500x500');
        } else {
          sc.imgURL = '/img/placeholder.png';
        }
        if(sc.trackJSON.purchase_url && !sc.trackJSON.purchase_title) {
          sc.trackJSON.purchase_title = 'Buy';
        }
      }
    };
    $scope.getDescription = function(trackID) {
      var url = 'https://api.soundcloud.com/tracks/' + trackID + '?' + client;
      sc.submit(url);
    };

    $scope.checkRoute = function() {
      var url = $location.url().substring(1);
      if(url.includes('soundcloud.com')) {
        sc.url = url;
        sc.submit();
      } else if (!isNaN(url) && url.toString().length === 9) {
        $scope.currentTrack = url;
        $scope.getDescription(url);
      }
    };
    $scope.checkRoute();
    $scope.$on('$locationChangeStart', $scope.checkRoute);

    sc.toggleJSON = function() {
      sc.showJSON = !sc.showJSON;
    };
    window.setTimeout(function() {
      sc.showAlert = !$scope.user.loggedIn;
    }, 500);
    sc.dismissAlert = function() {
      sc.showAlert = false;
    };
  }]);

  var JSONtoHTML = function(string) {
    if(!string) {
      return [];
    } else {
      var HTML = string.split('\n');
      HTML.forEach(function(item, index, array) {
        if(item == '') {
          array[index] = '<br>';
        } else {
          array[index] = Autolinker.link(item, {mention: 'twitter',
            replaceFn: function(match) {
              if(match.getType() === 'mention') {
                return '<a href="https://soundcloud.com/' + match.getMention() + '" target="_blank">@' + match.getMention() + '</a>';
              }
              return true;
            }
          });
        }
      });
      return HTML;
    }
  };

  var processTags = function(string) {
    var tags = string.split(' ');
    var result = [];
    for(var i = 0; i < tags.length; i++) {
      var text = tags[i];
      if(text.includes('\"')) {
        do {
          text = text + ' ' + tags[i + 1];
          i++;
        } while(!tags[i].includes('\"'));
        text = text.slice(1, -1);
      }
      result.push(text);
    }
    return result;
  };

  var loading = function(input) {
    const loadingBox = document.querySelector('.loading-background');
    if(input) {
      loadingBox.classList.remove('hidden');
    } else {
      loadingBox.classList.add('hidden');
    }
  };
})();
