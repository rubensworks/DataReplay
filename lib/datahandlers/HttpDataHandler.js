/** A simple HTTP based datasource **/

var request = require('request');

function HttpDataHandler(url) {
  if (!(this instanceof HttpDataHandler))
    return new HttpDataHandler(url);

  this._url = url;
}

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