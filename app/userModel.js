var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

mongoose.Promise = global.Promise;

main().catch(err => console.log('ERROR connecting.', err));

async function main() {
  await mongoose.connect(process.env.MONGO);
  console.log('Succeeded, connected');
}

var trackSchema = mongoose.Schema({
  title: {type: String, required: true},
  artist: {type: String, required: true},
  releaseDate: {type: Date, required: false},
  trackID: {type: String, required: true},
  isFavorite: {type: Boolean, default: false}
});
var track = mongoose.model('track', trackSchema);

var userSchema = mongoose.Schema({
  local: {
    email: {type: String, index: { sparse: true }},
    password: {type: String}
  },
  soundcloud: {
    soundcloudID: {type: String, index: { sparse: true }},
    accessToken: {type: String},
    refreshToken: {type: String}
  },
  username: {type: String, index: { unique: true }},
  profileVisibility: {type: String, default: 'private'},
  currentTrack: {type: String},
  tracks: [trackSchema]
});

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(12), null);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

userSchema.methods.invalidUsername = function(username) {
  var reservedUsernames = ['api', 'auth', 'callback.html', 'deauth', 'login', 'newtracks', 'profile', 'register', 'settings', 'soundcloud'];
  var regex = new RegExp(/([^A-Za-z0-9$\-_.+!*\'(),])+/);
  if(reservedUsernames.includes(username) || username.search(regex) !== -1 || username.length === 0) {
    return true;
  } else {
    return false;
  }
};

var user = mongoose.model('user', userSchema);

const soundcloudAuthSchema = mongoose.Schema({
  accessToken: { type: String },
  refreshToken: { type: String },
  expiration: { type: Date }
});
var scAuth = mongoose.model('scAuth', soundcloudAuthSchema);

module.exports = {
  user: user,
  track: track,
  scAuth: scAuth
};
