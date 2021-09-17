export enum IO {
    None = 0,
    CLI = 1 << 0,
    SOC = 1 << 2,
    WEB = 1 << 3,
    ALL = ~(~0 << 4),
}

export interface iinterface{
    identifier:IO
    name: string, 
    init: Function,
    bind: Function,
    middleware: Function,
}