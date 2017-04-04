const assert = require('assert');
const JSPromise = require('../../build/node/promise.js');
//const JSPromise = Promise;

function test(impl){

    const JSPromise = impl.impl;

    describe(impl.name, function(){

	describe('#JSPromise.resolve', function(){
	    it('should return a promise that resolve to value \'resolved\'', function(done){
		let promise = JSPromise.resolve('resolved');
		promise.then((value) => {
		    assert.equal(value, 'resolved');
		    done();
		});
	    });
	});

	describe('#JSPromise.reject', function(){
	    it('should return a promise that reject with reason \'reason\' and invoke catch()\'s onRejected callback', function(done){
		let promise = JSPromise.reject('reason');
		promise.catch((reason) => {
		    assert.equal(reason, 'reason');
		    done();
		});
	    });

	    it('should return a promise that reject with reason \'reason\' and invoke then()\'s onRejected callback', function(done){
		let promise = JSPromise.reject('reason');
		promise.then(undefined, (reason) => {
		    assert.equal(reason, 'reason');
		    done();
		});
	    });
	});

	describe('#catch', function(){
	    it('[async]catch first should invoke the catch()\'s onRejected callback', function(done){
		this.timeout(3500);
		let promise = new JSPromise((resolve, reject) => {
		    setTimeout(() => {
			reject('reject the promise');
		    }, 2000);
		});
		promise.catch((reason) => {
		    assert.equal(reason, 'reject the promise');
		    done();
		});
	    });

	    it('[async]catch first should invoke the catch()\'s onRejected callback and the following then()\'s onFulfilled callback', function(done){
		this.timeout(3500);
		let promise = new JSPromise((resolve, reject) => {
		    setTimeout(() => {
			reject('reject the promise');
		    }, 2000);
		});
		promise.catch((reason) => {
		    assert.equal(reason, 'reject the promise');
		    return 'in onRejected()';
		}).then(function(value){
		    assert.equal(value, 'in onRejected()');
		    done();
		});
	    });

	    it('[async]catch first should invoke the catch()\'s onRejected callback and the following then()\'s onFulfilled callback', function(done){
		this.timeout(3500);
		let promise = new JSPromise((resolve, reject) => {
		    setTimeout(() => {
			reject('reject the promise');
		    }, 2000);
		});
		promise.catch((reason) => {
		    assert.equal(reason, 'reject the promise');
		    return JSPromise.resolve('in onRejected()');
		}).then(function(value){
		    assert.equal(value, 'in onRejected()');
		    done();
		});
	    });

	    it('[async]catch first should invoke the catch()\'s onRejected callback and the following then()\'s onFulfilled callback', function(done){
		this.timeout(3500);
		let promise = new JSPromise((resolve, reject) => {
		    setTimeout(() => {
			reject('reject the promise');
		    }, 2000);
		});
		promise.catch((reason) => {
		    assert.equal(reason, 'reject the promise');
		    return new JSPromise((resolve, reject) => {
			setTimeout(() => {
			    resolve('in onRejected()');
			}, 200);
		    });
		}).then(function(value){
		    assert.equal(value, 'in onRejected()');
		    done();
		});
	    });

	    it('[async]should reject the promise and invoke the then()\'s onRejected callback', function(done){
		this.timeout(3500);
		let promise = new JSPromise((resolve, reject) => {
		    setTimeout(() => {
			reject('reject the promise');
		    }, 2000);
		});
		promise.then((value) => {
		    done(new Error('The promise should be rejected!'));
		}, (reason) => {
		    assert.equal(reason, 'reject the promise');
		    return 'in onRejected()';
		}).then((value) => {
		    assert.equal(value, 'in onRejected()');
		    done();
		});
		
	    });

	    it('[async]should reject the promise and invoke the then()\'s onRejected callback', function(done){
		this.timeout(3500);
		let promise = new JSPromise((resolve, reject) => {
		    setTimeout(() => {
			reject('reject the promise');
		    }, 2000);
		});
		promise.then((value) => {
		    done(new Error('The promise should be rejected!'));
		}, (reason) => {
		    assert.equal(reason, 'reject the promise');
		    return 'in onRejected()';
		}).then((value) => {
		    assert.equal(value, 'in onRejected()');
		    done();
		});
		
	    });

	    it('[async]should reject the promise and invoke the catch()\'s onRejected callback', function(done){
		this.timeout(3500);
		let promise = new JSPromise((resolve, reject) => {
		    setTimeout(() => {
			reject('reject the promise');
		    }, 2000);
		});
		promise.then((value) => {
		    done(new Error('The promise should be rejected!'));
		}).catch((reason) => {
		    assert.equal(reason, 'reject the promise');
		    return 'in onRejected';
		}).then((value) => {
		    assert.equal(value, 'in onRejected');
		    done();
		});
	    });

	    it('[sync]catch first should invoke the catch()\'s onRejected callback', function(done){
		let promise = new JSPromise((resolve, reject) => {
		    reject('reject the promise');
		});
		promise.catch((reason) => {
		    assert.equal(reason, 'reject the promise');
		    done();
		});
	    });

	    it('[sync]should reject the promise and invoke the then()\'s onRejected callback', function(done){
		this.timeout(3500);
		let promise = new JSPromise((resolve, reject) => {
		    reject('reject the promise');
		});
		promise.then((value) => {
		    done(new Error('The promise should be rejected!'));
		}, (reason) => {
		    assert.equal(reason, 'reject the promise');
		    done();
		});
		
	    });

	    it('[sync]should reject the promise and invoke the catch()\'s onRejected callback', function(done){
		this.timeout(3500);
		let promise = new JSPromise((resolve, reject) => {
		    reject('reject the promise');
		});
		promise.then((value) => {
		    done(new Error('The promise should be rejected!'));
		}).catch((reason) => {
		    assert.equal(reason, 'reject the promise');
		    done();
		});
	    });

	});

	describe('#then', function(){
	    it('[async]should resolve the promise to string value \'hello world\'', function(done){
		this.timeout(3500);
		let promise = new JSPromise((resolve, reject) => {
		    setTimeout(() => {
			resolve('hello world');
		    }, 2000);
		});
		promise.then((value) => {
		    assert.equal(value, 'hello world');
		    done();
		});
	    });

	    it('[sync]should resolve the promise to string value \'hello world\'', function(done){
		this.timeout(3500);
		let promise = new JSPromise((resolve, reject) => {
		    resolve('hello world');
		});
		promise.then((value) => {
		    assert.equal(value, 'hello world');
		    done();
		});
	    });

	    it('[value chain]should resolve the promise to string value \'hello\' and then \'world\'', function(done){
		this.timeout(3500);
		let promise = new JSPromise((resolve, reject) => {
		    resolve('hello');
		});
		promise.then((value) => {
		    assert.equal(value, 'hello');
		    return 'world';
		}).then((value) => {
		    assert.equal(value, 'world');
		    done();
		});
	    });

	    it('[promise chain]should resolve the promise to string value \'hello\' and then \'world\'', function(done){
		this.timeout(3500);
		let promise = new JSPromise((resolve, reject) => {
		    resolve('hello');
		});
		
		promise.then((value) => {
		    assert.equal(value, 'hello');
		    return new JSPromise((resolve, reject) => {
			resolve('world');
		    });
		}).then((value) => {
		    assert.equal(value, 'world');
		    done();
		});
	    });

	    it('[undefined chain]should resolve the promise to string value \'hello\' and then undefined', function(done){
		this.timeout(3500);
		let promise = new JSPromise((resolve, reject) => {
		    resolve('hello');
		});

		promise.then((value) => {
		    assert.equal(value, 'hello');
		}).then((value) => {
		    assert.equal(value, undefined);
		    done();
		});
	    });
	});

    });
}

const impls = [{
    'name': 'Build-in Implementation',
    'impl': Promise
}, {
    'name': 'Self Implementation',
    'impl': JSPromise
}];

impls.forEach((impl) => {
    test(impl);
});
