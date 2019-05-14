/* tslint:disable ban-types */
/* tslint:disable variable-name */
/* tslint:disable trailing-comma */

import chai from "chai";
const should = chai.should();
import { queued } from "../lib";

import "mocha";

describe("queued", () => {
    it("should exist", () => {
        queued.should.not.be.an("undefined");
    });
    it("should be a function", () => {
        queued.should.be.a("function");
    });
});
describe("queued", () => {
    it("should enqueue w/a deferred next & auto:[true]", () => {
        let n_f0 = 0;
        const f0 = queued(
            (number: number, next: Function) => {
                number.should.be.a("number");
                next.should.be.a("function");
                setTimeout(() => {
                    n_f0 += number;
                    next(); // i.e. *deferred* next()
                }, 50);
            }
        );
        {
            f0(1); f0(1); f0(1);
        }
        setTimeout(() => n_f0.should.equal(0), 0);
        setTimeout(() => n_f0.should.equal(1), 75);
        setTimeout(() => n_f0.should.equal(2), 125);
        setTimeout(() => n_f0.should.equal(3), 175);
    });
    it("should enqueue w/a deferred next & auto:[true] w/2 functions", () => {
        let n_f1 = 0;
        const f1 = queued.auto(true)(
            (next: Function) => {
                next.should.be.a("function");
                setTimeout(() => {
                    n_f1 += 1; next(); // i.e. *deferred* next()
                }, 25);
            },
            (next: Function) => {
                next.should.be.a("function");
                setTimeout(() => {
                    n_f1 += 1; next(); // i.e. *deferred* next()
                }, 25);
            }
        );
        {
            f1(); f1(); f1();
        }
        setTimeout(() => n_f1.should.equal(0), 0);
        setTimeout(() => n_f1.should.equal(2), 75);
        setTimeout(() => n_f1.should.equal(4), 125);
        setTimeout(() => n_f1.should.equal(6), 175);
    });
    it("should enqueue w/a deferred next & auto:[false]", () => {
        let n_f2 = 0;
        const f2 = queued.auto(false)((next: Function) => {
            next.should.be.a("function");
            setTimeout(() => {
                n_f2 += 1; next(); // i.e. *deferred* next()
            }, 50);
        });
        {
            f2(); f2(); f2(); f2.next();
        }
        setTimeout(() => n_f2.should.equal(0), 0);
        setTimeout(() => n_f2.should.equal(1), 75);
        setTimeout(() => n_f2.should.equal(2), 125);
        setTimeout(() => n_f2.should.equal(3), 175);
    });
});
describe("queued", () => {
    it("should enqueue w/o deferred next & auto:[true]", () => {
        let n_f3 = 0;
        const f3 = queued.auto(true)((next: Function) => {
            next.should.be.a("function");
            setTimeout(() => {
                n_f3 += 1; // i.e. *w/o* deferred next()
            }, 50);
            return true; // i.e. *immediate* next()
        });
        {
            f3(); f3(); f3();
        }
        setTimeout(() => n_f3.should.equal(0), 0);
        setTimeout(() => n_f3.should.equal(3), 75);
        setTimeout(() => n_f3.should.equal(3), 125);
        setTimeout(() => n_f3.should.equal(3), 175);
    });
    it("should enqueue w/o deferred next & auto:[false]", () => {
        let n_f4 = 0;
        const f4 = queued.auto(false)((next: Function) => {
            setTimeout(() => {
                n_f4 += 1; // i.e. *w/o* deferred next()
            }, 50);
            return true; // i.e. *immediate* next()
        });
        {
            f4(); f4(); f4(); f4.next();
        }
        setTimeout(() => n_f4.should.equal(0), 0);
        setTimeout(() => n_f4.should.equal(3), 75);
        setTimeout(() => n_f4.should.equal(3), 125);
        setTimeout(() => n_f4.should.equal(3), 175);
    });
});
describe("queued", () => {
    it("should named enqueue:f5 w/a deferred next & auto:[false]", () => {
        let n_f5 = 0;
        let n_f5a = 0;
        let n_f5b = 0;
        const f5a = queued.auto(false)(function f5(next: Function) {
            setTimeout(() => {
                n_f5 += 1; n_f5a += 1; next(); // i.e. *deferred* next()
            }, 50);
        });
        const f5b = queued.auto(false)(function f5(next: Function) {
            setTimeout(() => {
                n_f5 += 1; n_f5b += 1; next(); // i.e. *deferred* next()
            }, 50);
        });
        {
            f5a(); f5b(); f5a(); f5b(); f5a.next();
        }
        setTimeout(() => {
            n_f5.should.equal(0); n_f5a.should.equal(0); n_f5b.should.equal(0);
        }, 0);
        setTimeout(() => {
            n_f5.should.equal(1); n_f5a.should.equal(1); n_f5b.should.equal(0);
        }, 75);
        setTimeout(() => {
            n_f5.should.equal(2); n_f5a.should.equal(1); n_f5b.should.equal(1);
        }, 125);
        setTimeout(() => {
            n_f5.should.equal(3); n_f5a.should.equal(2); n_f5b.should.equal(1);
        }, 175);
        setTimeout(() => {
            n_f5.should.equal(4); n_f5a.should.equal(2); n_f5b.should.equal(2);
        }, 225);
    });
    it("should named enqueue:f6 w/a deferred next & auto:[false]", () => {
        let n_f6 = 0;
        let n_f6a = 0;
        let n_f6b = 0;
        const f6a = queued.auto(false)(function f6(next: Function) {
            setTimeout(() => {
                n_f6 += 1; n_f6a += 1; next(); // i.e. *deferred* next()
            }, 50);
        });
        const f6b = queued.auto(false)(function f6(next: Function) {
            setTimeout(() => {
                n_f6 += 1; n_f6b += 1; next(); // i.e. *deferred* next()
            }, 50);
        });
        {
            f6a(); f6b(); f6a(); f6b(); f6b.next();
        }
        setTimeout(() => {
            n_f6.should.equal(0); n_f6a.should.equal(0); n_f6b.should.equal(0);
        }, 0);
        setTimeout(() => {
            n_f6.should.equal(1); n_f6a.should.equal(1); n_f6b.should.equal(0);
        }, 75);
        setTimeout(() => {
            n_f6.should.equal(2); n_f6a.should.equal(1); n_f6b.should.equal(1);
        }, 125);
        setTimeout(() => {
            n_f6.should.equal(3); n_f6a.should.equal(2); n_f6b.should.equal(1);
        }, 175);
        setTimeout(() => {
            n_f6.should.equal(4); n_f6a.should.equal(2); n_f6b.should.equal(2);
        }, 225);
    });
    it("should named enqueue:f7 w/a deferred next & auto:[false, true]", () => {
        let n_f7 = 0;
        let n_f7a = 0;
        let n_f7b = 0;
        const f7a = queued.auto(false)(function f7(next: Function) {
            setTimeout(() => {
                n_f7 += 1; n_f7a += 1; next(); // i.e. *deferred* next()
            }, 50);
        });
        const f7b = queued.auto(true)(function f7(next: Function) {
            setTimeout(() => {
                n_f7 += 1; n_f7b += 1; next(); // i.e. *deferred* next()
            }, 50);
        });
        {
            f7a(); f7b(); f7a(); f7b();
        }
        setTimeout(() => {
            n_f7.should.equal(0); n_f7a.should.equal(0); n_f7b.should.equal(0);
        }, 0);
        setTimeout(() => {
            n_f7.should.equal(1); n_f7a.should.equal(1); n_f7b.should.equal(0);
        }, 75);
        setTimeout(() => {
            n_f7.should.equal(2); n_f7a.should.equal(1); n_f7b.should.equal(1);
        }, 125);
        setTimeout(() => {
            n_f7.should.equal(3); n_f7a.should.equal(2); n_f7b.should.equal(1);
        }, 175);
        setTimeout(() => {
            n_f7.should.equal(4); n_f7a.should.equal(2); n_f7b.should.equal(2);
        }, 225);
    });
    it("should named enqueue:f8 w/a deferred next & auto:[true, false]", () => {
        let n_f8 = 0;
        let n_f8a = 0;
        let n_f8b = 0;
        const f8a = queued.auto(true)(function f8(next: Function) {
            setTimeout(() => {
                n_f8 += 1; n_f8a += 1; next(); // i.e. *deferred* next()
            }, 50);
        });
        const f8b = queued.auto(false)(function f8(next: Function) {
            setTimeout(() => {
                n_f8 += 1; n_f8b += 1; next(); // i.e. *deferred* next()
            }, 50);
        });
        {
            f8a(); f8b(); f8a(); f8b();
        }
        setTimeout(() => {
            n_f8.should.equal(0); n_f8a.should.equal(0); n_f8b.should.equal(0);
        }, 0);
        setTimeout(() => {
            n_f8.should.equal(1); n_f8a.should.equal(1); n_f8b.should.equal(0);
        }, 75);
        setTimeout(() => {
            n_f8.should.equal(2); n_f8a.should.equal(1); n_f8b.should.equal(1);
        }, 125);
        setTimeout(() => {
            n_f8.should.equal(3); n_f8a.should.equal(2); n_f8b.should.equal(1);
        }, 175);
        setTimeout(() => {
            n_f8.should.equal(4); n_f8a.should.equal(2); n_f8b.should.equal(2);
        }, 225);
    });
    it("should named enqueue:f9 w/a deferred next & auto:[true, true]", () => {
        let n_f9 = 0;
        let n_f9a = 0;
        let n_f9b = 0;
        const f9a = queued.auto(true)(function f9(next: Function) {
            setTimeout(() => {
                n_f9 += 1; n_f9a += 1; next(); // i.e. *deferred* next()
            }, 50);
        });
        const f9b = queued.auto(true)(function f9(next: Function) {
            setTimeout(() => {
                n_f9 += 1; n_f9b += 1; next(); // i.e. *deferred* next()
            }, 50);
        });
        {
            f9a(); f9b(); f9a(); f9b();
        }
        setTimeout(() => {
            n_f9.should.equal(0); n_f9a.should.equal(0); n_f9b.should.equal(0);
        }, 0);
        setTimeout(() => {
            n_f9.should.equal(2); n_f9a.should.equal(1); n_f9b.should.equal(1);
        }, 75);
        setTimeout(() => {
            n_f9.should.equal(4); n_f9a.should.equal(2); n_f9b.should.equal(2);
        }, 125);
    });
});
