/* eslint @typescript-eslint/no-this-alias: [off] */
import { auto } from "./queued";

/**
 * Queues class methods (or functions), and then starts dequeueing them for
 * invocation in the same sequence has they have been enqueued.
 *
 * @param auto flag to start auto dequeueing (defaults to `true`)
 */
export function decorator(
    auto?: boolean,
): MethodDecorator;
/** @ignore */
export function decorator(
    target: any, key: string | symbol, dtor?: PropertyDescriptor
): PropertyDescriptor | void;
/** @ignore */
export function decorator(
    arg: boolean | any, key?: string | symbol, dtor?: PropertyDescriptor
): MethodDecorator | PropertyDescriptor | void {
    if (typeof arg === 'boolean') {
        return _decorator(arg);
    } else {
        return _decorator(true)(
            arg as any, key as string | symbol, dtor as PropertyDescriptor
        );
    }
}
function _decorator(flag?: boolean): MethodDecorator {
    return (
        target: any, key: string | symbol, dtor?: PropertyDescriptor,
    ): PropertyDescriptor | void => {
        if (dtor) {
            dtor.value = auto(flag ?? true)(dtor.value);
            return dtor;
        } else {
            target[key] = auto(flag ?? true)(target[key]);
        }
    };
}
export default decorator;