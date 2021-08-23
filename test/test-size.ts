import { queued, QueueError } from "../lib";
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
    it("should *not* enqueue w/a max. size of 0", (done) => {
        let n_f0 = 0;
        const f0 = queued((
            number: number, next: Function
        ) => {
            number.should.be.a("number");
            next.should.be.a("function");
            setTimeout(() => {
                n_f0 += number; next(); // i.e. *deferred* next
            }, 1);
        }, {
            size: 0
        });
        {
            f0.bind(0).should.throw(QueueError, /full/);
        }
        setTimeout(() => n_f0.should.eq(0) && done(), 250);
    });
    it("should *not* enqueue w/a max. size of 1", (done) => {
        let n_f0 = 0;
        const f0 = queued((
            number: number, next: Function
        ) => {
            number.should.be.a("number");
            next.should.be.a("function");
            setTimeout(() => {
                n_f0 += number; next(); // i.e. *deferred* next
            }, 1);
        }, {
            size: 1
        });
        {
            f0.bind(0).should.throw(QueueError, /full/);
        }
        setTimeout(() => n_f0.should.eq(0) && done(), 250);
    });
    it("should *not* enqueue aft max. size of 2", (done) => {
        let n_f0 = 0;
        const f0 = queued((
            number: number, next: Function
        ) => {
            number.should.be.a("number");
            next.should.be.a("function");
            setTimeout(() => {
                n_f0 += number; next(); // i.e. *deferred* next
            }, 1);
        }, {
            size: 2
        });
        {
            f0(1);
            f0(2);
            f0.bind(3).should.throw(QueueError, /full/);
        }
        setTimeout(() => n_f0.should.eq(3) && done(), 250);
    });
    it("should *not* enqueue aft max. size of 3", (done) => {
        let n_f0 = 0;
        const f0 = queued((
            number: number, next: Function
        ) => {
            number.should.be.a("number");
            next.should.be.a("function");
            setTimeout(() => {
                n_f0 += number; next(); // i.e. *deferred* next
            }, 1);
        }, {
            size: 3
        });
        {
            f0(1);
            f0(2);
            f0(3);
            f0.bind(4).should.throw(QueueError, /full/);
        }
        setTimeout(() => n_f0.should.eq(6) && done(), 250);
    });
    it("should *not* enqueue aft max. size of 4", (done) => {
        let n_f0 = 0;
        const f0 = queued((
            number: number, next: Function
        ) => {
            number.should.be.a("number");
            next.should.be.a("function");
            setTimeout(() => {
                n_f0 += number; next(); // i.e. *deferred* next
            }, 1);
        }, {
            size: 4
        });
        {
            f0(1);
            f0(2);
            f0(3);
            f0(4);
            f0.bind(5).should.throw(QueueError, /full/);
        }
        setTimeout(() => n_f0.should.eq(10) && done(), 250);
    });
    it("should *not* enqueue aft max. size of 5", (done) => {
        let n_f0 = 0;
        const f0 = queued((
            number: number, next: Function
        ) => {
            number.should.be.a("number");
            next.should.be.a("function");
            setTimeout(() => {
                n_f0 += number; next(); // i.e. *deferred* next
            }, 1);
        }, {
            size: 5
        });
        {
            f0(1);
            f0(2);
            f0(3);
            f0(4);
            f0(5);
            f0.bind(6).should.throw(QueueError, /full/);
        }
        setTimeout(() => n_f0.should.eq(15) && done(), 250);
    });
});
