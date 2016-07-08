var mongoose = require('mongoose');
var SC = require('node-soundcloud');

SC.init({
  id: '30cba84d4693746b0a2fbc0649b2e42c',
  secret: '8d2b6ec520fca0e07fd6b57a83d9d428',
  uri: 'http://localhost:8000/auth/'
});

exports.connectionURL = SC.getConnectUrl();

exports.redirectHandler = function(req, res) {
  var code = req.query.code;

  SC.authorize(code, function(err, accessToken) {
    if ( err ) {
      console.log(err);
    } else {
      // Client is now authorized and able to make API calls
      console.log('access token:', accessToken);
      SC.get('/me?oauth_token=' + accessToken, function(err, response) {
        if(err) {
          console.log(err);
        } else {
          console.log(response.permalink);
          req.session.username = response.permalink;
        }
      });
    }
  });
};

exports.testTrack = function(req, res) {
  SC.get('/tracks/265846358', function(err, track) {
    if(err) {
      console.log(err);
    } else {
      res.json(track);
    }
  });
}
