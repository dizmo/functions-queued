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
    it("should enqueue w/a (pseudo)-lock & sync:[true]", (done) => {
        let n_f0 = 0;
        const f0 = queued((
            number: number, next: Function
        ) => {
            number.should.be.a("number");
            next.should.be.a("function");
            setTimeout(() => {
                n_f0 += number; next(); // i.e. *deferred* next
            }, 50);
        }, {
            sync: true,
            lock: {
                acquire: () => Promise.resolve(true),
                release: () => Promise.resolve(true)
            }
        });
        {
            f0(1);
            f0(2);
            f0(3);
        }
        setTimeout(() => n_f0.should.eq(6) && done(), 250);
    });
    it("should enqueue w/a (pseudo)-lock & sync:[false]", (done) => {
        let n_f1 = 0;
        const f1 = queued((
            number: number, next: Function
        ) => {
            number.should.be.a("number");
            next.should.be.a("function");
            setTimeout(() => {
                n_f1 += number; next(); // i.e. *deferred* next
            }, 50);
        }, {
            sync: false,
            lock: {
                acquire: () => Promise.resolve(true),
                release: () => Promise.resolve(true)
            }
        });
        {
            f1(1);
            f1(2);
            f1(3);
        }
        setTimeout(() => n_f1.should.eq(6) && done(), 250);
    });
});