"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
/* tslint:disable ban-types */

/* tslint:disable member-ordering */

/* tslint:disable trailing-comma */

/* tslint:disable variable-name */

var functions_random_1 = require("@dizmo/functions-random");

var Queue =
/*#__PURE__*/
function () {
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
    for (var _len = arguments.length, functions = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      functions[_key - 1] = arguments[_key];
    }

    var q = new Queue({
      auto: flag,
      name: fn.name
    });

    var qn = function qn() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      q.enqueue(function () {
        return fn.apply(null, args.concat([function () {
          return q.dequeue();
        }]));
      });

      var _loop = function _loop() {
        var fi = _functions[_i];
        q.enqueue(function () {
          return fi.apply(null, args.concat([function () {
            return q.dequeue();
          }]));
        });
      };

      for (var _i = 0, _functions = functions; _i < _functions.length; _i++) {
        _loop();
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

  for (var _len3 = arguments.length, functions = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    functions[_key3 - 1] = arguments[_key3];
  }

  return (_exports$auto = exports.auto(true)).call.apply(_exports$auto, [null, fn].concat(functions));
};

exports.queued.auto = exports.auto;
exports["default"] = exports.queued;
//# sourceMappingURL=index.js.map