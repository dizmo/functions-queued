export declare class Queue {
    constructor(options: {
        auto?: boolean;
        name?: string;
    });
    enqueue(callback: Function): this;
    dequeue(): Function | undefined;
    private _name;
    private _auto;
    private _running;
    private _queue;
    private static _q;
}
export declare const auto: (flag: boolean) => (fn: Function, ...functions: Function[]) => {
    (...args: any[]): void;
    next(): void;
};
export declare const queued: {
    (fn: Function, ...functions: Function[]): {
        (...args: any[]): void;
        next(): void;
    };
    auto: (flag: boolean) => (fn: Function, ...functions: Function[]) => {
        (...args: any[]): void;
        next(): void;
    };
};
export default queued;
//# sourceMappingURL=index.d.ts.map