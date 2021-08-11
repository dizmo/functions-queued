/* eslint @typescript-eslint/explicit-module-boundary-types: [off] */
/* eslint prefer-spread: [off] */

import { random } from '@dizmo/functions-random';
declare type Promisor<T = any> = (...args: any[]) => Promise<T>;

/**
 * The Queue returns a queue *per* (optional) class name and (optional) function
 * name i.e. two or more different functions with the **same** (class plus) name
 * will be part of the **same** queue!
 */
export class Queue<T> {
    public constructor(options?: {
        auto?: boolean, name?: string, // function name (if any)
        sync?: boolean, lock?: {
            aquire: () => Promise<boolean>,
            release: () => Promise<boolean>
        }
    }) {
        if (options === undefined) {
            options = {};
        }
        this._sync = options.sync ?? true;
        this._auto = options.auto ?? true;
        this._name = options.name ?? '';
        this._lock = options.lock ?? {
            aquire: () => Promise.resolve(true),
            release: () => Promise.resolve(true)
        }
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
                if (result) {
                    if (this._sync) {
                        await this.dequeue();
                    } else {
                        this.dequeue();
                    }
                }
                return result;
            });
            if (this._auto && !this._running) {
                this.dequeue().then((result) => {
                    if (result) resolve(result);
                });
            }
        });
    }
    public async dequeue(): Promise<T | undefined> {
        const head = this._queue?.shift();
        if (head) {
            this._running = true;
        } else {
            this._running = false;
        }
        if (head) {
            if (await this._lock.aquire()) {
                const result = await head();
                await this._lock.release();
                return result;
            }
            this._running = false;
            class QueueError extends Error {}
            throw new QueueError('too busy');
        }
    }
    private _name = '';
    private _sync = true;
    private _auto = false;
    private _running = false;
    private _lock: {
        aquire: () => Promise<boolean>,
        release: () => Promise<boolean>
    }
    private _queue?: Promisor<T>[];
    private static _q: {
        [key: string]: Promisor[]
    } = {};
}
/**
 * Wrap the provided function into a queue where the queue is determined by the
 * name of the function (`fn.name`); dequeueing starts based on the given flag,
 * i.e. whether the latter has value of `true` or `false` -- on each invocation
 * of the wrapped function.
 *
 * @param fn function to enqueue
 * @param options modify dequeueing
 * @returns a queue for the enqueued
 */
 export const auto = <T>(flag: boolean) => (
    fn: Function, options?: {
        sync?: boolean, lock?: {
            aquire: () => Promise<boolean>,
            release: () => Promise<boolean>
        }
    }
) => {
    const queue = new Queue<T>({
        auto: flag, name: fn.name, ...options
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
/**
 * Wrap the provided function into a queue where the queue is determined by the
 * name of the function (`fn.name`); dequeueing starts automatically -- on each
 * invocation of the wrapped function.
 *
 * @param fn function to enqueue
 * @param options modify dequeueing
 * @returns a queue for the enqueued
 */
export const queued = <T>(
    fn: Function, options?: {
        sync?: boolean, lock?: {
            aquire: () => Promise<boolean>,
            release: () => Promise<boolean>
        }
    }
) => {
    return auto<T>(true)(fn, options);
};
queued.auto = auto;
export default queued;
