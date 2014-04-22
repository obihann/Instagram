// Generated by CoffeeScript 1.7.1
(function() {
  var app, express, jp2a, moment, parseForWeb, parseImages, renderHtml, renderImage, request, searchPublic, searchUser, streamToWeb, streamUserToWeb, _;

  _ = require('underscore');

  jp2a = require('jp2a');

  moment = require('moment');

  express = require('express');

  request = require('request');

  app = express();

  renderHtml = function(url, cb) {
    return jp2a([url, "--width=75", "--color", "--fill", "--html-raw"], function(asciiArt) {
      return cb(asciiArt);
    });
  };

  streamToWeb = function() {
    app.get("/", function(req, res) {
      return request.get("http://instagram-cli.herokuapp.com", function(error, response, body) {
        var data;
        if (!error && response.statusCode === 200) {
          data = JSON.parse(body);
          return parseForWeb(data, function(output) {
            return res.send(output);
          });
        }
      });
    });
    app.listen(8888);
    return console.log("Check out http://localhost:8888 to view your feed");
  };

  streamUserToWeb = function() {
    app.get("/", function(req, res) {
      return request.get("http://instagram-cli.herokuapp.com/?name=" + process.argv[3], function(error, response, body) {
        var data;
        if (!error && response.statuscode === 200) {
          data = json.parse(body);
          return parseforweb(data, function(output) {
            return res.send(output);
          });
        }
      });
    });
    app.listen(8888);
    return console.log("Check out http://localhost:8888 to view your feed");
  };

  searchPublic = function() {
    return request.get("http://instagram-cli.herokuapp.com", function(error, response, body) {
      var data;
      data = JSON.parse(body);
      return parseImages(data);
    });
  };

  searchUser = function(user) {
    return request.get("http://instagram-cli.herokuapp.com/?user=" + user, function(error, response, body) {
      var data;
      data = JSON.parse(body);
      return parseImages(data);
    });
  };

  parseForWeb = function(data, cb) {
    var limit, output;
    output = "<div class='ascii' style='font-size: 8px;'>";
    limit = data.length - 1;
    return _.each(data, function(photo, index) {
      var url;
      url = photo.images.standard_resolution.url;
      return renderHtml(url, function(resp) {
        output += "<div style='float: left;'><pre>";
        output += resp;
        output += "</pre></div>";
        if (index === limit) {
          output += "</div>";
          return cb(output);
        }
      });
    });
  };

  parseImages = function(photos) {
    return _.each(photos, function(photo) {
      var author, dateStr, link, url;
      author = photo.user.username;
      url = photo.images.standard_resolution.url;
      dateStr = moment(photo.created_time).fromNow();
      link = photo.link;
      return renderImage(url, author, dateStr, link);
    });
  };

  renderImage = function(url, author, dateStr, link) {
    return jp2a(["--color", "-b", "--fill", url], function(asciiArt) {
      console.log(asciiArt);
      console.log(link);
      console.log("By: " + author);
      return console.log(dateStr);
    });
  };

  switch (process.argv[2]) {
    case "web":
      streamToWeb();
      break;
    case "webUser":
      streamUserToWeb();
      break;
    case "user":
      searchUser(process.argv[3]);
      break;
    default:
      searchPublic();
  }

}).call(this);
