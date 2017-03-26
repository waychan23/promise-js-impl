Promise API JavaScript 实现（实验）
===
为了更好地理解Promise API，我决定根据其API接口做自己的实现。通过查看[V8]，发现其API的实现是使用C++完成的，而我是使用JavaScript实现的，所以我这里的实现只是为了学习之用，在实际应用中可能达不到性能的要求，设计也可能有不合理之处。欢迎大家探讨学习。

* 注意：为了能够独立思考，在做自己的实现之前，我并未参考其他现有的Polyfill的实现。

Promise API的接口定义我参考的是[Mozilla Developer Network]。

[V8]: https://github.com/v8/v8
[Mozilla Developer Network]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
