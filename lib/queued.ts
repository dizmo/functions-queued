/* eslint @typescript-eslint/explicit-module-boundary-types: [off] */
/* eslint prefer-spread: [off] */

import { random } from "@dizmo/functions-random";

/**
 * The Queue returns a queue *per* (optional) class name and (optional) function
 * name i.e. two or more different functions with the **same** (class plus) name
 * will be part of the **same** queue!
 */
export class Queue {
    public constructor(options: {
        auto?: boolean, name?: string // function name (if any)
    }) {
        if (options === undefined) {
            options = {};
        }
        this._auto = options.auto ?? true;
        this._name = options.name ?? '';
    }
    public async enqueue(callback: Function, options: {
        name?: string // class name (if any)
    }) {
        if (this._queue === undefined) {
            const name = options.name && this._name
                ? `${options.name}.${this._name}`
                : this._name ? `${this._name}`
                : random(8);
            if (Queue._q[name] === undefined) {
                Queue._q[name] = [];
            }
            this._queue = Queue._q[name];
        }
        this._queue.push(async () => {
            if (await callback()) {
                await this.dequeue();
            }
        });
        if (this._auto && !this._running) {
            await this.dequeue();
        }
        return this;
    }
    public async dequeue() {
        this._running = false;
        const shift = this._queue?.shift();
        if (shift) {
            this._running = true;
            await shift();
        }
        return shift;
    }
    private _name = '';
    private _auto = false;
    private _running = false;
    private _queue?: Function[];
    private static _q: { [key: string]: Function[] } = {};
}
export const auto = (flag: boolean) => (
    fn: Function
) => {
    const q = new Queue({
        auto: flag, name: fn.name
    });
    const qn = async function (
        this: any, ...args: any[]
    ) {
        return await q.enqueue(() => fn.apply(this, args.concat([
            async () => await q.dequeue()
        ])), {
            name: this?.constructor?.name
        });
    };
    qn.next = async () => {
        await q.dequeue();
    };
    return qn;
};
export const queued = (
    fn: Function
) => {
    return auto(true)(fn);
};
queued.auto = auto;
export default queued;
