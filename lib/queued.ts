/* eslint @typescript-eslint/explicit-module-boundary-types: [off] */
/* eslint prefer-spread: [off] */

import { random } from "@dizmo/functions-random";
declare type Promisor<T = any> = (...args: any[]) => Promise<T>;

/**
 * The Queue returns a queue *per* (optional) class name and (optional) function
 * name i.e. two or more different functions with the **same** (class plus) name
 * will be part of the **same** queue!
 */
export class Queue<T> {
    public constructor(options: {
        auto?: boolean, name?: string // function name (if any)
    }) {
        if (options === undefined) {
            options = {};
        }
        this._auto = options.auto ?? true;
        this._name = options.name ?? '';
    }
    public enqueue(callback: Promisor<T>, options: {
        name?: string // class name (if any)
    }) {
        if (this._queue === undefined) {
            const name = options.name && this._name
                ? `${options.name}.${this._name}` : this._name
                ? `${this._name}` : random(8);
            if (Queue._q[name] === undefined) {
                Queue._q[name] = [];
            }
            this._queue = Queue._q[name];
        }
        return new Promise<T>((resolve) => {
            this._queue?.push(async () => {
                const result = await callback();
                if (result) this.dequeue();
                return result;
            });
            if (this._auto && !this._running) {
                const result = this.dequeue();
                if (result) resolve(result);
            }
        });
    }
    public dequeue() {
        this._running = false;
        const shift = this._queue?.shift();
        if (shift) {
            this._running = true;
            return shift();
        }
    }
    private _name = '';
    private _auto = false;
    private _running = false;
    private _queue?: Promisor<T>[];
    private static _q: {
        [key: string]: Promisor[]
    } = {};
}
export const auto = <T>(flag: boolean) => (
    fn: Function
) => {
    const queue = new Queue<T>({
        auto: flag, name: fn.name
    });
    const queuer = function (
        this: any, ...args: any[]
    ) {
        const wrapped = () => new Promise<T>((resolve) => {
            const result = fn.apply(
                this, args.concat([(arg_result: T) => {
                    if (arg_result) {
                        resolve(arg_result);
                    }
                    queue.dequeue();
                }])
            );
            if (result) {
                resolve(result);
            }
        });
        return queue.enqueue(wrapped, {
            name: this?.constructor?.name
        });
    };
    queuer.next = () => {
        return queue.dequeue();
    };
    return queuer;
};
export const queued = <T>(
    fn: Function
) => {
    return auto<T>(true)(fn);
};
queued.auto = auto;
export default queued;
