export enum IO {
    None = 0,
    CLI = 1 << 0,
    WEB = 1 << 1,
    SOC = 1 << 2,
    ALL = ~(~0 << 3),
}

export interface iinterface{
    identifier: IO
    name: string
    init: Function
    bind: Function
    middleware: Function
}