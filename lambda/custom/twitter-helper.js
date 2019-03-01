const Twit = require('twit');

// Lambda environment variables
const {
  CONSUMER_KEY,
  CONSUMER_SECRET,
  CLIENT_TOKEN,
  CLIENT_SECRET,
} = process.env;

// Class design pattern
function TwitterHelper(accessToken) {
  this.accessToken = accessToken.split('-');

  // IMPORTANT: at this time alexa changed to oauth2
  // so it uses a unique bearer token so it doesnt match the twitter oauth 1 token and secret
  // this breaks the way you can use accesToken from user until twitter updates oauth

  this.twitClient = new Twit({
    consumer_key: CONSUMER_KEY,
    consumer_secret: CONSUMER_SECRET,
    access_token: CLIENT_TOKEN,
    access_token_secret: CLIENT_SECRET,
  });
}

TwitterHelper.prototype.postTweet = function postTweet(message) {
  return this.twitClient
    .post('statuses/update', { status: message })
    .catch((err) => { console.log('caught error', err.stack); });
};

module.exports = TwitterHelper;
