const SCAuth = require('./userModel.js').scAuth;
const axios = require('axios');
const FormData = require('form-data');

exports.getSoundCloudToken = async () => {
  try {
    const token = await SCAuth.findOne({}).exec();
    if(token) {
      if(token.expiration > expiration(120)) {
        // the token we have is still valid for more than 2 minutes
        return token;
      } else {
        // need to refresh the token
        const newToken = await refreshSoundCloudToken(token);
        token.accessToken = newToken.access_token;
        token.refreshToken = newToken.refresh_token,
        token.expiration = expiration(newToken.expires_in);
        token.markModified('expiration');
        return token.save();
      }
    } else {
      // need to get a brand new token because there isn't one
      const newToken = await fetchSoundCloudToken();
      const tokenObj = new SCAuth();
      tokenObj.accessToken = newToken.access_token;
      tokenObj.refreshToken = newToken.refresh_token;
      tokenObj.expiration = expiration(newToken.expires_in);
      tokenObj.markModified('expiration');
      tokenObj.save();
    }
  } catch(e) {
    console.error(e);
  }
};

async function refreshSoundCloudToken(token) {
  const form = new FormData();
  form.append('client_id', process.env.SOUNDCLOUD_CLIENT_ID);
  form.append('client_secret', process.env.SOUNDCLOUD_CLIENT_SECRET);
  form.append('refresh_token', token.refreshToken);
  form.append('grant_type', 'refresh_token');

  try {
    const { data } = await axios.post('https://api.soundcloud.com/oauth2/token', form, { headers: form.getHeaders() });
    return data;
  } catch (e) {
    console.error(e);
    return await fetchSoundCloudToken(); // if refreshing fails, try just getting a new token
  }
}

async function fetchSoundCloudToken() {
  const form = new FormData();
  form.append('client_id', process.env.SOUNDCLOUD_CLIENT_ID);
  form.append('client_secret', process.env.SOUNDCLOUD_CLIENT_SECRET);
  form.append('grant_type', 'client_credentials');

  try {
    const { data } = await axios.post('https://api.soundcloud.com/oauth2/token', form, { headers: form.getHeaders() });
    return data;
  } catch (e) {
    console.error(e);
  }
}

function expiration(seconds) {
  return new Date(Date.now() + (seconds * 1000));
}