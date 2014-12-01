/** An HttpMonitor can accept commands from a Player to change it's contents and serve it via HTTP. **/

var http = require('http');

function HttpMonitor(config) {
  if (!(this instanceof HttpMonitor))
    return new HttpMonitor(config);

  this.config       = config;
  this._address     = config.address     || "127.0.0.1";
  this._port        = config.port        || 80;
  this._contentType = config.contentType || 'text/plain';
  this._content     = "";
}

HttpMonitor.prototype.open = function() {
  var self = this;
  this._server = http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': self._contentType});
    res.end(self._content);
  });
  this._server.listen(this._port, this._address);
};

HttpMonitor.prototype.write = function(data) {
  console.log("Mounting new data into monitor.");
  if(!this._server) {
    throw Error('The server is not running.');
  }
  this._content = data;
};

HttpMonitor.prototype.close = function() {
  console.log("Closing monitor.");
  if(!this._server) {
    throw Error('The server was not running.');
  }
  this._server.close();
};

module.exports = HttpMonitor;