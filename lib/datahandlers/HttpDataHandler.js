/** A simple HTTP based datasource **/

var request = require('request');

function HttpDataHandler(config) {
  if (!(this instanceof HttpDataHandler))
    return new HttpDataHandler(config);

  this.config = config;
}

HttpDataHandler.prototype.getOptions = function() {
  return this.config;
};

HttpDataHandler.prototype.fetch = function(callback) {
  var options = {
    url: this.config.url,
    headers: {
      'User-Agent': 'request',
      'Accept':     this.config.accept,
    }
  };
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      callback(body);
    } else {
      callback();
    }
  });
};

module.exports = HttpDataHandler;