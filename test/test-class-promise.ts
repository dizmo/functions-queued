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
    it("should enqueue class method w/a deferred promise & auto:[true] (implicit)", (done) => {
        class MyClass {
            constructor(n: number) {
                this.n = n;
            }
            @queued.decorator
            public m4(
                delta: number
            ) {
                delta.should.be.a("number");
                return new Promise<boolean>((resolve) => {
                    setTimeout(() => {
                        this.n += delta;
                        resolve(true);
                    }, 50);
                })
            }
            public n: number;
        }
        const obj = new MyClass(0);
        obj.m4(1); obj.n.should.eq(0);
        obj.m4(2); obj.n.should.eq(0);
        obj.m4(3); obj.n.should.eq(0);
        setTimeout(() => obj.n.should.eq(6) && done(), 250);
    });
    it("should enqueue class method w/a deferred promise & auto:[true] (implicit); await result", async () => {
        class MyClass {
            constructor(n: number) {
                this.n = n;
            }
            @queued.decorator
            public m4(
                delta: number
            ) {
                delta.should.be.a("number");
                return new Promise<boolean>((resolve) => {
                    setTimeout(() => {
                        this.n += delta;
                        resolve(true);
                    }, 50);
                })
            }
            public n: number;
        }
        const obj = new MyClass(0);
        const b1 = await obj.m4(1); b1.should.eq(true); obj.n.should.eq(1);
        const b2 = await obj.m4(2); b2.should.eq(true); obj.n.should.eq(3);
        const b3 = await obj.m4(3); b3.should.eq(true); obj.n.should.eq(6);
        return new Promise((resolve) => {
            setTimeout(() => obj.n.should.eq(6) && resolve(), 250);
        })
    });
    it("should enqueue class method w/a deferred promise & auto:[true]", (done) => {
        class MyClass {
            constructor(n: number) {
                this.n = n;
            }
            @queued.decorator(true)
            public m5(
                delta: number
            ) {
                delta.should.be.a("number");
                return new Promise<boolean>((resolve) => {
                    setTimeout(() => {
                        this.n += delta;
                        resolve(true);
                    }, 50);
                })
            }
            public n: number;
        }
        const obj = new MyClass(0);
        obj.m5(1); obj.n.should.eq(0);
        obj.m5(2); obj.n.should.eq(0);
        obj.m5(3); obj.n.should.eq(0);
        setTimeout(() => obj.n.should.eq(6) && done(), 250);
    });
    it("should enqueue class method w/a deferred promise & auto:[true]; await result", async () => {
        class MyClass {
            constructor(n: number) {
                this.n = n;
            }
            @queued.decorator(true)
            public m5(
                delta: number
            ) {
                delta.should.be.a("number");
                return new Promise<boolean>((resolve) => {
                    setTimeout(() => {
                        this.n += delta;
                        resolve(true);
                    }, 50);
                })
            }
            public n: number;
        }
        const obj = new MyClass(0);
        const b1 = await obj.m5(1); b1.should.eq(true); obj.n.should.eq(1);
        const b2 = await obj.m5(2); b2.should.eq(true); obj.n.should.eq(3);
        const b3 = await obj.m5(3); b3.should.eq(true); obj.n.should.eq(6);
        return new Promise((resolve) => {
            setTimeout(() => obj.n.should.eq(6) && resolve(), 250);
        });
    });
    it("should enqueue class method w/a deferred promise & auto:[false]", (done) => {
        class MyClass {
            constructor(n: number) {
                this.n = n;
            }
            @queued.decorator(false)
            public m6(
                delta: number
            ) {
                delta.should.be.a("number");
                return new Promise<number>((resolve) => {
                    setTimeout(() => {
                        this.n += delta;
                        resolve(this.n);
                    }, 50);
                });
            }
            public n: number;
        }
        const obj = new MyClass(0);
        obj.m6(1); obj.n.should.eq(0);
        obj.m6(2); obj.n.should.eq(0);
        obj.m6(3); obj.n.should.eq(0);
        (obj.m6 as unknown as { next: Function }).next();
        setTimeout(() => obj.n.should.eq(6) && done(), 250);
    });
    it("should enqueue class method w/a deferred promise & auto:[false]; await result", async () => {
        class MyClass {
            constructor(n: number) {
                this.n = n;
            }
            @queued.decorator(false)
            public m6(
                delta: number
            ) {
                delta.should.be.a("number");
                return new Promise<number>((resolve) => {
                    setTimeout(() => {
                        this.n += delta;
                        resolve(this.n);
                    }, 50);
                });
            }
            public n: number;
        }
        const obj = new MyClass(0);
        obj.m6(1); const n1 = await (obj.m6 as unknown as { next: Function }).next(); n1?.should.eq(1);
        obj.m6(2); const n2 = await (obj.m6 as unknown as { next: Function }).next(); n2?.should.eq(3);
        obj.m6(3); const n3 = await (obj.m6 as unknown as { next: Function }).next(); n3?.should.eq(6);
        return new Promise((resolve) => {
            setTimeout(() => obj.n.should.eq(6) && resolve(), 250);
        });
    });
});
