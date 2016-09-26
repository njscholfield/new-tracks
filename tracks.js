/*TODO
  need to check all and rewrite to reference username instead of permalink
  user will be stored in req.user so searching may not be necessary anymore
  createNewUser will definitely need to be changed
*/

exports.getTracks = function(req, res) {
  if(req.params.username === req.get('username')) {
    getTracksFromDatabase(req, res, req.params.username);
  } else {
    res.sendStatus(403);
  }
};

var getTracksFromDatabase = function (req, res, username) {
  user.findOne({permalink: username}, function(err, result) {
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
  if(req.params.username === data.permalink) {
    editTrackInDatabase(req, res, data);
  } else {
    res.sendStatus(403);
  }
};

var editTrackInDatabase = function(req, res, data) {
  var newTrack = new track({
    title: data.title,
    artist: data.artist,
    releaseDate: data.releaseDate,
    trackID: data.trackID
  });
  user.findOneAndUpdate({permalink: data.permalink, 'tracks.trackID': data.trackID}, {$set: {'tracks.$': newTrack}}, {new: true}, function(err, result) {
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
  if(req.params.username === data.permalink) {
    removeTrackFromDatabase(req, res, data);
  } else {
    res.sendStatus(403);
  }
};

var removeTrackFromDatabase = function (req, res, data) {
  user.findOneAndUpdate({permalink: data.permalink}, {$pull: {tracks: {trackID: data.trackID} } }, {new: true}, function(err, result) {
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
  if(req.params.username === data.me.permalink) {
    addTrackToDatabase(req, res, data, req.params.username);
  } else {
    res.sendStatus(403);
  }
};

var addTrackToDatabase = function(req, res, data, username) {
  user.findOne({permalink: username}, function(err, result) {
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
      if(result) {
        addTrackToExistingUser(req, res, result, newTrack);
      } else {
        createNewUser(req, res, data, newTrack);
      }
    }
  });
};

var addTrackToExistingUser = function(req, res, result, newTrack) {
  user.findOneAndUpdate({_id: result._id}, {$push: {tracks: newTrack}}, {new: true}, function(err, result) {
    if(err) {
      console.log("Error $push new track: " + err);
      res.status(400).json({error: err});
    } else {
      res.status(200).json(result.tracks);
    }
  });
};

var createNewUser = function(req, res, data, newTrack) {
  var newUser = new user({
    fullName: data.me.full_name,
    username: data.me.username,
    permalink: data.me.permalink,
    userID: data.me.user_id,
    tracks: [newTrack]
  });
  newUser.save(function(err) {
    if(err) {
      console.log('Error saving newUser document: ' + err);
      res.status(400).json({error: err});
    } else {
      res.sendStatus(200);
    }
  });
};
