import { IO } from "./iinterface";

export interface imiddleware{
    interface: IO
    //@TODO: add support for multi namespaces
    //@TODO: add support for pre-post buisness logic and both
    // so we can run the middleware before the logic, and after the logc for logging or formating
    namespace?: string
    fnc: Function
}