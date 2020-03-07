var https = require('https');
var express = require('express');
var util = require('util');
var fs = require('fs');
var router = express.Router();

var clientInfo = JSON.parse(fs.readFileSync('config.json'));

var strava = {
  clientId      : clientInfo.client_id,
  clientSecret  : clientInfo.client_secret,
  code          : undefined,
  scope         : undefined,
  refreshToken  : undefined,
  accessToken   : undefined,
  athleteInfo   : undefined
};

router.get('/', function(req, res, next) {
  res.render('index', { 
    title   : 'RiderStats',
    strava  : strava
  });
});

router.get('/exchange_token', function(req, res, next) {
  strava.code = req.query.code;
  strava.scope = req.query.scope;
  var httpReq = https.request({
    hostname  : 'www.strava.com',
    port      : 443,
    path      : '/oauth/token',
    method    : 'POST'
  }, httpRes => {
    var data = '';
    httpRes.on('data', d => {
      data = data + d;
    });
    httpRes.on('close', function() {
      var auth = JSON.parse(data);
      strava.refreshToken = auth.refresh_token;
      strava.accessToken = auth.access_token;
      strava.athleteInfo = auth.athleteInfo;
      console.log(auth);
      fs.writeFile(util.format('%s.json', strava.athleteInfo.id), JSON.stringify(strava), function(err) {
        if(err) console.log(err);
      });
      res.cookie('access_token', strava.accessToken, { maxAge: 900000, httpOnly: true });
      res.redirect('/');
    });
  });
  httpReq.on('error', err => {
    console.log(err);
  });
  httpReq.write(util.format('client_id=%d&client_secret=%s&code=%s&grant_type=authorization_code', strava.clientId, strava.clientSecret, strava.code));
  httpReq.end();
});

module.exports = router;
