"use strict";

const STATUS_PENDING = 'pending',
      STATUS_FULFILLED = 'fulfilled',
      STATUS_REJECTED = 'rejected';

const POLL_INTERVAL = 200;

function JSPromise(executor){

    if(!executor || typeof executor != 'function'){
	throw "No executor specified for this promise!";
    }

    var _this = this;

    this.promiseStatus = STATUS_PENDING;
    this.resolved = false;
    this.promiseValue = undefined;
    this.rejectReason = undefined;
    this.onFulfilled = undefined;
    this.onRejected = undefined;

    function resolve(value){
	_this.promiseValue = value;
	_this.promiseStatus = STATUS_FULFILLED;
    }

    function reject(reason){
	_this.rejectReason = reason;
	_this.promiseStatus = STATUS_REJECTED;
    }

    try{
	executor.apply(this, [resolve, reject]);
    }catch(e){
	reject(e);
    }
};

JSPromise.resolve = function(value){
    return new JSPromise(function(resolve, reject){
	resolve(value);
    });
};

JSPromise.reject = function(reason){
    return new JSPromise(function(resolve, reject){
	reject(reason);
    });
};

JSPromise.prototype.then = function(onFulfilled, onRejected){
    if(this.resolved ||
       (!onFulfilled && !onRejected) ||
       (typeof onFulfilled != 'function' && typeof onRejected != 'function')){
	return JSPromise.resolve(undefined);
    }

    const _this = this;
    this.onFulfilled = (onFulfilled && typeof onFulfilled == 'function')?onFulfilled: this.onFulfilled;
    this.onRejected = (onRejected && typeof onRejected == 'function')?onRejected: this.onRejected;
    
    if(this.promiseStatus === STATUS_FULFILLED){
	this.resolved = true;
	if(!this.onFulfilled){
	    return JSPromise.resolve();
	}
	let retVal;
	try{
	    retVal = this.onFulfilled.apply(this, [this.promiseValue]);
	}catch(e){
	    return JSPromise.reject(e);
	}
	if(retVal instanceof JSPromise){
	    return retVal;
	}else{
	    return JSPromise.resolve(retVal);
	}
    }
    
    if(this.promiseStatus === STATUS_REJECTED){
	this.resolved = true;
	if(!this.onRejected){
	    return JSPromise.reject(this.rejectReason);
	}
	let retVal;
	try{
	    this.onRejected.apply(this, [this.rejectReason]);
	}catch(e){
	    return JSPromise.reject(e);
	}
	if(retVal instanceof JSPromise){
	    return retVal;
	}else{
	    return JSPromise.resolve(retVal);
	}
    }

    if(this.promiseStatus === STATUS_PENDING){
	const _this = this;
	return new JSPromise(function (resolve, reject){
	    setTimeout(function checkStatus(){
		if(_this.resolved){
		    resolve();
		}else if(_this.promiseStatus === STATUS_FULFILLED && _this.onFulfilled){
		    _this.resolved = true;
		    let retVal;
		    try{
			retVal = _this.onFulfilled.apply(_this, [_this.promiseValue]);
		    }catch(e){
			reject(e);
		    }
		    if(retVal instanceof JSPromise){
			retVal.then(function(value){
			    resolve(value);
			});
		    }else{
			resolve(retVal);
		    }
		}else if(_this.promiseStatus === STATUS_REJECTED){
		    if(_this.onRejected){
			_this.resolved = true;
			let retVal;
			try{
			    retVal = _this.onRejected.apply(_this, [_this.rejectReason]);
			}catch(e){
			    reject(e);
			}
			if(retVal instanceof JSPromise){
			    retVal.then(function(value){
				resolve(value);
			    });
			}else{
			    resolve(retVal);
			}
		    }else{
			reject(_this.rejectReason);
		    }
		}else if(_this.promiseStatus === STATUS_PENDING){
		    setTimeout(function(){
			checkStatus(resolve, reject);
		    }, POLL_INTERVAL);
		}else{
		    _this.resolved = true;
		    resolve();
		}
	    }, 0);
	});
    }

    throw new Error("Unexpected status: "+_this.promiseStatus);
};

JSPromise.prototype.catch = function(onRejected){
    if(this.resolved){
	return JSPromise.resolve();
    }

    if(!onRejected || typeof onRejected != 'function'){
	throw "Must specify an 'onRejected' callback function as the argument!";
    }
    
    return this.then(undefined, onRejected);
};

module.exports = JSPromise;
