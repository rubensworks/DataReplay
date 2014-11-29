/** A simple HTTP based datasource **/

var request = require('request');

function HttpDataHandler(options) {
  if (!(this instanceof HttpDataHandler))
    return new HttpDataHandler(options);

  this._url = options.url;
}

HttpDataHandler.prototype.getOptions = function() {
  return {
    url: this._url,
  };
};

HttpDataHandler.prototype.fetch = function(callback) {
  request(this._url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      callback(body);
    } else {
      callback();
    }
  });
};

module.exports = HttpDataHandler;