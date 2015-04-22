Mediator Lib
============

### Mediator pattern ###

Very small lib (only 815 bytes minified) which implements a single object that becomes a shared resource through all of the different pieces of an application.

### Installation ###

bower:

$ bower install mediatorjs

Or download the latest release from the repository (<http://github.com/gtournie/mediator>)
and copy `src/mediator.js` to a suitable location. Then include it in your HTML like so:

    <script type="text/javascript" src="/path/to/mediator.js"></script>

### Compatibility ###

Javascript 1.2


### Documentation ###

The code is fairly straightforward, there are basically three methods in the `Mediator`
namespace: `on`, `off` and `trigger`.

##### Examples: #####

```
var foo1 = function(memo) { console.log('foo1: ' + memo.foo); },
    foo2 = function(memo) { console.log('foo2: ' + memo.foo); },
    bar  = function(memo) { console.log('bar: '  + memo.bar); };
    
// Attach events
Mediator.on('foo', foo1, foo2).on('bar', bar);

// Trigger events
Mediator.trigger('foo', { foo: 'FOO' }).trigger('bar', { bar: 'BAR' });
Mediator.trigger('foo bar', { foo: 'FOO', bar: 'BAR' });

// Detach events
Mediator.off('foo', foo1);       // Detach only foo1
Mediator.off('foo', foo1, foo2); // Detach foo1 & foo2
Mediator.off('foo');             // Detach all 'foo' events
Mediator.off();                  // Detach all events
```

For full details, look at the inline documentation before each method body.
