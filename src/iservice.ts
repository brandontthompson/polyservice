export interface iarg{
    name: string,
    alias: string,
    desc: string,
    type: string,
    format: format
}

export enum format{
    PARAM,
    JSON,
    XML,
    HTML,
    DOC,
}

export interface imethod{
    name: string,
    request: string,
    alias: string,
    desc: string,
    args: iarg[],
    fnc: Function,
}


// @TODO: add option for interface toggles
// expose the interface IO flags so you can have a service not work with 
// some interfaces
// also maybe expand out so we can have methods that are only allowed on some interfaces
// example iserice: IO.MIXED/IO.METHOD
// imethod: IO.cli, IO.web... etc

export interface iservice{
    name: string,
    method: imethod[],
}