Mediator Lib
============

### Mediator pattern ###

Very small lib which implements a single object that becomes a shared resource through all of the different pieces of an application.

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

For full details, look at the inline documentation before each method body.
