/* eslint @typescript-eslint/explicit-module-boundary-types: [off] */
/* eslint prefer-spread: [off] */

import { random } from "@dizmo/functions-random";

export class Queue {
    public constructor(options: {
        auto?: boolean,
        name?: string
    }) {
        if (options === undefined) {
            options = {};
        }
        this._auto = options.auto !== undefined
            ? options.auto : true;
        this._name = options.name
            ? options.name : random(8);
        if (Queue._q[this._name] === undefined) {
            Queue._q[this._name] = [];
        }
        this._queue = Queue._q[this._name];
    }
    public enqueue(callback: Function) {
        this._queue.push(() => {
            if (callback()) { this.dequeue(); }
        });
        if (this._auto && !this._running) {
            this.dequeue();
        }
        return this;
    }
    public dequeue() {
        this._running = false;
        const shift = this._queue.shift();
        if (shift) {
            this._running = true;
            shift();
        }
        return shift;
    }
    private _name = "";
    private _auto = false;
    private _running = false;
    private _queue: Function[] = [];
    private static _q: { [key: string]: Function[] } = {};
}
export const auto = (flag: boolean) => (
    fn: Function, ...functions: Function[]
) => {
    const q = new Queue({
        auto: flag, name: fn.name
    });
    const qn = (...args: any[]) => {
        q.enqueue(() => fn.apply(null, args.concat([
            () => q.dequeue()
        ])));
        for (const fi of functions) {
            q.enqueue(() => fi.apply(null, args.concat([
                () => q.dequeue()
            ])));
        }
    };
    qn.next = () => {
        q.dequeue();
    };
    return qn;
};
export const queued = (
    fn: Function, ...functions: Function[]
) => {
    return auto(true).call(null, fn, ...functions);
};
queued.auto = auto;
export default queued;
