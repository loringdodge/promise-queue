var test = require('tape');
var PromiseQueue = require('../src/promise-queue');

var before = test;

var promiseQueue;

test('basic arithmetic', function (t) {
    t.plan(2);

    t.equal(2 + 3, 5);
    t.equal(7 * 8 + 9, 65);
});

test('is defined', function (t) {
  var promiseQueue = new PromiseQueue();
  t.ok(promiseQueue);
  t.end();
});

test('only accept functions or arrays of functions', function (t) {
  t.plan(5);

  promiseQueue = new PromiseQueue();

  var rejectedValues = [
    'string',
    0,
    false,
  ];

  for(var i = 0; i < rejectedValues.length; i++){
    t.throws(function() {
      promiseQueue.add(rejectedValues[i])
    });
  }

  var acceptedValues = [
    [ function() {}, function() {} ],
    function() {}
  ];

  for(var i = 0; i < acceptedValues.length; i++){
    t.doesNotThrow(function() {
      promiseQueue.add(acceptedValues[i])
    });
  }
});

test('adds functions to the queue', function (t) {
  promiseQueue = new PromiseQueue();

  promiseQueue.add(function() {});
  promiseQueue.add(function() {});
  promiseQueue.add(function() {});

  var queueLength = promiseQueue._queue.length;
  t.equal(queueLength, 3);

  t.end();
});

test('start dequeing', function (t) {
  promiseQueue = new PromiseQueue();

  var a = function(done) { done() };

  promiseQueue
    .add(a)
    .start();

  setTimeout(function() {
    var queueLength = promiseQueue._queue.length;
    t.equal(queueLength, 0);
    t.end();
  })

});

test('drains all functions', function (t) {
  promiseQueue = new PromiseQueue();

  promiseQueue.add(function() {});
  promiseQueue.add(function() {});
  promiseQueue.drain();

  var queueLength = promiseQueue._queue.length;
  t.equal(queueLength, 0);

  t.end();
});

test('instantly moves a function to the front', function (t) {
  promiseQueue = new PromiseQueue();

  var f = function() {};

  promiseQueue.add(function() {});
  promiseQueue.add(function() {});
  promiseQueue.instant(f);
  promiseQueue.add(function() {});

  var firstQueued = promiseQueue._queue[0];
  t.equal(firstQueued, f);

  t.end();
});

test('pauses the queue', function (t) {
  promiseQueue = new PromiseQueue();

  promiseQueue
    .add(function(done) {
      done();
    })
    .add(function(done) {
      promiseQueue.pause();
      done();
    })
    .add(function(done) {
      done();
    })
    .start();

  setTimeout(function() {
    var queueLength = promiseQueue._queue.length;
    t.equal(queueLength, 1);
    t.end();
  })

});

test('removes specific functions', function (t) {
  t.plan(2);

  promiseQueue = new PromiseQueue();

  var a = function(done) { done() };
  var b = function(done) { done() };
  var c = function(done) { done() };

  promiseQueue
    .add(a)
    .add(b)
    .add(c)
    .remove(b);

  setTimeout(function() {
    t.equal(promiseQueue._queue[0], a);
    t.equal(promiseQueue._queue[1], c);
    t.end();
  })

});

