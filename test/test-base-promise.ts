import { queued } from "../lib";
import chai from "chai";
chai.should();

describe("queued", () => {
    it("should exist", () => {
        queued.should.not.be.an("undefined");
    });
    it("should be a function", () => {
        queued.should.be.a("function");
    });
});
describe("queued", () => {
    it("should enqueue w/a deferred promise & auto:[true]", (done) => {
        let n_f0 = 0;
        const f0 = queued((
            number: number, next: Function
        ) => {
            number.should.be.a("number");
            next.should.be.a("function");
            return new Promise<boolean>((resolve) => {
                setTimeout(() => {
                    n_f0 += number;
                    resolve(true); // i.e. *deferred* resolve()
                }, 50);
            });
        });
        {
            n_f0.should.eq(0); f0(1);
            n_f0.should.eq(0); f0(1);
            n_f0.should.eq(0); f0(1);
            n_f0.should.eq(0);
        }
        setTimeout(() => n_f0.should.eq(3) && done(), 250);
    });
    it("should enqueue w/a deferred promise & auto:[true]; await result", async () => {
        let n_f0 = 0;
        const f0 = queued<boolean>((
            number: number, next: Function
        ) => {
            number.should.be.a("number");
            next.should.be.a("function");
            return new Promise<boolean>((resolve) => {
                setTimeout(() => {
                    n_f0 += number;
                    resolve(true); // i.e. *deferred* resolve()
                }, 50);
            });
        });
        {
            const b1 = await f0(1); b1.should.eq(true); n_f0.should.eq(1);
            const b2 = await f0(1); b2.should.eq(true); n_f0.should.eq(2);
            const b3 = await f0(1); b3.should.eq(true); n_f0.should.eq(3);
        }
        return new Promise((resolve) => {
            setTimeout(() => n_f0.should.eq(3) && resolve(), 250);
        });
    });
    it("should enqueue w/a deferred promise & auto:[true] w/2 functions", (done) => {
        let n_f1 = 0;
        const f1a = queued.auto(true)(function f1(
            next: Function
        ) {
            next.should.be.a("function");
            return new Promise<boolean>((resolve) => {
                setTimeout(() => {
                    n_f1 += 1; resolve(true); // i.e. *deferred* resolve()
                }, 25);
            });
        });
        const f1b = queued.auto(true)(function f1 (
            next: Function
        ) {
            next.should.be.a("function");
            return new Promise<boolean>((resolve) => {
                setTimeout(() => {
                    n_f1 += 1; resolve(true); // i.e. *deferred* resolve()
                }, 25);
            });
        });
        {
            n_f1.should.eq(0); f1a();
            n_f1.should.eq(0); f1b();
            n_f1.should.eq(0); f1a();
            n_f1.should.eq(0); f1b();
            n_f1.should.eq(0); f1a();
            n_f1.should.eq(0); f1b();
            n_f1.should.eq(0);
        }
        setTimeout(() => n_f1.should.eq(6) && done(), 250);
    });
    it("should enqueue w/a deferred promise & auto:[true] w/2 functions; await result", async () => {
        let n_f1 = 0;
        const f1a = queued.auto<boolean>(true)(function f1(
            next: Function
        ) {
            next.should.be.a("function");
            return new Promise<boolean>((resolve) => {
                setTimeout(() => {
                    n_f1 += 1; resolve(true); // i.e. *deferred* resolve()
                }, 25);
            });
        });
        const f1b = queued.auto<boolean>(true)(function f1 (
            next: Function
        ) {
            next.should.be.a("function");
            return new Promise<boolean>((resolve) => {
                setTimeout(() => {
                    n_f1 += 1; resolve(true); // i.e. *deferred* resolve()
                }, 25);
            });
        });
        {
            const b1 = await f1a(); b1.should.eq(true); n_f1.should.eq(1);
            const b2 = await f1b(); b2.should.eq(true); n_f1.should.eq(2);
            const b3 = await f1a(); b3.should.eq(true); n_f1.should.eq(3);
            const b4 = await f1b(); b4.should.eq(true); n_f1.should.eq(4);
            const b5 = await f1a(); b5.should.eq(true); n_f1.should.eq(5);
            const b6 = await f1b(); b6.should.eq(true); n_f1.should.eq(6);
        }
        return new Promise((resolve) => {
            setTimeout(() => n_f1.should.eq(6) && resolve(), 250);
        })
    });
    it("should enqueue w/a deferred promise & auto:[false]", (done) => {
        let n_f2 = 0;
        const f2 = queued.auto(false)((
            next: Function
        ) => {
            next.should.be.a("function");
            return new Promise<boolean>((resolve) => {
                setTimeout(() => {
                    n_f2 += 1; resolve(true); // i.e. *deferred* resolve()
                }, 50);
            });
        });
        {
            n_f2.should.eq(0); f2();
            n_f2.should.eq(0); f2();
            n_f2.should.eq(0); f2();
            n_f2.should.eq(0); f2.next();
            n_f2.should.eq(0);
        }
        setTimeout(() => n_f2.should.eq(3) && done(), 250);
    });
    it("should enqueue w/a deferred promise & auto:[false]; await result", async () => {
        let n_f2 = 0;
        const f2 = queued.auto<boolean>(false)((
            next: Function
        ) => {
            next.should.be.a("function");
            return new Promise<boolean>((resolve) => {
                setTimeout(() => {
                    n_f2 += 1; resolve(true); // i.e. *deferred* resolve()
                }, 50);
            });
        });
        {
            f2(); const b1 = await f2.next(); b1?.should.eq(true); n_f2.should.eq(1);
            f2(); const b2 = await f2.next(); b2?.should.eq(true); n_f2.should.eq(2);
            f2(); const b3 = await f2.next(); b3?.should.eq(true); n_f2.should.eq(3);
        }
        return new Promise((resolve) => {
            setTimeout(() => n_f2.should.eq(3) && resolve(), 250);
        });
    });
});
describe("queued", () => {
    it("should enqueue w/an immediate promise & auto:[true]", (done) => {
        let n_f3 = 0;
        const f3 = queued.auto(true)((
            next: Function
        ) => {
            next.should.be.a("function");
            setTimeout(() => {
                n_f3 += 1; // i.e. *w/o* deferred next
            }, 50);
            return Promise.resolve(true); // i.e. *immediate* resolve()
        });
        {
            n_f3.should.eq(0); f3();
            n_f3.should.eq(0); f3();
            n_f3.should.eq(0); f3();
            n_f3.should.eq(0);
        }
        setTimeout(() => n_f3.should.eq(0), 0);
        setTimeout(() => n_f3.should.eq(3), 125);
        setTimeout(() => n_f3.should.eq(3) && done(), 250);
    });
    it("should enqueue w/an immediate promise & auto:[true]; await result", async () => {
        let n_f3 = 0;
        const f3 = queued.auto<boolean>(true)((
            next: Function
        ) => {
            next.should.be.a("function");
            setTimeout(() => {
                n_f3 += 1; // i.e. *w/o* deferred next
            }, 50);
            return Promise.resolve(true); // i.e. *immediate* resolve()
        });
        {
            const b1 = await f3(); b1.should.eq(true); n_f3.should.eq(0);
            const b2 = await f3(); b2.should.eq(true); n_f3.should.eq(0);
            const b3 = await f3(); b3.should.eq(true); n_f3.should.eq(0);
        }
        return new Promise((resolve) => {
            setTimeout(() => n_f3.should.eq(3) && resolve(), 250);
        });
    });
    it("should enqueue w/an immediate promise & auto:[false]", (done) => {
        let n_f4 = 0;
        const f4 = queued.auto(false)(() => {
            setTimeout(() => {
                n_f4 += 1; // i.e. *w/o* deferred next
            }, 50);
            return Promise.resolve(true); // i.e. *immediate* resolve()
        });
        {
            n_f4.should.eq(0); f4();
            n_f4.should.eq(0); f4();
            n_f4.should.eq(0); f4();
            n_f4.should.eq(0); f4.next();
            n_f4.should.eq(0);
        }
        setTimeout(() => n_f4.should.eq(0), 0);
        setTimeout(() => n_f4.should.eq(3), 125);
        setTimeout(() => n_f4.should.eq(3) && done(), 250);
    });
    it("should enqueue w/an immediate promise & auto:[false]; await result", async () => {
        let n_f4 = 0;
        const f4 = queued.auto<boolean>(false)(() => {
            setTimeout(() => {
                n_f4 += 1; // i.e. *w/o* deferred next
            }, 50);
            return Promise.resolve(true); // i.e. *immediate* resolve()
        });
        {
            f4(); const b1 = await f4.next(); b1?.should.eq(true); n_f4.should.eq(0);
            f4(); const b2 = await f4.next(); b2?.should.eq(true); n_f4.should.eq(0);
            f4(); const b3 = await f4.next(); b3?.should.eq(true); n_f4.should.eq(0);
        }
        return new Promise((resolve) => {
            setTimeout(() => n_f4.should.eq(3) && resolve(), 250);
        })
    });
});
describe("queued", () => {
    it("should named enqueue:f6 w/a deferred promise & auto:[false, false]", (done) => {
        let n_f6 = 0;
        let n_f6a = 0;
        let n_f6b = 0;
        const f6a = queued.auto(false)(function f6(
            next: Function
        ) {
            next.should.be.a("function");
            return new Promise<boolean>((resolve) => {
                setTimeout(() => {
                    n_f6 += 1; n_f6a += 1; resolve(true); // i.e. *deferred* resolve()
                }, 50);
            });
        });
        const f6b = queued.auto(false)(function f6(
            next: Function
        ) {
            next.should.be.a("function");
            return new Promise<boolean>((resolve) => {
                setTimeout(() => {
                    n_f6 += 1; n_f6b += 1; resolve(true); // i.e. *deferred* resolve()
                }, 50);
            });
        });
        {
            n_f6.should.eq(0); f6a();
            n_f6.should.eq(0); f6b();
            n_f6.should.eq(0); f6a();
            n_f6.should.eq(0); f6b();
            n_f6.should.eq(0); f6b.next();
            n_f6.should.eq(0);
        }
        setTimeout(() => {
            n_f6.should.eq(0);
            n_f6a.should.eq(0);
            n_f6b.should.eq(0);
        }, 0);
        setTimeout(() => {
            n_f6.should.eq(4);
            n_f6a.should.eq(2);
            n_f6b.should.eq(2);
            done();
        }, 250);
    });
    it("should named enqueue:f6 w/a deferred promise & auto:[false, false]; await result", async () => {
        let n_f6 = 0;
        let n_f6a = 0;
        let n_f6b = 0;
        const f6a = queued.auto<boolean>(false)(function f6(
            next: Function
        ) {
            next.should.be.a("function");
            return new Promise<boolean>((resolve) => {
                setTimeout(() => {
                    n_f6 += 1; n_f6a += 1; resolve(true); // i.e. *deferred* resolve()
                }, 50);
            });
        });
        const f6b = queued.auto<boolean>(false)(function f6(
            next: Function
        ) {
            next.should.be.a("function");
            return new Promise<boolean>((resolve) => {
                setTimeout(() => {
                    n_f6 += 1; n_f6b += 1; resolve(true); // i.e. *deferred* resolve()
                }, 50);
            });
        });
        {
            f6a(); const b1 = await f6a.next(); b1?.should.eq(true); n_f6.should.eq(1);
            f6b(); const b2 = await f6b.next(); b2?.should.eq(true); n_f6.should.eq(2);
            f6a(); const b3 = await f6a.next(); b3?.should.eq(true); n_f6.should.eq(3);
            f6b(); const b4 = await f6b.next(); b4?.should.eq(true); n_f6.should.eq(4);
        }
        return new Promise((resolve) => {
            setTimeout(() => {
                n_f6.should.eq(4);
                n_f6a.should.eq(2);
                n_f6b.should.eq(2);
                resolve();
            }, 250);
        });
    });
    it("should named enqueue:f7 w/a deferred promise & auto:[false, true]", (done) => {
        let n_f7 = 0;
        let n_f7a = 0;
        let n_f7b = 0;
        const f7a = queued.auto(false)(function f7(
            next: Function
        ) {
            next.should.be.a("function");
            return new Promise<boolean>((resolve) => {
                setTimeout(() => {
                    n_f7 += 1; n_f7a += 1; resolve(true); // i.e. *deferred* resolve()
                }, 50);
            });
        });
        const f7b = queued.auto(true)(function f7(
            next: Function
        ) {
            next.should.be.a("function");
            return new Promise<boolean>((resolve) => {
                setTimeout(() => {
                    n_f7 += 1; n_f7b += 1; resolve(true); // i.e. *deferred* resolve()
                }, 50);
            });
        });
        {
            n_f7.should.eq(0); f7a();
            n_f7.should.eq(0); f7b();
            n_f7.should.eq(0); f7a();
            n_f7.should.eq(0); f7b();
            n_f7.should.eq(0);
        }
        setTimeout(() => {
            n_f7.should.eq(0);
            n_f7a.should.eq(0);
            n_f7b.should.eq(0);
        }, 0);
        setTimeout(() => {
            n_f7.should.eq(4);
            n_f7a.should.eq(2);
            n_f7b.should.eq(2);
            done();
        }, 250);
    });
    it("should named enqueue:f7 w/a deferred promise & auto:[false, true]; await result", async () => {
        let n_f7 = 0;
        let n_f7a = 0;
        let n_f7b = 0;
        const f7a = queued.auto<boolean>(false)(function f7x(
            next: Function
        ) {
            next.should.be.a("function");
            return new Promise<boolean>((resolve) => {
                setTimeout(() => {
                    n_f7 += 1; n_f7a += 1; resolve(true); // i.e. *deferred* resolve()
                }, 50);
            });
        });
        const f7b = queued.auto<boolean>(true)(function f7x(
            next: Function
        ) {
            next.should.be.a("function");
            return new Promise<boolean>((resolve) => {
                setTimeout(() => {
                    n_f7 += 1; n_f7b += 1; resolve(true); // i.e. *deferred* resolve()
                }, 50);
            });
        });
        {
            f7a(); const b1 = await f7a.next(); b1?.should.eq(true); n_f7.should.eq(1);
            const b2 = await f7b(); b2.should.eq(true); n_f7.should.eq(2);
            f7a(); const b3 = await f7a.next(); b3?.should.eq(true); n_f7.should.eq(3);
            const b4 = await f7b(); b4.should.eq(true); n_f7.should.eq(4);
        }
        return new Promise((resolve) => {
            setTimeout(() => {
                n_f7.should.eq(4);
                n_f7a.should.eq(2);
                n_f7b.should.eq(2);
                resolve();
            }, 250);
        });
    });
    it("should named enqueue:f8 w/a deferred promise & auto:[true, false]", (done) => {
        let n_f8 = 0;
        let n_f8a = 0;
        let n_f8b = 0;
        const f8a = queued.auto(true)(function f8(
            next: Function
        ) {
            next.should.be.a("function");
            return new Promise<boolean>((resolve) => {
                setTimeout(() => {
                    n_f8 += 1; n_f8a += 1; resolve(true); // i.e. *deferred* resolve()
                }, 50);
            });
        });
        const f8b = queued.auto(false)(function f8(
            next: Function
        ) {
            next.should.be.a("function");
            return new Promise<boolean>((resolve) => {
                setTimeout(() => {
                    n_f8 += 1; n_f8b += 1; resolve(true); // i.e. *deferred* resolve()
                }, 50);
            });
        });
        {
            n_f8.should.eq(0); f8a();
            n_f8.should.eq(0); f8b();
            n_f8.should.eq(0); f8a();
            n_f8.should.eq(0); f8b();
            n_f8.should.eq(0);
        }
        setTimeout(() => {
            n_f8.should.eq(0);
            n_f8a.should.eq(0);
            n_f8b.should.eq(0);
        }, 0);
        setTimeout(() => {
            n_f8.should.eq(4);
            n_f8a.should.eq(2);
            n_f8b.should.eq(2);
            done();
        }, 250);
    });
    it("should named enqueue:f8 w/a deferred promise & auto:[true, false]; await result", async () => {
        let n_f8 = 0;
        let n_f8a = 0;
        let n_f8b = 0;
        const f8a = queued.auto<boolean>(true)(function f8(
            next: Function
        ) {
            next.should.be.a("function");
            return new Promise<boolean>((resolve) => {
                setTimeout(() => {
                    n_f8 += 1; n_f8a += 1; resolve(true); // i.e. *deferred* resolve()
                }, 50);
            });
        });
        const f8b = queued.auto<boolean>(false)(function f8(
            next: Function
        ) {
            next.should.be.a("function");
            return new Promise<boolean>((resolve) => {
                setTimeout(() => {
                    n_f8 += 1; n_f8b += 1; resolve(true); // i.e. *deferred* resolve()
                }, 50);
            });
        });
        {
            const b1 = await f8a(); b1.should.eq(true); n_f8.should.eq(1);
            f8b(); const b2 = await f8b.next(); b2?.should.eq(true); n_f8.should.eq(2);
            const b3 = await f8a(); b3.should.eq(true); n_f8.should.eq(3);
            f8b(); const b4 = await f8b.next(); b4?.should.eq(true); n_f8.should.eq(4);
        }
        return new Promise((resolve) => {
            setTimeout(() => {
                n_f8.should.eq(4);
                n_f8a.should.eq(2);
                n_f8b.should.eq(2);
                resolve();
            }, 250);
        });
    });
    it("should named enqueue:f9 w/a deferred promise & auto:[true, true]", (done) => {
        let n_f9 = 0;
        let n_f9a = 0;
        let n_f9b = 0;
        const f9a = queued.auto(true)(function f9(
            next: Function
        ) {
            next.should.be.a("function");
            return new Promise<boolean>((resolve) => {
                setTimeout(() => {
                    n_f9 += 1; n_f9a += 1; resolve(true); // i.e. *deferred* resolve()
                }, 50);
            });
        });
        const f9b = queued.auto(true)(function f9(
            next: Function
        ) {
            next.should.be.a("function");
            return new Promise<boolean>((resolve) => {
                setTimeout(() => {
                    n_f9 += 1; n_f9b += 1; resolve(true); // i.e. *deferred* resolve()
                }, 50);
            });
        });
        {
            n_f9.should.eq(0); f9a();
            n_f9.should.eq(0); f9b();
            n_f9.should.eq(0); f9a();
            n_f9.should.eq(0); f9b();
            n_f9.should.eq(0);
        }
        setTimeout(() => {
            n_f9.should.eq(0);
            n_f9a.should.eq(0);
            n_f9b.should.eq(0);
        }, 0);
        setTimeout(() => {
            n_f9.should.eq(4);
            n_f9a.should.eq(2);
            n_f9b.should.eq(2);
            done();
        }, 250);
    });
    it("should named enqueue:f9 w/a deferred promise & auto:[true, true]; await result", async () => {
        let n_f9 = 0;
        let n_f9a = 0;
        let n_f9b = 0;
        const f9a = queued.auto<boolean>(true)(function f9(
            next: Function
        ) {
            next.should.be.a("function");
            return new Promise<boolean>((resolve) => {
                setTimeout(() => {
                    n_f9 += 1; n_f9a += 1; resolve(true); // i.e. *deferred* resolve()
                }, 50);
            });
        });
        const f9b = queued.auto<boolean>(true)(function f9(
            next: Function
        ) {
            next.should.be.a("function");
            return new Promise<boolean>((resolve) => {
                setTimeout(() => {
                    n_f9 += 1; n_f9b += 1; resolve(true); // i.e. *deferred* resolve()
                }, 50);
            });
        });
        {
            const b1 = await f9a(); b1.should.eq(true); n_f9.should.eq(1);
            const b2 = await f9b(); b2.should.eq(true); n_f9.should.eq(2);
            const b3 = await f9a(); b3.should.eq(true); n_f9.should.eq(3);
            const b4 = await f9b(); b4.should.eq(true); n_f9.should.eq(4);
        }
        return new Promise((resolve) => {
            setTimeout(() => {
                n_f9.should.eq(4);
                n_f9a.should.eq(2);
                n_f9b.should.eq(2);
                resolve();
            }, 250);
        });
    });
});
