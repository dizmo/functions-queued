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
    it("should enqueue w/a deferred next & auto:[true]", (done) => {
        let n_f0 = 0;
        const f0 = queued((
            number: number, next: Function
        ) => {
            number.should.be.a("number");
            next.should.be.a("function");
            setTimeout(() => {
                n_f0 += number; next(); // i.e. *deferred* next
            }, 50);
        });
        {
            f0(1);
            f0(2);
            f0(3);
        }
        setTimeout(() => n_f0.should.eq(6) && done(), 250);
    });
    it("should enqueue w/a deferred next & auto:[true]; await result", async () => {
        let n_f0 = 0;
        const f0 = queued<number>((
            number: number, next: Function
        ) => {
            number.should.be.a("number");
            next.should.be.a("function");
            setTimeout(() => {
                n_f0 += number; next(n_f0); // i.e. *deferred* next
            }, 50);
        });
        {
            const n1 = await f0(1); n1.should.eq(1);
            const n2 = await f0(2); n2.should.eq(3);
            const n3 = await f0(3); n3.should.eq(6);
        }
        return new Promise((resolve) => {
            setTimeout(() => n_f0.should.eq(6) && resolve(), 250);
        });
    });
    it("should enqueue w/a deferred next & auto:[true] w/2 functions", (done) => {
        let n_f1 = 0;
        const f1a = queued.auto(true)(function f1(
            next: Function
        ) {
            next.should.be.a("function");
            setTimeout(() => {
                n_f1 += 1; next(); // i.e. *deferred* next
            }, 25);
        });
        const f1b = queued.auto(true)(function f1(
            next: Function
        ) {
            next.should.be.a("function");
            setTimeout(() => {
                n_f1 += 1; next(); // i.e. *deferred* next
            }, 25);
        });
        {
            f1a();
            f1b();
            f1a();
            f1b();
            f1a();
            f1b();
        }
        setTimeout(() => n_f1.should.eq(6) && done(), 250);
    });
    it("should enqueue w/a deferred next & auto:[true] w/2 functions; await result", async () => {
        let n_f1 = 0;
        const f1a = queued.auto<number>(true)(function f1(
            next: Function
        ) {
            next.should.be.a("function");
            setTimeout(() => {
                n_f1 += 1; next(n_f1); // i.e. *deferred* next
            }, 25);
        });
        const f1b = queued.auto<number>(true)(function f1(
            next: Function
        ) {
            next.should.be.a("function");
            setTimeout(() => {
                n_f1 += 1; next(n_f1); // i.e. *deferred* next
            }, 25);
        });
        {
            const n1 = await f1a(); n1.should.eq(1);
            const n2 = await f1b(); n2.should.eq(2);
            const n3 = await f1a(); n3.should.eq(3);
            const n4 = await f1b(); n4.should.eq(4);
            const n5 = await f1a(); n5.should.eq(5);
            const n6 = await f1b(); n6.should.eq(6);
        }
        return new Promise((resolve) => {
            setTimeout(() => n_f1.should.eq(6) && resolve(), 250);
        });
    });
    it("should enqueue w/a deferred next & auto:[false]", (done) => {
        let n_f2 = 0;
        const f2 = queued.auto(false)((next: Function) => {
            next.should.be.a("function");
            setTimeout(() => {
                n_f2 += 1; next(); // i.e. *deferred* next
            }, 50);
        });
        {
            f2();
            f2();
            f2();
            f2.next();
        }
        setTimeout(() => n_f2.should.eq(3) && done(), 250);
    });
    it("should enqueue w/a deferred next & auto:[false]; await result", async () => {
        let n_f2 = 0;
        const f2 = queued.auto<number>(false)((next: Function) => {
            next.should.be.a("function");
            setTimeout(() => {
                n_f2 += 1; next(n_f2); // i.e. *deferred* next
            }, 50);
        });
        {
            f2(); const n1 = await f2.next(); n1?.should.eq(1);
            f2(); const n2 = await f2.next(); n2?.should.eq(2);
            f2(); const n3 = await f2.next(); n3?.should.eq(3);
        }
        return new Promise((resolve) => {
            setTimeout(() => n_f2.should.eq(3) && resolve(), 250);
        });
    });
});
describe("queued", () => {
    it("should enqueue w/an immediate next & auto:[true]", (done) => {
        let n_f3 = 0;
        const f3 = queued.auto(true)((next: Function) => {
            next.should.be.a("function");
            setTimeout(() => {
                n_f3 += 1; // i.e. *w/o* deferred next
            }, 50);
            return true; // i.e. *immediate* next
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
    it("should enqueue w/an immediate next & auto:[true]; await result", async () => {
        let n_f3 = 0;
        const f3 = queued.auto<boolean>(true)((next: Function) => {
            next.should.be.a("function");
            setTimeout(() => {
                n_f3 += 1; // i.e. *w/o* deferred next
            }, 50);
            return true; // i.e. *immediate* next
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
    it("should enqueue w/an immediate next & auto:[false]", (done) => {
        let n_f4 = 0;
        const f4 = queued.auto(false)(() => {
            setTimeout(() => {
                n_f4 += 1; // i.e. *w/o* deferred next
            }, 50);
            return true; // i.e. *immediate* next
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
    it("should enqueue w/an immediate next & auto:[false]; await result", async () => {
        let n_f4 = 0;
        const f4 = queued.auto<boolean>(false)(() => {
            setTimeout(() => {
                n_f4 += 1; // i.e. *w/o* deferred next
            }, 50);
            return true; // i.e. *immediate* next
        });
        {
            f4(); const b1 = await f4.next(); b1?.should.eq(true); n_f4.should.eq(0);
            f4(); const b2 = await f4.next(); b2?.should.eq(true); n_f4.should.eq(0);
            f4(); const b3 = await f4.next(); b3?.should.eq(true); n_f4.should.eq(0);
        }
        return new Promise((resolve) => {
            setTimeout(() => n_f4.should.eq(3) && resolve(), 250);
        });
    });
});
describe("queued", () => {
    it("should named enqueue:f6 w/a deferred next & auto:[false, false]", (done) => {
        let n_f6 = 0;
        let n_f6a = 0;
        let n_f6b = 0;
        const f6a = queued.auto(false)(function f6(
            next: Function
        ) {
            next.should.be.a("function");
            setTimeout(() => {
                n_f6 += 1; n_f6a += 1; next(); // i.e. *deferred* next
            }, 50);
        });
        const f6b = queued.auto(false)(function f6(
            next: Function
        ) {
            next.should.be.a("function");
            setTimeout(() => {
                n_f6 += 1; n_f6b += 1; next(); // i.e. *deferred* next
            }, 50);
        });
        {
            n_f6.should.eq(0); f6a();
            n_f6.should.eq(0); f6b();
            n_f6.should.eq(0); f6a();
            n_f6.should.eq(0); f6b();
            n_f6.should.eq(0); f6b.next();
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
    it("should named enqueue:f6 w/a deferred next & auto:[false, false]; await result", async () => {
        let n_f6 = 0;
        let n_f6a = 0;
        let n_f6b = 0;
        const f6a = queued.auto<number>(false)(function f6(
            next: Function
        ) {
            next.should.be.a("function");
            setTimeout(() => {
                n_f6 += 1; n_f6a += 1; next(n_f6); // i.e. *deferred* next
            }, 50);
        });
        const f6b = queued.auto<number>(false)(function f6(
            next: Function
        ) {
            next.should.be.a("function");
            setTimeout(() => {
                n_f6 += 1; n_f6b += 1; next(n_f6); // i.e. *deferred* next
            }, 50);
        });
        {
            f6a(); const n1 = await f6a.next(); n1?.should.eq(1);
            f6b(); const n2 = await f6b.next(); n2?.should.eq(2);
            f6a(); const n3 = await f6a.next(); n3?.should.eq(3);
            f6b(); const n4 = await f6b.next(); n4?.should.eq(4);
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
    it("should named enqueue:f7 w/a deferred next & auto:[false, true]", (done) => {
        let n_f7 = 0;
        let n_f7a = 0;
        let n_f7b = 0;
        const f7a = queued.auto<number>(false)(function f7(
            next: Function
        ) {
            next.should.be.a("function");
            setTimeout(() => {
                n_f7 += 1; n_f7a += 1; next(n_f7); // i.e. *deferred* next
            }, 50);
        });
        const f7b = queued.auto<number>(true)(function f7(
            next: Function
        ) {
            next.should.be.a("function");
            setTimeout(() => {
                n_f7 += 1; n_f7b += 1; next(n_f7); // i.e. *deferred* next
            }, 50);
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
    it("should named enqueue:f7 w/a deferred next & auto:[false, true]; await result", async () => {
        let n_f7 = 0;
        let n_f7a = 0;
        let n_f7b = 0;
        const f7a = queued.auto<number>(false)(function f7(
            next: Function
        ) {
            next.should.be.a("function");
            setTimeout(() => {
                n_f7 += 1; n_f7a += 1; next(n_f7); // i.e. *deferred* next
            }, 50);
        });
        const f7b = queued.auto<number>(true)(function f7(
            next: Function
        ) {
            next.should.be.a("function");
            setTimeout(() => {
                n_f7 += 1; n_f7b += 1; next(n_f7); // i.e. *deferred* next
            }, 50);
        });
        {
            f7a(); const n1 = await f7a.next(); n1?.should.eq(1);
            const n2 = await f7b(); n2.should.eq(2);
            f7a(); const n3 = await f7a.next(); n3?.should.eq(3);
            const n4 = await f7b(); n4.should.eq(4);
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
    it("should named enqueue:f8 w/a deferred next & auto:[true, false]", (done) => {
        let n_f8 = 0;
        let n_f8a = 0;
        let n_f8b = 0;
        const f8a = queued.auto(true)(function f8(
            next: Function
        ) {
            next.should.be.a("function");
            setTimeout(() => {
                n_f8 += 1; n_f8a += 1; next(); // i.e. *deferred* next
            }, 50);
        });
        const f8b = queued.auto(false)(function f8(
            next: Function
        ) {
            next.should.be.a("function");
            setTimeout(() => {
                n_f8 += 1; n_f8b += 1; next(); // i.e. *deferred* next
            }, 50);
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
    it("should named enqueue:f8 w/a deferred next & auto:[true, false]; await result", async () => {
        let n_f8 = 0;
        let n_f8a = 0;
        let n_f8b = 0;
        const f8a = queued.auto<number>(true)(function f8(
            next: Function
        ) {
            next.should.be.a("function");
            setTimeout(() => {
                n_f8 += 1; n_f8a += 1; next(n_f8); // i.e. *deferred* next
            }, 50);
        });
        const f8b = queued.auto<number>(false)(function f8(
            next: Function
        ) {
            next.should.be.a("function");
            setTimeout(() => {
                n_f8 += 1; n_f8b += 1; next(n_f8); // i.e. *deferred* next
            }, 50);
        });
        {
            const n1 = await f8a(); n1.should.eq(1);
            f8b(); const n2 = await f8b.next(); n2?.should.eq(2);
            const n3 = await f8a(); n3.should.eq(3);
            f8b(); const n4 = await f8b.next(); n4?.should.eq(4);
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
    it("should named enqueue:f9 w/a deferred next & auto:[true, true]", (done) => {
        let n_f9 = 0;
        let n_f9a = 0;
        let n_f9b = 0;
        const f9a = queued.auto(true)(function f9(
            next: Function
        ) {
            next.should.be.a("function");
            setTimeout(() => {
                n_f9 += 1; n_f9a += 1; next(); // i.e. *deferred* next
            }, 50);
        });
        const f9b = queued.auto(true)(function f9(
            next: Function
        ) {
            next.should.be.a("function");
            setTimeout(() => {
                n_f9 += 1; n_f9b += 1; next(); // i.e. *deferred* next
            }, 50);
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
    it("should named enqueue:f9 w/a deferred next & auto:[true, true]; await result", async () => {
        let n_f9 = 0;
        let n_f9a = 0;
        let n_f9b = 0;
        const f9a = queued.auto<number>(true)(function f9(
            next: Function
        ) {
            next.should.be.a("function");
            setTimeout(() => {
                n_f9 += 1; n_f9a += 1; next(n_f9); // i.e. *deferred* next
            }, 50);
        });
        const f9b = queued.auto<number>(true)(function f9(
            next: Function
        ) {
            next.should.be.a("function");
            setTimeout(() => {
                n_f9 += 1; n_f9b += 1; next(n_f9); // i.e. *deferred* next
            }, 50);
        });
        {
            f9a(); const n1 = await f9a.next(); n1?.should.eq(1);
            f9b(); const n2 = await f9b.next(); n2?.should.eq(2);
            f9a(); const n3 = await f9a.next(); n3?.should.eq(3);
            f9b(); const n4 = await f9b.next(); n4?.should.eq(4);
        }
        return new Promise((resolve) => {
            setTimeout(() => {
                n_f9.should.eq(4);
                n_f9a.should.eq(2);
                n_f9b.should.eq(2);
                resolve();
            }, 250);
        })
    });
});
