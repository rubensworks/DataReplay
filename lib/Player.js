/* A Recorder can record a datasource for a given time with a specified granularity */

var timeUtils = require('./util/TimeUtils');

function Player(reader) {
  if (!(this instanceof Player))
    return new Player(reader);

  this._reader = reader;
  this._config = reader.inputConfig();
}

/** Replay the given datasource to a given monitor. **/
Player.prototype.play = function(monitor, playbackSpeed) {
  var current    = this._config.start,
      timeDiff   = timeUtils.getTimeMillis() - this._config.start,
      targetTime = current + this._config.duration,
      loopTime   = current;

  // Open the writer
  monitor.open();

  // Set all required timeouts at once.
  while(loopTime < targetTime) {
    this._presentSnapshotTimeout(monitor, loopTime, timeDiff, playbackSpeed);
    loopTime += this._config.granularity;
  }

  // Close the writer
  setTimeout(function() { monitor.close(); },
    timeUtils.applySpeed(loopTime - timeUtils.getTimeMillis() + timeDiff, playbackSpeed));
};

Player.prototype._presentSnapshotTimeout = function(monitor, loopTime, timeDiff, playbackSpeed){
  var self = this;
  setTimeout(function() { self._presentSnapshot(monitor, loopTime); },
    timeUtils.applySpeed(loopTime - timeUtils.getTimeMillis() + timeDiff, playbackSpeed));
};

Player.prototype._presentSnapshot = function(monitor, loopTime) {
  var data = this._reader.inputSnapshot(loopTime);
  monitor.write(data);
};

module.exports = Player;