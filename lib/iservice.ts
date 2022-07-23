// import { IO } from "./iinterface";

export interface iarg{
    name: string
    alias?: string
    desc?: string
    optional?: boolean
    type: string
    format: format
}

export interface methodArg {
    [name:string]:any
    type:string
}

export enum format{
    PARAM,
    QUERY,
    JSON,
    XML,
    TEXT,
    FILE,
}

export enum authType{
    BASIC,
    BEARER,
    BODY,
    CUSTOM,
    HEADER,
    OAUTH2,
    PARAM,
    PARAM_AUTHORIZATION,
    PARAM_BODY,
    QUERY_PARAM,
}

export interface imethod{
    interface?: string
    name: string
    protect?: iauth
    request: string
    alias?: string
    desc?: string
    args: iarg[]
    fnc(...args:any)
}

// export interface ipam{
//     [param:string]:string
// }

export interface iauth{
    type: authType
    key?: string|any
    fnc: Function
}

// @TODO
// expand out so we can have methods that are only allowed on some interfaces
// example iserice: IO.MIXED/IO.METHOD
// imethod: IO.cli, IO.web... etc

export interface iservice{
    interface: string
    version?: string,
    name: string
    method: imethod[]
}