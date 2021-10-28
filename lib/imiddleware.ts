import { IO } from "./iinterface";

export enum executeOrder{
    PRE = 0 << 0,
    POST = 0 << 1,
    BOTH = ~(~0 << 2),
}

export interface imiddleware{
    interface: IO
    //@TODO: add support for multi namespaces
    //@TODO: add support for pre-post buisness logic and both
    // so we can run the middleware before the logic, and after the logc for logging or formating
    executeOrder?: executeOrder

    namespace?: string
    fnc: Function
}