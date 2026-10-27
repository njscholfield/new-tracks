const SCAuth = require('./userModel.js').scAuth;
const axios = require('axios');

let pendingToken = null;

exports.getSoundCloudToken = () => {
  if(!pendingToken) {
    pendingToken = loadSoundCloudToken().finally(() => { pendingToken = null; });
  }
  return pendingToken;
};

async function loadSoundCloudToken() {
  try {
    let token = await SCAuth.findOne({}).exec();
    let newToken;
    if(token) {
      if(isValid(token)) {
        // the token we have is still valid for more than 2 minutes
        return token;
      }
      // need to refresh the token
      try {
        newToken = await refreshSoundCloudToken(token);
      } catch(e) {
        // refresh tokens are single-use, so another server may have already refreshed it
        const latest = await SCAuth.findById(token._id).exec();
        if(latest && isValid(latest)) {
          return latest;
        }
        console.error('Error refreshing SoundCloud token, requesting a new one:', describeError(e));
        newToken = await fetchSoundCloudToken();
      }
    } else {
      // need to get a brand new token because there isn't one
      newToken = await fetchSoundCloudToken();
      token = new SCAuth();
    }
    token.accessToken = newToken.access_token;
    token.refreshToken = newToken.refresh_token;
    token.expiration = expiration(newToken.expires_in);
    token.markModified('expiration');
    await token.save();
    return token;
  } catch(e) {
    console.error('Error getting SoundCloud token:', describeError(e));
    return null;
  }
}

async function refreshSoundCloudToken(token) {
  const formData = {
    client_id: process.env.SOUNDCLOUD_CLIENT_ID,
    client_secret: process.env.SOUNDCLOUD_CLIENT_SECRET,
    refresh_token: token.refreshToken,
    grant_type: 'refresh_token'
  };

  return await requestToken(formData);
}

async function fetchSoundCloudToken() {
  const formData = {
    grant_type: 'client_credentials'
  };

  const credential = Buffer.from(`${process.env.SOUNDCLOUD_CLIENT_ID}:${process.env.SOUNDCLOUD_CLIENT_SECRET}`).toString('base64');
  return await requestToken(formData, { 'Authorization': `Basic ${credential}` });
}

async function requestToken(formData, headers = {}) {
  const { data } = await axios.post('https://secure.soundcloud.com/oauth/token', formData, {
    headers: { ...headers, 'Content-Type': 'application/x-www-form-urlencoded' },
    timeout: 10000
  });
  if(!data || !data.access_token) {
    throw new Error('SoundCloud token response missing access_token');
  }
  return data;
}

function describeError(e) {
  return e.response ? `${e.response.status} ${JSON.stringify(e.response.data)}` : e.message;
}

function isValid(token) {
  return token.expiration > expiration(120);
}

function expiration(seconds) {
  return new Date(Date.now() + (seconds * 1000));
}
