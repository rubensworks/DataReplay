/* A Recorder can record a datasource for a given time with a specified granularity */

var timeUtils = require('./util/TimeUtils');

function Recorder(duration, granularity) {
  if (!(this instanceof Recorder))
    return new Recorder(duration, granularity);

  this._duration    = duration;
  this._granularity = granularity;
}

/** Record the given datasource to a given target. **/
Recorder.prototype.record = function(datahandler, writer) {
  var current    = timeUtils.getTimeMillis(),
      targetTime = current + this._duration,
      loopTime   = current;

  // Open the writer
  writer.outputOpen({
    start:       current,
    duration:    this._duration,
    granularity: this._granularity,
    datatype:    {
      name:    datahandler.constructor.name,
      options: datahandler.getOptions()
    },
  });

  // Set all required timeouts at once.
  while(loopTime < targetTime) {
    this._newSnapshotTimeout(datahandler, writer, loopTime);
    loopTime += this._granularity;
  }

  // Close the writer
  setTimeout(function() { writer.outputClose(); }, loopTime - timeUtils.getTimeMillis());
};

Recorder.prototype._newSnapshotTimeout = function(datasource, writer, loopTime){
  var self = this;
  setTimeout(function() { self._snapshot(datasource, writer, loopTime); }, loopTime - timeUtils.getTimeMillis());
};

Recorder.prototype._snapshot = function(datasource, writer, time) {
  datasource.fetch(function(data) {
    data && writer.outputWrite(data, time);
    if(!data) console.log("Error fetching data at " + time);
  });
};

module.exports = Recorder;