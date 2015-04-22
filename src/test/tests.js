var bar = [],
    foo1 = function() { bar.push('1'); },
    foo2 = function() { bar.push('2'); },
    foo3 = function() { bar.push('3'); },
    foo4 = function() { bar.push('4'); };

QUnit.module("Cleanup", {
  afterEach: function() {
    Mediator.off();
    bar = [];
  }
});

QUnit.test("Simple event, simple callback", function(assert) {
  Mediator.on('foo1', foo1);
  var objectKeys = Object.keys(Mediator.events);
  assert.ok('foo1' in Mediator.events, "Event name value present");
  assert.equal(objectKeys.length, 1, "Event names length ok");

  Mediator.trigger('foo1');
  assert.equal(bar.length, 1, "Callback called");
  assert.equal(bar[0], '1', "Callback value");
  
  Mediator.off('foo1');
  objectKeys = Object.keys(Mediator.events);
  assert.notOk('foo1' in Mediator.events, "Event name not present");
  assert.equal(objectKeys.length, 0, "Event names length ok");
  
  Mediator.trigger('foo1');
  assert.equal(bar.length, 1, "Callback not called");
  
  Mediator.on('foo1', foo2);
  var objectKeys = Object.keys(Mediator.events);
  assert.ok('foo1' in Mediator.events, "Event name value present");
  assert.equal(objectKeys.length, 1, "Event names length ok");
  
  Mediator.trigger('foo1');
  assert.equal(bar.length, 2, "Callback called");
  assert.equal(bar[1], '2', "Callback value");
  
  Mediator.off();
  objectKeys = Object.keys(Mediator.events);
  assert.notOk('foo1' in Mediator.events, "Event name not present");
  assert.equal(objectKeys.length, 0, "Event names length ok");
  
  Mediator.trigger('foo1');
  assert.equal(bar.length, 2, "Callback not called");
});

QUnit.test("No callback", function(assert) {
  Mediator.on('foo1').on('foo1 foo2 foo3');
  var objectKeys = Object.keys(Mediator.events);
  assert.notOk('foo1' in Mediator.events, "Event name value not present");
  assert.equal(objectKeys.length, 0, "Event names length ok");
});

QUnit.test("Multiple event names", function(assert) {
  Mediator.on('foo1 foo2 foo3', foo1);
  var objectKeys = Object.keys(Mediator.events);
  var presence   = 'foo1' in Mediator.events &&
                   'foo2' in Mediator.events &&
                   'foo3' in Mediator.events;
  assert.ok(presence, "Event names in events");
  assert.equal(objectKeys.length, 3, "Event names length ok");
  
  Mediator.trigger('foo1 foo2 foo3');
  assert.equal(bar.length, 3, "Callback called");
  assert.deepEqual(bar, ['1', '1', '1'], "Callback values");
  
  Mediator.off('foo1 foo2 foo3');
  objectKeys = Object.keys(Mediator.events);
  var presence   = 'foo1' in Mediator.events ||
                   'foo2' in Mediator.events ||
                   'foo3' in Mediator.events;
  assert.notOk(presence, "Event names not in events");
  assert.equal(objectKeys.length, 0, "Event names length ok");
  
  Mediator.trigger('foo1 foo2 foo3').trigger('foo1').trigger('foo2').trigger('foo3');
  assert.equal(bar.length, 3, "Callback not called");
});

QUnit.test("Multiple callbacks", function(assert) {
  Mediator.on('foo1', foo1, foo2, foo3);
  var objectKeys = Object.keys(Mediator.events);
  assert.equal(objectKeys.length, 1, "Event names length ok");
  
  Mediator.trigger('foo1');
  assert.equal(bar.length, 3, "Callback called");
  assert.deepEqual(bar, ['1', '2', '3'], "Callback values");
  
  Mediator.off('foo1', foo1);
  assert.equal(Mediator.events['foo1'].length, 2, "Callbacks length ok");
  
  Mediator.trigger('foo1');
  assert.equal(bar.length, 5, "Callback called");
  assert.deepEqual(bar, ['1', '2', '3', '2', '3'], "Callback values");
  
  Mediator.off('foo1', foo1, foo2, foo3);
  assert.notOk('foo1' in Mediator, "Event names not in events");
  
  Mediator.trigger('foo1');
  assert.equal(bar.length, 5, "Callback not called");
});

QUnit.test("Multiple events & multiple callbacks", function(assert) {
  Mediator.on('foo1 foo2', foo1, foo2);
  var objectKeys = Object.keys(Mediator.events);
  assert.equal(objectKeys.length, 2, "Event names length ok");
  
  Mediator.trigger('foo1');
  assert.equal(bar.length, 2, "Callback called");
  assert.deepEqual(bar, ['1', '2'], "Callback values");
  Mediator.trigger('foo2 foo2');
  assert.equal(bar.length, 6, "Callback called");
  assert.deepEqual(bar, ['1', '2', '1', '2', '1', '2'], "Callback values");
  
  Mediator.off('foo1', foo1);
  assert.equal(Mediator.events['foo1'].length, 1, "Callbacks length ok");
  assert.equal(Mediator.events['foo2'].length, 2, "Callbacks length ok");
  
  Mediator.trigger('foo1');
  assert.equal(bar.length, 7, "Callback called");
  assert.equal(bar[6], '2', "Callback values");
  
  Mediator.trigger('foo2');
  assert.equal(bar.length, 9, "Callback called");
  assert.deepEqual(bar, ['1', '2', '1', '2', '1', '2', '2', '1', '2'], "Callback values");
  
  Mediator.off('foo2', foo1, foo2);
  assert.notOk('foo2' in Mediator, "Event names not in events");
  
  Mediator.trigger('foo2');
  assert.equal(bar.length, 9, "Callback not called");
  
  Mediator.trigger('foo1');
  assert.equal(bar.length, 10, "Callback called");
  assert.equal(bar[9], '2', "Callback values");
});