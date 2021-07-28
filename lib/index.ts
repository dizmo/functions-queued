import { decorator as _decorator } from "./decorator";
import { queued as _queued } from "./queued";

declare type TDecorator = typeof _decorator;
declare type TQueued = typeof _queued;

export const queued = (() => {
    (_queued as any).decorator = _decorator;
    return _queued as TQueued & {
        decorator: TDecorator
    };
})();
export default queued;
