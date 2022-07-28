// import { IO } from "./iinterface";

export enum executeOrder{
    PRE = 1 << 0,
    POST = 1 << 1,
    BOTH = ~(~0 << 2),
}

export interface imiddleware{
    interface: string
    //@TODO: add support for multi namespaces
    //@TODO: add support for pre-post buisness logic and both
    // so we can run the middleware before the logic, and after the logc for logging or formating
    executeOrder?: executeOrder

    namespace?: string
    fnc: Function
}