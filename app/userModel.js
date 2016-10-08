var mongoose = require('mongoose')
var bcrypt = require('bcrypt');

mongoose.connect(process.env.MONGODB_URI, function(err, res) {
  if(err) {
    console.log('ERROR connecting. ' + err);
  } else {
    console.log ('Succeeded, connected');
  }
});

var trackSchema = mongoose.Schema({
  title: {type: String, required: true},
  artist: {type: String, required: true},
  releaseDate: {type: Date, required: false},
  trackID: {type: String, required: true}
});
var track = mongoose.model('track', trackSchema);

var userSchema = mongoose.Schema({
  local: {
    email: {type: String, index: { unique: true, sparse: true }},
    password: {type: String}
  },
  soundcloud: {
    soundcloudID: {type: String, index: { unique: true, sparse: true }},
    accessToken: {type: String},
    refreshToken: {type: String}
  },
  username: {type: String, index: { unique: true }},
  tracks: [trackSchema]
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(12), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

var user = mongoose.model('user', userSchema);

module.exports = {
  user: user,
  track: track
}
