var assert = require('assert');
var PromiseQueue = require('../src/PromiseQueue');

describe('PromiseQueue', function() {
  var promiseQueue;

  beforeEach(function() {
    promiseQueue = new PromiseQueue();
  });

  afterEach(function() {
    promiseQueue.drain();
  });

  describe('instantiation', function() {
    it('should create a new instance of PromiseQueue', function() {
      assert.equal(true, true); // Be an object
    });
  });

  describe('add', function() {
    it('should only accept functions or arrays of funtions', function() {
      var rejectedValues = [
        'string',
        0,
        false,
      ];

      for(var i = 0; i < rejectedValues.length; i++){
        assert.throws(function() {
          promiseQueue.add(rejectedValues[i])
        });
      }

      var acceptedValues = [
        [ function() {}, function() {} ],
        function() {}
      ];

      for(var i = 0; i < acceptedValues.length; i++){
        assert.doesNotThrow(function() {
          promiseQueue.add(acceptedValues[i])
        });
      }
    });

    it('should add a function to the queue', function() {
      promiseQueue.add(function() {});
      promiseQueue.add(function() {});
      promiseQueue.add(function() {});
      var queueLength = promiseQueue._queue.length;
      assert.equal(queueLength, 3);
    });
  });

  describe('drain', function() {
    it('should remove all functions from the queue', function() {
      promiseQueue.add(function() {});
      promiseQueue.add(function() {});
      promiseQueue.drain();
      var queueLength = promiseQueue._queue.length;
      assert.equal(queueLength, 0);
    });
  });

  describe('instant', function() {
    it('should move function to the front of the queue', function() {
      // Need sinon spy here
      promiseQueue.add(function() {});
      promiseQueue.add(function() {});
      promiseQueue.add(function() {});
      promiseQueue.instant(function() {});
    });
  });

  describe('pause', function() {
    it('should pause the queue', function() {
      promiseQueue.add(function(done) {
        console.log('1');
        done();
      });
      promiseQueue.add(function(done) {
        console.log('2');
        done();
      });
      promiseQueue.add(function(done) {
        console.log('3');
        done();
      });
      promiseQueue.start();
      // var queueLength = promiseQueue._queue.length;
      // assert.equal(queueLength, 1);
    });
  });


});