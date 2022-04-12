// export enum IO {
//     None = 0,
//     CLI = 1 << 0,
//     WEB = 1 << 1,
//     SOC = 1 << 2,
//     ALL = ~(~0 << 3),
// }
//
// interface I0 {
//     [name:string]: number
// }

export interface iinterface{
    identifier: string
    name: string
    init: Function
    bind: Function
    middleware: Function
}

export function instanceOfInterface(object:any): object is iinterface {
    return 'identifier' in object;
}