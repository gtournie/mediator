
var Mediator = {
  events: {},
  
  // Observe eventName.
  on: function(eventName, func) {
    var events = this.events;
    if (!(eventName in events))
      events[eventName] = [];
    events[eventName].push(func);
    return this;
  },
  // Stop observing:
  // off(): stop observing all events
  // off(eventName): stop observing all events with this name
  // off(eventName, func): stop observing all events which the couple [eventName, func]
  off: function(eventName, func) {
    var argLen = arguments.length;
    if (0 === argLen) {
      this.events = {};
    } else if (!func) {
      this.events[eventName] = void(0);
    } else {
      var events = this.events[eventName];
      for (var i = events.length - 1; i >= 0; --i)
        if (func === events[i]) events.splice(i, 1);
      if (0 === this.events[eventName].length)
        this.events[eventName] = void(0);
    }
    return this;
  },
  // Call all "eventName" events. Give memo as first argument
  trigger: function(eventName, memo) {
    memo = memo || {};
    var list = this.events[eventName] || [];
    for (var i = 0, len = list.length; i < len; ++i)
      list[i](memo);
    return this;
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Mediator;
}