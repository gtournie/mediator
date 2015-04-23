var bar = [],
    foo1 = function() { bar.push('1'); },
    foo2 = function() { bar.push('2'); },
    foo3 = function() { bar.push('3'); },
    foo4 = function() { bar.push('4'); };
    foo5 = function(memo) { bar.push(memo); },
    foo6 = function(__, memo) { bar.push(memo); }

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
  assert.equal(bar[0], '1', "Event handler value");
  
  Mediator.off('foo1');
  objectKeys = Object.keys(Mediator.events);
  assert.notOk('foo1' in Mediator.events, "Event name not present");
  assert.equal(objectKeys.length, 0, "Event names length ok");
  
  Mediator.trigger('foo1');
  assert.equal(bar.length, 1, "Event handler not called");
  
  Mediator.on('foo1', foo2);
  var objectKeys = Object.keys(Mediator.events);
  assert.ok('foo1' in Mediator.events, "Event name value present");
  assert.equal(objectKeys.length, 1, "Event names length ok");
  
  Mediator.trigger('foo1');
  assert.equal(bar.length, 2, "Event handler called");
  assert.equal(bar[1], '2', "Event handler value");
  
  Mediator.off();
  objectKeys = Object.keys(Mediator.events);
  assert.notOk('foo1' in Mediator.events, "Event name not present");
  assert.equal(objectKeys.length, 0, "Event names length ok");
  
  Mediator.trigger('foo1');
  assert.equal(bar.length, 2, "Event handler not called");
});

QUnit.test("No Event handler", function(assert) {
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
  assert.equal(bar.length, 3, "Event handler called");
  assert.deepEqual(bar, ['1', '1', '1'], "Event handler values");
  
  Mediator.off('foo1 foo2 foo3');
  objectKeys = Object.keys(Mediator.events);
  var presence   = 'foo1' in Mediator.events ||
                   'foo2' in Mediator.events ||
                   'foo3' in Mediator.events;
  assert.notOk(presence, "Event names not in events");
  assert.equal(objectKeys.length, 0, "Event names length ok");
  
  Mediator.trigger('foo1 foo2 foo3').trigger('foo1').trigger('foo2').trigger('foo3');
  assert.equal(bar.length, 3, "Event handler not called");
});

QUnit.test("Multiple Event handlers", function(assert) {
  Mediator.on('foo1', foo1, foo2, foo3);
  var objectKeys = Object.keys(Mediator.events);
  assert.equal(objectKeys.length, 1, "Event names length ok");
  
  Mediator.trigger('foo1');
  assert.equal(bar.length, 3, "Event handler called");
  assert.deepEqual(bar, ['1', '2', '3'], "Event handler values");
  
  Mediator.off('foo1', foo1);
  assert.equal(Mediator.events['foo1'].length, 2, "Event handlers length ok");
  
  Mediator.trigger('foo1');
  assert.equal(bar.length, 5, "Event handler called");
  assert.deepEqual(bar, ['1', '2', '3', '2', '3'], "Event handler values");
  
  Mediator.off('foo1', foo1, foo2, foo3);
  assert.notOk('foo1' in Mediator, "Event names not in events");
  
  Mediator.trigger('foo1');
  assert.equal(bar.length, 5, "Event handler not called");
});

QUnit.test("Multiple events & multiple Event handlers", function(assert) {
  Mediator.on('foo1 foo2', foo1, foo2);
  var objectKeys = Object.keys(Mediator.events);
  assert.equal(objectKeys.length, 2, "Event names length ok");
  
  Mediator.trigger('foo1');
  assert.equal(bar.length, 2, "Event handler called");
  assert.deepEqual(bar, ['1', '2'], "Event handler values");
  Mediator.trigger('foo2 foo2');
  assert.equal(bar.length, 6, "Event handler called");
  assert.deepEqual(bar, ['1', '2', '1', '2', '1', '2'], "Event handler values");
  
  Mediator.off('foo1', foo1);
  assert.equal(Mediator.events['foo1'].length, 1, "Event handlers length ok");
  assert.equal(Mediator.events['foo2'].length, 2, "Event handlers length ok");
  
  Mediator.trigger('foo1');
  assert.equal(bar.length, 7, "Event handler called");
  assert.equal(bar[6], '2', "Event handler values");
  
  Mediator.trigger('foo2');
  assert.equal(bar.length, 9, "Event handler called");
  assert.deepEqual(bar, ['1', '2', '1', '2', '1', '2', '2', '1', '2'], "Event handler values");
  
  Mediator.off('foo2', foo1, foo2);
  assert.notOk('foo2' in Mediator, "Event names not in events");
  
  Mediator.trigger('foo2');
  assert.equal(bar.length, 9, "Event handler not called");
  
  Mediator.trigger('foo1');
  assert.equal(bar.length, 10, "Event handler called");
  assert.equal(bar[9], '2', "Event handler values");
});

QUnit.test("Memo", function(assert) {
  Mediator.on('foo5', foo5).trigger('foo5', { foo: 'FOO' });
  assert.deepEqual(bar[0], { foo: 'FOO' }, "Memo value");
  
  Mediator.memoAsSecondArg = true;
  
  Mediator.trigger('foo5', { foo: 'FOO' });
  assert.equal(bar[1], null, "Memo value");
  Mediator.on('foo6', foo6).trigger('foo6', { foo: 'FOO' });
  assert.deepEqual(bar[2], { foo: 'FOO' }, "Memo value");
  
  Mediator.defaultMemo = 5;
  
  Mediator.trigger('foo6');
  assert.equal(bar[3], 5, "Memo value");
  
  Mediator.defaultMemo = { foo: 'FOO' };
  
  Mediator.trigger('foo6', { bar: 'BAR' });
  assert.deepEqual(bar[4], { foo: 'FOO', bar: 'BAR' }, "Memo value");
  Mediator.trigger('foo6', { bar: 'BAR', foo: null });
  assert.deepEqual(bar[5], { foo: null, bar: 'BAR' }, "Memo value");
  Mediator.trigger('foo6', { bar: 'BAR', foo: void(0) });
  assert.deepEqual(bar[6], { foo: void(0), bar: 'BAR' }, "Memo value");
  
  Mediator.defaultMemo = null;
  Mediator.trigger('foo6');
  assert.ok(bar[7] === null, "Memo value");
  Mediator.defaultMemo = void 0;
  Mediator.trigger('foo6');
  assert.ok(bar[8] === void 0, "Memo value");
});