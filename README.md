Mediator Lib
============

### Mediator pattern ###

Very small lib (only 1kB minified) which implements a single object that becomes a shared resource through all of the different pieces of an application.

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
    bar  = function(memo) { console.log('bar: '  + memo.bar); },
    dm   = function(memo) { console.log('dm: '   + memo);     },
    masa = function(e, memo) { console.log('masa: ' + memo);  };
    
// Attach events
Mediator.on('foo', foo1, foo2).on('bar', bar).on('dm', dm).on('masa', masa);

// Trigger events
Mediator.trigger('foo', { foo: 'FOO' }).trigger('bar', { bar: 'BAR' });
Mediator.trigger('foo bar', { foo: 'FOO', bar: 'BAR' });

// Memo options
Mediator.defaultMemo = 5;    // Default value for memo if **not given** in param. Default: {}
Mediator.trigger('dm');      // => 'dm: 5'
Mediator.trigger('dm', 6);   // => 'dm: 6'

Mediator.defaultMemo = { bar: 'BBAARR' };    // Will be merged to memo if they both are objects
Mediator.trigger('foo bar', { foo: 'FOO' }); // => 'foo1: FOO' => 'foo2: FOO' => 'bar: BBAARR'

Mediator.memoAsSecondArg = true;        // If you're used to get memo in second arg (like with jQuery). Default: false.
Mediator.trigger('masa', 'second arg'); // => 'masa: second arg'

// Detach events
Mediator.off('foo', foo1);       // Detach only foo1
Mediator.off('foo', foo1, foo2); // Detach foo1 & foo2
Mediator.off('foo');             // Detach all 'foo' handlers
Mediator.off('foo bar');         // Detach all 'foo' & 'bar' handlers
Mediator.off();                  // Detach all events
```

If you have a global `App` object, you can easily extend it with `Mediator`.
```
for (var prop in Mediator) {
  App[prop] = Mediator[prop];
}

...

App.on('user:update', function(user) {
  alert(user.name + ' has been updated');
});

...

$.ajax({
  url: '/update-user/2',
  success: function(user) {
    App.trigger('user:update', user);
  }
}):
```

For full details, look at the inline documentation before each method body.
