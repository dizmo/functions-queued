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
    it("should enqueue class method w/a deferred next & auto:[true] (implicit)", (done) => {
        class MyClass {
            constructor(n: number) {
                this.n = n;
            }
            @queued.decorator
            public m1(
                delta: number, next?: Function
            ) {
                delta.should.be.a("number");
                next?.should.be.a("function");
                setTimeout(() => {
                    this.n += delta;
                    if (next) next();
                }, 50);
            }
            public n: number;
        }
        const obj = new MyClass(0);
        obj.m1(1); obj.n.should.eq(0);
        obj.m1(2); obj.n.should.eq(0);
        obj.m1(3); obj.n.should.eq(0);
        setTimeout(() => obj.n.should.eq(6) && done(), 250);
    });
    it("should enqueue class method w/a deferred next & auto:[true] (implicit); await result", async () => {
        class MyClass {
            constructor(n: number) {
                this.n = n;
            }
            @queued.decorator
            public m1(
                delta: number, next?: Function
            ): Promise<number> | void {
                delta.should.be.a("number");
                next?.should.be.a("function");
                setTimeout(() => {
                    this.n += delta;
                    if (next) next(this.n);
                }, 50);
            }
            public n: number;
        }
        const obj = new MyClass(0);
        const n1 = await obj.m1(1); n1?.should.eq(1);
        const n2 = await obj.m1(2); n2?.should.eq(3);
        const n3 = await obj.m1(3); n3?.should.eq(6);
        return new Promise((resolve) => {
            setTimeout(() => obj.n.should.eq(6) && resolve(), 250);
        })
    });
    it("should enqueue class method w/a deferred next & auto:[true]", (done) => {
        class MyClass {
            constructor(n: number) {
                this.n = n;
            }
            @queued.decorator(true)
            public m2(
                delta: number, next?: Function
            ) {
                delta.should.be.a("number");
                next?.should.be.a("function");
                setTimeout(() => {
                    this.n += delta;
                    if (next) next();
                }, 50);
            }
            public n: number;
        }
        const obj = new MyClass(0);
        obj.m2(1); obj.n.should.eq(0);
        obj.m2(2); obj.n.should.eq(0);
        obj.m2(3); obj.n.should.eq(0);
        setTimeout(() => obj.n.should.eq(6) && done(), 250);
    });
    it("should enqueue class method w/a deferred next & auto:[true]; await result", async () => {
        class MyClass {
            constructor(n: number) {
                this.n = n;
            }
            @queued.decorator<number>(true)
            public m2(
                delta: number, next?: Function
            ): Promise<number> | void {
                delta.should.be.a("number");
                next?.should.be.a("function");
                setTimeout(() => {
                    this.n += delta;
                    if (next) next(this.n);
                }, 50);
            }
            public n: number;
        }
        const obj = new MyClass(0);
        const n1 = await obj.m2(1); n1?.should.eq(1);
        const n2 = await obj.m2(2); n2?.should.eq(3);
        const n3 = await obj.m2(3); n3?.should.eq(6);
        return new Promise((resolve) => {
            setTimeout(() => obj.n.should.eq(6) && resolve(), 250);
        });
    });
    it("should enqueue class method w/a deferred next & auto:[false]", (done) => {
        class MyClass {
            constructor(n: number) {
                this.n = n;
            }
            @queued.decorator(false)
            public m3(
                delta: number, next?: Function
            ) {
                delta.should.be.a("number");
                next?.should.be.a("function");
                setTimeout(() => {
                    this.n += delta;
                    if (next) next();
                }, 50);
            }
            public n: number;
        }
        const obj = new MyClass(0);
        obj.m3(1); obj.n.should.eq(0);
        obj.m3(2); obj.n.should.eq(0);
        obj.m3(3); obj.n.should.eq(0);
        (obj.m3 as unknown as { next: Function }).next();
        setTimeout(() => obj.n.should.eq(6) && done(), 250);
    });
    it("should enqueue class method w/a deferred next & auto:[false]; await result", async () => {
        class MyClass {
            constructor(n: number) {
                this.n = n;
            }
            @queued.decorator(false)
            public m3(
                delta: number, next?: Function
            ): Promise<number> | void {
                delta.should.be.a("number");
                next?.should.be.a("function");
                setTimeout(() => {
                    this.n += delta;
                    if (next) next(this.n);
                }, 50);
            }
            public n: number;
        }
        const obj = new MyClass(0);
        obj.m3(1); const n1 = await (obj.m3 as unknown as { next: Function }).next(); n1?.should.eq(1);
        obj.m3(2); const n2 = await (obj.m3 as unknown as { next: Function }).next(); n2?.should.eq(3);
        obj.m3(3); const n3 = await (obj.m3 as unknown as { next: Function }).next(); n3?.should.eq(6);
        return new Promise((resolve) => {
            setTimeout(() => obj.n.should.eq(6) && resolve(), 250);
        });
    });
});
