import { IO } from "./iinterface";

export interface imiddleware{
    interface: IO
    namespace?: string
    fnc: Function
}