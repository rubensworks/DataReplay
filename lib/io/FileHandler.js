/* A FileWriter can write snapshots to a file-based structure. */

var fs = require('fs');

function FileHandler(basePath) {
  if (!(this instanceof FileHandler))
    return new FileHandler(basePath);

  this._basePath = basePath;
  this._outputOpened = false;
  this._outputClosed = false;
}

FileHandler.prototype.outputOpen = function(config){
  if(this._outputOpened) {
    throw Error("This writer was already opened.");
  }
  if(this._outputClosed) {
    throw Error("This writer was already closed.");
  }
  this._outputOpened = true;

  if(fs.existsSync(this._basePath + "config.json")) {
    throw Error("There is already an older recording at the given location: " + this._basePath);
  }

  // Write the data into a config file.
  fs.writeFile(this._basePath + "config.json", JSON.stringify(config, false, "  "), function(err) {
    if(err) throw err;
  });
  fs.mkdirSync(this._basePath + "data/");
};

FileHandler.prototype.outputWrite = function(data, time){
  if(!this._outputOpened) {
    throw Error("This writer was not yet opened.");
  }
  if(this._outputClosed) {
    throw Error("This writer was already closed.");
  }

  // Write the snapshot.
  fs.writeFile(this._basePath + "data/" + time + ".dat", data, function(err) {
    if(err) throw err;
  });
};

FileHandler.prototype.outputClose = function(){
  if(!this._outputOpened) {
    throw Error("This writer was not yet opened.");
  }
  if(this._outputClosed) {
    throw Error("This writer was already closed.");
  }
  this._outputClosed = true;
};

FileHandler.prototype.inputConfig = function(){
  var file = this._basePath + "config.json";
  if(!fs.existsSync(file)) {
    throw Error("No config file found at the given location: " + this._basePath);
  }
  return JSON.parse(fs.readFileSync(file));
};

FileHandler.prototype.inputSnapshot = function(time){
  var file = this._basePath + "data/" + time + ".dat";
  if(!fs.existsSync(file)) {
    throw Error("No time file found for: " + time);
  }
  return fs.readFileSync(file);
};

module.exports = FileHandler;