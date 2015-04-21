var Mediator = {
  events: {},

  // Observe eventName.
  // on(eventName, [func1, func2, ...]) Attach func1, func2... to the eventName
  on: function(eventName) {
    var events = this.events;
    if (!events[eventName])
      events[eventName] = [];
    var list = events[eventName];
    for (var i = 1, len = arguments.length; i < len; ++i)
      list.push(arguments[i]);
    return this;
  },

  // Stop observing:
  // off(): stop observing all events
  // off(eventName): stop observing all events with this name
  // off(eventName, [func1, func2, ...]): stop observing all events which the couples [eventName, func1], [eventName, func2]...
  off: function(eventName) {
    var argLen = arguments.length;
    if (0 === argLen) {
      this.events = {};
    } else if (1 === argLen) {
      this.events[eventName] = void(0);
    } else {
      var list = this.events[eventName] || [], j;
      for (var i = list.length - 1; i >= 0; --i)
        for (j = 1; j < argLen; ++j)
          if (arguments[j] === list[i])
            list.splice(i, 1);
      if (0 === list.length)
        this.events[eventName] = void(0);
    }
    return this;
  },

  // Call all "eventName" events. Give memo as first argument
  trigger: function(eventName, memo) {
    var list = this.events[eventName] || [];
    for (var i = 0, len = list.length; i < len; ++i)
      list[i](memo);
    return this;
  }
};


if (typeof module !== 'undefined' && module.exports) {
  module.exports = Mediator;
}