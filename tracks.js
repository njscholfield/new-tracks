var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/new-tracks', function(err, res) {
  if(err) {
    console.log('ERROR connecting. ' + err);
  } else {
    console.log ('Succeeded, connected');
  }
});

var trackSchema = new mongoose.Schema({
  title: {type: String, required: true},
  artist: {type: String, required: true},
  releaseDate: {type: Date, required: false},
  trackID: {type: String, required: true}
});
var track = mongoose.model('track', trackSchema);

var userSchema = new mongoose.Schema({
  fullName: {type: String, required: true},
  username: {type: String, required: true},
  permalink: {type: String, required: true},
  userID: {type: String, required: true},
  tracks: [trackSchema]
});
var user = mongoose.model('user', userSchema);

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
      res.status(400).json({error: err});
    } else {
      res.status(200).json(result);
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
      if(result) {
        addTrackToExistingUser(req, res, result, newTrack);
      } else {
        createNewUser(req, res, data, newTrack);
      }
    }
  });
};

var addTrackToExistingUser = function(req, res, result, newTrack) {
  user.findOneAndUpdate({_id: result[0]._id}, {$push: {tracks: newTrack}}, function(err) {
    if(err) {
      console.log("Error $push new track: " + err);
      res.status(400).json({error: err});
    } else {
      res.sendStatus(200);
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
