(function() {
  var app = angular.module('new-tracks');
  var scapi = "https://api.soundcloud.com/resolve.json?url=";
  var client = "client_id=30cba84d4693746b0a2fbc0649b2e42c";

  app.controller("descriptionController", ["$http", "$location", "$scope", "$uibModal", function($http, $location, $scope, $uibModal) {
    var sc = this;
    sc.url = $location.url().substring(1);
    sc.showJSON = false;
    sc.html = [];
    $scope.getDescription = function(trackID) {
      var url = "https://api.soundcloud.com/tracks/" + trackID + '?' + client;
      sc.submit(url);
    };
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
      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function (selectedItem) {
        console.log(selectedItem);
        // display "Track Successfully Added"
        $scope.getTracks();
      });
    };
    sc.submit = function(callURL) {
      if(callURL === undefined) {
        callURL = scapi + sc.url + '&' + client;
      }
      $http.get(callURL)
        .then(function success(response) {
          processJSON(response);
          $scope.setPanel(2);
        }, function error(response) {
          if(response.status === 403) {
            sc.trackJSON = {"error": "The information for this track is not available", "code": 403};
          } else if(response.status === 404) {
            sc.trackJSON = {"error": "Invalid URL, please try again", "code": 404};
          } else {
            $http.jsonp(callURL + '&callback=JSON_CALLBACK')
              .then(function success(response) {
                processJSON(response);
                $scope.setPanel(2);
              }, function error(response) {
                sc.trackJSON = {"error": "Something went wrong... This could have been caused by a track for which the information is not available, or a server/network problem. Please try again.", "code": "JSONP Response Code " + response.status};
              });
          }
          console.log(response.status + ' ' + response.statusText);
        });
        function processJSON(response) {
          sc.trackJSON = response.data;
          sc.html = JSONtoHTML(sc.trackJSON.description);
          sc.tags = processTags(sc.trackJSON.tag_list);
          sc.imgURL = sc.trackJSON.artwork_url.replace('large', 't500x500');
          if(sc.trackJSON.purchase_url && !sc.trackJSON.purchase_title) {
            sc.trackJSON.purchase_title = 'Buy';
          }
        }
    };
    if($location.url()) {
      sc.submit();
    }
    sc.toggleJSON = function() {
      sc.showJSON = !sc.showJSON;
    };
  }]);

  var JSONtoHTML = function(string) {
    var HTML = string.split('\n');
    HTML.forEach(function(item, index, array) {
      if(item == '') {
        array[index] = '<br>';
      } else {
        array[index] = Autolinker.link(item);
      }
    });
    return HTML;
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
})();