function TimeUtils() {
  if (!(this instanceof TimeUtils))
    return new TimeUtils();
}

TimeUtils.prototype._globalUnits = {
  'ms' : 1,
  's'  : 1000,
  'm'  : 60 * 1000,
  'h'  : 60 * 60 * 1000,
  'd'  : 24 * 60 * 60 * 1000,
};

/** Normalize a given number + unit to a duration in milliseconds. **/
TimeUtils.prototype.normalizeToMillis = function(duration) {
  var amounts = duration.match(/(\d+)/g),
      units   = duration.match(/([a-z]+)/g);

  if(amounts.length != 1 || units.length != 1) {
    throw Error("The duration '" + duration + "' was incorrectly formatted.");
  }
  if(!this._globalUnits[units[0]]) {
    throw Error("The duration '" + duration + "' has an unknown unit.");
  }

  return this._globalUnits[units[0]] * amounts[0];
};

/** Get the current time in milliseconds. **/
TimeUtils.prototype.getTimeMillis = function() { return new Date().getTime(); };

/** Apply a speed (*number or /number) to a time duration. **/
TimeUtils.prototype.applySpeed = function(duration, playbackSpeed) {
  if(playbackSpeed.charAt(0) == '*') {
    return duration / parseInt(playbackSpeed.substr(1, playbackSpeed.length));
  } else if(playbackSpeed.charAt(0) == '/') {
    return duration * parseInt(playbackSpeed.substr(1, playbackSpeed.length));
  }
  return duration;
};

Object.freeze(TimeUtils);
module.exports = new TimeUtils();