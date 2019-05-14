(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.dizmoFunctionsQueued = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable ban-types */
/* tslint:disable member-ordering */
/* tslint:disable trailing-comma */
/* tslint:disable variable-name */
var functions_random_1 = require("@dizmo/functions-random");

var Queue = function () {
    function Queue(options) {
        _classCallCheck(this, Queue);

        this._name = "";
        this._auto = false;
        this._running = false;
        this._queue = [];
        if (options === undefined) {
            options = {};
        }
        this._auto = options.auto !== undefined ? options.auto : true;
        this._name = options.name ? options.name : functions_random_1.random(8);
        if (Queue._q[this._name] === undefined) {
            Queue._q[this._name] = [];
        }
        this._queue = Queue._q[this._name];
    }

    _createClass(Queue, [{
        key: "enqueue",
        value: function enqueue(callback) {
            var _this = this;

            this._queue.push(function () {
                if (callback()) {
                    _this.dequeue();
                }
            });
            if (this._auto && !this._running) {
                this.dequeue();
            }
            return this;
        }
    }, {
        key: "dequeue",
        value: function dequeue() {
            this._running = false;
            var shift = this._queue.shift();
            if (shift) {
                this._running = true;
                shift();
            }
            return shift;
        }
    }]);

    return Queue;
}();

Queue._q = {};
exports.Queue = Queue;
exports.auto = function (flag) {
    return function (fn) {
        for (var _len = arguments.length, functions = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            functions[_key - 1] = arguments[_key];
        }

        var q = new Queue({
            auto: flag, name: fn.name
        });
        var qn = function qn() {
            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            q.enqueue(function () {
                return fn.apply(null, args.concat([function () {
                    return q.dequeue();
                }]));
            });

            var _loop = function _loop(fi) {
                q.enqueue(function () {
                    return fi.apply(null, args.concat([function () {
                        return q.dequeue();
                    }]));
                });
            };

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = functions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var fi = _step.value;

                    _loop(fi);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        };
        qn.next = function () {
            q.dequeue();
        };
        return qn;
    };
};
exports.queued = function (fn) {
    var _exports$auto;

    for (var _len3 = arguments.length, functions = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        functions[_key3 - 1] = arguments[_key3];
    }

    return (_exports$auto = exports.auto(true)).call.apply(_exports$auto, [null, fn].concat(functions));
};
exports.queued.auto = exports.auto;
exports.default = exports.queued;

},{"@dizmo/functions-random":3}],2:[function(require,module,exports){
"use strict";
/* tslint:disable:interface-name */
/**
 * Attaches to the `String` type a `random` function which returns a random
 * string for the provided length and range.
 *
 * @param length of returned string in [0..8]
 * @param range of characters in [2..36]
 *
 * @returns a random string
 */

String.random = function () {
    var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var range = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 36;

    length = Math.floor(length);
    if (length < 0) {
        throw new Error("length < 0");
    }
    if (length > 8) {
        throw new Error("length > 8");
    }
    range = Math.floor(range);
    if (range < 2) {
        throw new Error("range < 2");
    }
    if (range > 36) {
        throw new Error("range > 36");
    }
    var pow = Math.pow(range, length);
    var mul = range * pow;
    return length > 0 ? Math.floor(mul - pow * Math.random()).toString(range).slice(1) : "";
};

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
require("./String");
/**
 * Returns a random string for the provided length and range.
 *
 * @param length of returned string in [0..8]
 * @param range of characters in [2..36]
 *
 * @returns a random string
 */
function random() {
  var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var range = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 36;

  return String.random(length, range);
}
exports.random = random;
exports.default = random;

},{"./String":2}]},{},[1])(1)
});
//# sourceMappingURL=index.umd.js.map
