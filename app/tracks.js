var models = require('./userModel.js');
var user = models.user;
var track = models.track;

var ObjectId = require('mongoose').Types.ObjectId; 

exports.getTracks = async function(req, res) {
  try {
    const result = await user.findOne({ username: req.user.username }, 'tracks');
    res.status(200).json(result);
  } catch(err) {
    console.log('Error searching database: ' + err);
    res.status(500).json({ type: 'error', message: err });
  }
};

exports.editTrackInList = async function(req, res) {
  var [data, username] = [req.body, req.user.username];
  var newTrack = new track({
    title: data.title,
    artist: data.artist,
    releaseDate: data.releaseDate,
    trackID: data.trackID,
    isFavorite: data.isFavorite
  });

  try {
    const result = await user.findOneAndUpdate({username: username, 'tracks.trackID': data.trackID}, {$set: {'tracks.$': newTrack}}, {new: true});
    res.status(200).json(result.tracks);
  } catch(err) {
    console.log('Error updating track: ' + err);
    res.status(400).json({ type: 'error', message: err });
  }
};

exports.removeTrackFromList = async function(req, res) {
  var [data, username] = [req.body, req.user.username];

  try {
    const result = await user.findOneAndUpdate({username: username}, {$pull: {tracks: {trackID: data.trackID} } }, {new: true});
    res.status(200).json(result.tracks);
  } catch(err) {
    console.log('Error removing track: ' + err);
    res.status(400).json({ type: 'error', message: err });
  }
};

exports.addTrackToList = async function(req, res) {
  var [data, username] = [req.body, req.user.username];

  try {
    const result = await user.findOne({username: username});

    var newTrack = new track({
      title: data.title,
      artist: data.artist,
      releaseDate: data.releaseDate,
      trackID: data.trackID,
      isFavorite: data.isFavorite
    });
    addTrackToExistingUser(req, res, result, newTrack);
  } catch (err) {
    console.log('Error searching database: ' + err);
    res.status(400).json({ type: 'error', message: err });
  }
};

var addTrackToExistingUser = async function(req, res, result, newTrack) {
  try {
    const userObj = await user.findOneAndUpdate({_id: result._id}, {$push: {tracks: newTrack}}, {new: true});
    res.status(200).json(userObj.tracks);
  } catch(err) {
    console.log('Error $push new track: ' + err);
    res.status(400).json({ type: 'error', message: err });
  }
};

exports.getCurrentTrack = async function(username) {
  try {
    const result = await user.findOne({ username: username }, 'currentTrack');
    return { currentTrack: result.currentTrack };
  } catch (err) {
    throw Error({ type: 'error', message: err });
  }
};

exports.updateCurrentTrack = async function(req, res) {
  var [data, username] = [req.body, req.user.username];
  if(data.currentTrack) {
    try {
      await user.findOneAndUpdate({username: username}, {currentTrack: data.currentTrack});
      res.status(200).json({ success: true });
    } catch(err) {
      console.log('Error updating current track', err);
      res.status(500).json({ type: 'error', message: err });
    }
  } else {
    res.sendStatus(403);
  }
};

exports.showUserProfile = async function(req, res) {
  var username = req.params.username;

  try {
    const result = await permissionToViewProfile(req, res, username);
    res.render('publicProfile', {user: req.user, username: username, tracks: result});
  } catch(err) {
    if (err.message === 'private') {
      res.render('error', { user: req.user, image: 'fence', message: { _1: 'Oops... Looks like you aren\'t allowed here.', _2: 'This profile is private' }, position: '35%', credit: 'https://unsplash.com/photos/9PPvnEd92xE' });
    } else {
      res.render('error', { user: req.user, image: 'astronaut', message: { _1: 'Looks like you\'re lost...', _2: 'Page could not be found' }, position: '50% 40%', credit: 'https://unsplash.com/photos/Yj1M5riCKk4' });
    }
  }
};

var permissionToViewProfile = async function(req, res, username) {
  if(req.user && username === req.user.username) {
    return req.user.tracks;
  } else {
    const result = await user.findOne({username: username});

    if (result) {
      if (result.profileVisibility === 'public') {
        return (result.tracks);
      } else {
        throw Error('private');
      }
    } else {
      throw Error('404');
    }
  }
};
