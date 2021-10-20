import { IO } from "./iinterface";

export interface imiddleware{
    interface: IO
    //@TODO: add support for multi namespaces
    namespace?: string
    fnc: Function
}