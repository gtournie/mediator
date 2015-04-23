var Mediator = (function() {
  "use strict";

  var toString       = ({}).toString,
      hasOwnProperty = ({}).hasOwnProperty;

  return {
    events: {},
    defaultMemo: {},
    memoAsSecondArg: false,

    // Observe one or multiple eventNames.
    // eventNames: a list of space-separated event names
    // [func1, func2...]: a list of handlers
    on: function(eventNames) {
      var argLen = arguments.length;
      if (!eventNames || argLen < 2) {
        return this;
      }
      var events = this.events,
          args   = arguments;
      forEachEventName(eventNames, function(eventName) {
        if (!events[eventName]) {
          events[eventName] = [];
        }
        var list = events[eventName], arg;
        for (var i = 1; i < argLen; ++i) {
          arg = args[i];
          if ('function' === typeof arg) {
            list.push(arg);
          }
        }
      });
      return this;
    },

    // Stop observing:
    // off(): stop observing all events
    // off(eventNames): stop observing all events with theses names
    // off(eventNames, [func1, func2, ...]): stop observing all events which the couples [eventName, func1], [eventName, func2]...
    off: function(eventNames) {
      var argLen = arguments.length;
      if (0 === argLen) {
        this.events = {};
        return this;
      }
      var events = this.events,
          args   = arguments;
      if (1 === argLen) {
        forEachEventName(eventNames, function(eventName) {
          delete events[eventName];
        });
      } else {
        forEachEventName(eventNames, function(eventName) {
          var list = events[eventName] || [], j;
          for (var i = 1; i < argLen; ++i) {
            j = list.length;
            while(j--) {
              if (args[i] === list[j]) {
                list.splice(j, 1);
              }
            }
          }
          if (0 === list.length) {
            delete events[eventName];
          }
        });
      }
      return this;
    },

    // Call all "eventName" handlers. Give memo in argument.
    trigger: function(eventNames, memo) {
      if (!eventNames) {
        return this;
      }
      var defaultMemo = this.defaultMemo;
      if (arguments.length < 2) {
        memo = defaultMemo;
      } else {
        if ('[object Object]' === toString.call(memo) &&
            '[object Object]' === toString.call(defaultMemo)) {
          for (var prop in defaultMemo) {
            if (!hasOwnProperty.call(memo, prop)) {
              memo[prop] = defaultMemo[prop];
            }
          }
        }
      }
      var events = this.events,
          memoAsSecondArg = this.memoAsSecondArg;
      forEachEventName(eventNames, function(eventName) {
        var list = events[eventName] || [];
        for (var i = 0, len = list.length; i < len; ++i) {
          if (memoAsSecondArg) {
            list[i](null, memo);
          } else {
            list[i](memo);
          }
        }
      });
      return this;
    }
  };

  function forEachEventName(eventNames, fn) {
    eventNames = ('' + eventNames).split(/\s+/);
    for (var i = 0, eventName, len = eventNames.length; i < len; ++i) {
      eventName = eventNames[i];
      if (eventName) {
        fn(eventName);
      }
    }
  }
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Mediator;
}