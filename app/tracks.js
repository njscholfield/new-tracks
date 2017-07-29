var models = require('./userModel.js');
var user = models.user;
var track = models.track;

exports.getTracks = function(req, res) {
  if(req.isAuthenticated() && req.user.username === req.params.username) {
    getTracksFromDatabase(req, res, req.user.username);
  } else {
    res.sendStatus(403);
  }
};

var getTracksFromDatabase = function (req, res, username) {
  user.findOne({username: username}, 'tracks' , function(err, result) {
    if(err) {
      console.log('Error searching database: ' + err);
      res.status(500).json({error: err});
    } else {
      res.status(200).json(result);
    }
  });
};

exports.editTrackInList = function(req, res) {
  var data = req.body;
  if(req.isAuthenticated() && req.user.username === req.params.username) {
    editTrackInDatabase(req, res, data, req.user.username);
  } else {
    res.sendStatus(403);
  }
};

var editTrackInDatabase = function(req, res, data, username) {
  var newTrack = new track({
    title: data.title,
    artist: data.artist,
    releaseDate: data.releaseDate,
    trackID: data.trackID,
    isFavorite: data.isFavorite
  });
  user.findOneAndUpdate({username: username, 'tracks.trackID': data.trackID}, {$set: {'tracks.$': newTrack}}, {new: true}, function(err, result) {
    if(err) {
      console.log('Error updating track: ' + err);
      res.status(400).json({error: err});
    } else {
      res.status(200).json(result.tracks);
    }
  });
};

exports.removeTrackFromList = function(req, res) {
  var data = req.body;
  if(req.isAuthenticated() && req.user.username === req.params.username) {
    removeTrackFromDatabase(req, res, data, req.user.username);
  } else {
    res.sendStatus(403);
  }
};

var removeTrackFromDatabase = function (req, res, data, username) {
  user.findOneAndUpdate({username: username}, {$pull: {tracks: {trackID: data.trackID} } }, {new: true}, function(err, result) {
    if(err) {
      console.log('Error removing track: ' + err);
      res.status(400).json({error: err});
    } else {
      res.status(200).json(result.tracks);
    }
  });
};

exports.addTrackToList = function(req, res) {
  var data = req.body;
  if(req.isAuthenticated() && req.user.username === req.params.username) {
    addTrackToDatabase(req, res, data, req.user.username);
  } else {
    res.sendStatus(403);
  }
};

var addTrackToDatabase = function(req, res, data, username) {
  user.findOne({username: username}, function(err, result) {
    if(err) {
      console.log('Error searching database: ' + err);
      res.status(400).json({error: err});
    } else {
      var newTrack = new track({
        title: data.title,
        artist: data.artist,
        releaseDate: data.releaseDate,
        trackID: data.trackID
      });
      addTrackToExistingUser(req, res, result, newTrack);
    }
  });
};

var addTrackToExistingUser = function(req, res, result, newTrack) {
  user.findOneAndUpdate({_id: result._id}, {$push: {tracks: newTrack}}, {new: true}, function(err, result) {
    if(err) {
      console.log('Error $push new track: ' + err);
      res.status(400).json({error: err});
    } else {
      res.status(200).json(result.tracks);
    }
  });
};

exports.getCurrentTrack = function(username) {
  return new Promise(function(resolve, reject) {
    user.findOne({username: username}, 'currentTrack', function(err, result) {
      if(err) {
        return reject({error: err});
      }
      return resolve({currentTrack: result.currentTrack});
    });
  });
};

exports.updateCurrentTrack = function(req, res) {
  if(req.isAuthenticated() && req.user.username === req.params.username) {
    var data = req.body;
    user.findOneAndUpdate({username: req.user.username}, {currentTrack: data.currentTrack}, function(err) {
      if(err) {
        console.log('Error updating current track', err);
        res.status(500).json({error: err});
      } else {
        res.status(200).json({success: true});
      }
    });
  } else {
    res.sendStatus(403);
  }
};

exports.showUserProfile = function(req, res) {
  var username = req.params.username;

  permissionToViewProfile(req, res, username).then(function success(result) {
    res.render('publicProfile', {user: req.user, username: username, tracks: result});
  }, function failure(err) {
    if(err === 'private') {
      res.render('error', {user: req.user, image: 'fence', message: {_1: 'Oops... Looks like you aren\'t allowed here.', _2: 'This profile is private' }, position: '35%', credit: 'https://unsplash.com/photos/9PPvnEd92xE'});
    } else {
      res.render('error', {user: req.user, image: 'astronaut', message: {_1: 'Looks like you\'re lost...', _2: 'Page could not be found' }, position: '50% 40%', credit: 'https://unsplash.com/photos/Yj1M5riCKk4'});
    }
  });
};

var permissionToViewProfile = function(req, res, username) {
  return new Promise(function(resolve, reject) {
    if(req.user && username === req.user.username) {
      resolve(req.user.tracks);
    } else {
      user.findOne({username: username}, function(err, result) {
        if(err) {
          console.log(err);
          reject(err);
        } else {
          if(result) {
            if(result.profileVisibility === 'public') {
              resolve(result.tracks);
            } else {
              reject('private');
            }
          } else {
            reject('404');
          }
        }
      });
    }
  });
};
