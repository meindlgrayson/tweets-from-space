'use strict';

require('dotenv').config();
const express = require('express');
const app = express();
const Twitter = require('twitter');
const PORT = process.env.PORT || 3000;

app.use(express.static('./public'));

app.get('/', function (request, response) {
  response.sendFile('/public/index.html', { root: '.' });
});

app.get('/map/:query',function(request, response) {
  console.log('QUERY', request.params.query);
  var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  });

  if(request.params.query.charAt(0) === '@') {
    var params = { screen_name: request.params.query};
    client.get('statuses/user_timeline', params, function (error, tweets) {
      if (!error) {
        response.send(tweets);
      } else {
        response.send(error);
      }
    });

  } else if(request.params.query.charAt(0) === '%') {
    var params = { q:request.params.query};
    client.get('search/tweets', params, function(error, tweets) {
      if (!error) {
        response.send(tweets.statuses);
      } else {
        console.log('error');
        response.send(error);
      }
    });
  } else {
    var params = { q:request.params.query};
    client.get('search/tweets', params, function(error, tweets) {
      if (!error) {
        response.send(tweets.statuses);
      } else {
        response.send(error);
      }
    });
  }
});

app.listen(PORT, function () {
  console.log(`Server up on ${PORT}`);
});

