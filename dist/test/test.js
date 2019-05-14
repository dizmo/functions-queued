"use strict";
/* tslint:disable ban-types */
/* tslint:disable variable-name */
/* tslint:disable trailing-comma */

var __importDefault = undefined && undefined.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = __importDefault(require("chai"));
var should = chai_1.default.should();
var lib_1 = require("../lib");
require("mocha");
describe("queued", function () {
    it("should exist", function () {
        lib_1.queued.should.not.be.an("undefined");
    });
    it("should be a function", function () {
        lib_1.queued.should.be.a("function");
    });
});
describe("queued", function () {
    it("should enqueue w/a deferred next & auto:[true]", function () {
        var n_f0 = 0;
        var f0 = lib_1.queued(function (number, next) {
            number.should.be.a("number");
            next.should.be.a("function");
            setTimeout(function () {
                n_f0 += number;
                next(); // i.e. *deferred* next()
            }, 50);
        });
        {
            f0(1);
            f0(1);
            f0(1);
        }
        setTimeout(function () {
            return n_f0.should.equal(0);
        }, 0);
        setTimeout(function () {
            return n_f0.should.equal(1);
        }, 75);
        setTimeout(function () {
            return n_f0.should.equal(2);
        }, 125);
        setTimeout(function () {
            return n_f0.should.equal(3);
        }, 175);
    });
    it("should enqueue w/a deferred next & auto:[true] w/2 functions", function () {
        var n_f1 = 0;
        var f1 = lib_1.queued.auto(true)(function (next) {
            next.should.be.a("function");
            setTimeout(function () {
                n_f1 += 1;
                next(); // i.e. *deferred* next()
            }, 25);
        }, function (next) {
            next.should.be.a("function");
            setTimeout(function () {
                n_f1 += 1;
                next(); // i.e. *deferred* next()
            }, 25);
        });
        {
            f1();
            f1();
            f1();
        }
        setTimeout(function () {
            return n_f1.should.equal(0);
        }, 0);
        setTimeout(function () {
            return n_f1.should.equal(2);
        }, 75);
        setTimeout(function () {
            return n_f1.should.equal(4);
        }, 125);
        setTimeout(function () {
            return n_f1.should.equal(6);
        }, 175);
    });
    it("should enqueue w/a deferred next & auto:[false]", function () {
        var n_f2 = 0;
        var f2 = lib_1.queued.auto(false)(function (next) {
            next.should.be.a("function");
            setTimeout(function () {
                n_f2 += 1;
                next(); // i.e. *deferred* next()
            }, 50);
        });
        {
            f2();
            f2();
            f2();
            f2.next();
        }
        setTimeout(function () {
            return n_f2.should.equal(0);
        }, 0);
        setTimeout(function () {
            return n_f2.should.equal(1);
        }, 75);
        setTimeout(function () {
            return n_f2.should.equal(2);
        }, 125);
        setTimeout(function () {
            return n_f2.should.equal(3);
        }, 175);
    });
});
describe("queued", function () {
    it("should enqueue w/o deferred next & auto:[true]", function () {
        var n_f3 = 0;
        var f3 = lib_1.queued.auto(true)(function (next) {
            next.should.be.a("function");
            setTimeout(function () {
                n_f3 += 1; // i.e. *w/o* deferred next()
            }, 50);
            return true; // i.e. *immediate* next()
        });
        {
            f3();
            f3();
            f3();
        }
        setTimeout(function () {
            return n_f3.should.equal(0);
        }, 0);
        setTimeout(function () {
            return n_f3.should.equal(3);
        }, 75);
        setTimeout(function () {
            return n_f3.should.equal(3);
        }, 125);
        setTimeout(function () {
            return n_f3.should.equal(3);
        }, 175);
    });
    it("should enqueue w/o deferred next & auto:[false]", function () {
        var n_f4 = 0;
        var f4 = lib_1.queued.auto(false)(function (next) {
            setTimeout(function () {
                n_f4 += 1; // i.e. *w/o* deferred next()
            }, 50);
            return true; // i.e. *immediate* next()
        });
        {
            f4();
            f4();
            f4();
            f4.next();
        }
        setTimeout(function () {
            return n_f4.should.equal(0);
        }, 0);
        setTimeout(function () {
            return n_f4.should.equal(3);
        }, 75);
        setTimeout(function () {
            return n_f4.should.equal(3);
        }, 125);
        setTimeout(function () {
            return n_f4.should.equal(3);
        }, 175);
    });
});
describe("queued", function () {
    it("should named enqueue:f5 w/a deferred next & auto:[false]", function () {
        var n_f5 = 0;
        var n_f5a = 0;
        var n_f5b = 0;
        var f5a = lib_1.queued.auto(false)(function f5(next) {
            setTimeout(function () {
                n_f5 += 1;
                n_f5a += 1;
                next(); // i.e. *deferred* next()
            }, 50);
        });
        var f5b = lib_1.queued.auto(false)(function f5(next) {
            setTimeout(function () {
                n_f5 += 1;
                n_f5b += 1;
                next(); // i.e. *deferred* next()
            }, 50);
        });
        {
            f5a();
            f5b();
            f5a();
            f5b();
            f5a.next();
        }
        setTimeout(function () {
            n_f5.should.equal(0);
            n_f5a.should.equal(0);
            n_f5b.should.equal(0);
        }, 0);
        setTimeout(function () {
            n_f5.should.equal(1);
            n_f5a.should.equal(1);
            n_f5b.should.equal(0);
        }, 75);
        setTimeout(function () {
            n_f5.should.equal(2);
            n_f5a.should.equal(1);
            n_f5b.should.equal(1);
        }, 125);
        setTimeout(function () {
            n_f5.should.equal(3);
            n_f5a.should.equal(2);
            n_f5b.should.equal(1);
        }, 175);
        setTimeout(function () {
            n_f5.should.equal(4);
            n_f5a.should.equal(2);
            n_f5b.should.equal(2);
        }, 225);
    });
    it("should named enqueue:f6 w/a deferred next & auto:[false]", function () {
        var n_f6 = 0;
        var n_f6a = 0;
        var n_f6b = 0;
        var f6a = lib_1.queued.auto(false)(function f6(next) {
            setTimeout(function () {
                n_f6 += 1;
                n_f6a += 1;
                next(); // i.e. *deferred* next()
            }, 50);
        });
        var f6b = lib_1.queued.auto(false)(function f6(next) {
            setTimeout(function () {
                n_f6 += 1;
                n_f6b += 1;
                next(); // i.e. *deferred* next()
            }, 50);
        });
        {
            f6a();
            f6b();
            f6a();
            f6b();
            f6b.next();
        }
        setTimeout(function () {
            n_f6.should.equal(0);
            n_f6a.should.equal(0);
            n_f6b.should.equal(0);
        }, 0);
        setTimeout(function () {
            n_f6.should.equal(1);
            n_f6a.should.equal(1);
            n_f6b.should.equal(0);
        }, 75);
        setTimeout(function () {
            n_f6.should.equal(2);
            n_f6a.should.equal(1);
            n_f6b.should.equal(1);
        }, 125);
        setTimeout(function () {
            n_f6.should.equal(3);
            n_f6a.should.equal(2);
            n_f6b.should.equal(1);
        }, 175);
        setTimeout(function () {
            n_f6.should.equal(4);
            n_f6a.should.equal(2);
            n_f6b.should.equal(2);
        }, 225);
    });
    it("should named enqueue:f7 w/a deferred next & auto:[false, true]", function () {
        var n_f7 = 0;
        var n_f7a = 0;
        var n_f7b = 0;
        var f7a = lib_1.queued.auto(false)(function f7(next) {
            setTimeout(function () {
                n_f7 += 1;
                n_f7a += 1;
                next(); // i.e. *deferred* next()
            }, 50);
        });
        var f7b = lib_1.queued.auto(true)(function f7(next) {
            setTimeout(function () {
                n_f7 += 1;
                n_f7b += 1;
                next(); // i.e. *deferred* next()
            }, 50);
        });
        {
            f7a();
            f7b();
            f7a();
            f7b();
        }
        setTimeout(function () {
            n_f7.should.equal(0);
            n_f7a.should.equal(0);
            n_f7b.should.equal(0);
        }, 0);
        setTimeout(function () {
            n_f7.should.equal(1);
            n_f7a.should.equal(1);
            n_f7b.should.equal(0);
        }, 75);
        setTimeout(function () {
            n_f7.should.equal(2);
            n_f7a.should.equal(1);
            n_f7b.should.equal(1);
        }, 125);
        setTimeout(function () {
            n_f7.should.equal(3);
            n_f7a.should.equal(2);
            n_f7b.should.equal(1);
        }, 175);
        setTimeout(function () {
            n_f7.should.equal(4);
            n_f7a.should.equal(2);
            n_f7b.should.equal(2);
        }, 225);
    });
    it("should named enqueue:f8 w/a deferred next & auto:[true, false]", function () {
        var n_f8 = 0;
        var n_f8a = 0;
        var n_f8b = 0;
        var f8a = lib_1.queued.auto(true)(function f8(next) {
            setTimeout(function () {
                n_f8 += 1;
                n_f8a += 1;
                next(); // i.e. *deferred* next()
            }, 50);
        });
        var f8b = lib_1.queued.auto(false)(function f8(next) {
            setTimeout(function () {
                n_f8 += 1;
                n_f8b += 1;
                next(); // i.e. *deferred* next()
            }, 50);
        });
        {
            f8a();
            f8b();
            f8a();
            f8b();
        }
        setTimeout(function () {
            n_f8.should.equal(0);
            n_f8a.should.equal(0);
            n_f8b.should.equal(0);
        }, 0);
        setTimeout(function () {
            n_f8.should.equal(1);
            n_f8a.should.equal(1);
            n_f8b.should.equal(0);
        }, 75);
        setTimeout(function () {
            n_f8.should.equal(2);
            n_f8a.should.equal(1);
            n_f8b.should.equal(1);
        }, 125);
        setTimeout(function () {
            n_f8.should.equal(3);
            n_f8a.should.equal(2);
            n_f8b.should.equal(1);
        }, 175);
        setTimeout(function () {
            n_f8.should.equal(4);
            n_f8a.should.equal(2);
            n_f8b.should.equal(2);
        }, 225);
    });
    it("should named enqueue:f9 w/a deferred next & auto:[true, true]", function () {
        var n_f9 = 0;
        var n_f9a = 0;
        var n_f9b = 0;
        var f9a = lib_1.queued.auto(true)(function f9(next) {
            setTimeout(function () {
                n_f9 += 1;
                n_f9a += 1;
                next(); // i.e. *deferred* next()
            }, 50);
        });
        var f9b = lib_1.queued.auto(true)(function f9(next) {
            setTimeout(function () {
                n_f9 += 1;
                n_f9b += 1;
                next(); // i.e. *deferred* next()
            }, 50);
        });
        {
            f9a();
            f9b();
            f9a();
            f9b();
        }
        setTimeout(function () {
            n_f9.should.equal(0);
            n_f9a.should.equal(0);
            n_f9b.should.equal(0);
        }, 0);
        setTimeout(function () {
            n_f9.should.equal(2);
            n_f9a.should.equal(1);
            n_f9b.should.equal(1);
        }, 75);
        setTimeout(function () {
            n_f9.should.equal(4);
            n_f9a.should.equal(2);
            n_f9b.should.equal(2);
        }, 125);
    });
});
//# sourceMappingURL=test.js.map