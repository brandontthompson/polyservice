import { IO } from "./iinterface";

export interface iarg{
    name: string
    alias?: string
    desc?: string
    type: string
    format: format
}

export enum format{
    PARAM,
    JSON,
    XML,
    HTML,
    DOC,
}

export enum authType{
    BASIC,
    BEARER,
    BODY,
    HEADER,
    OAUTH2,
    PARAM,
    QUERY_PARAM,
}


export interface imethod{
    interface?: IO
    name: string
    protect?: iauth
    request: string
    alias?: string
    desc?: string
    args: iarg[]
    fnc: Function
}

export interface iauth{
    type: authType
    key?: string
    fnc: Function
}

// @TODO: add option for interface toggles
// expose the interface IO flags so you can have a service not work with 
// some interfaces
// also maybe expand out so we can have methods that are only allowed on some interfaces
// example iserice: IO.MIXED/IO.METHOD
// imethod: IO.cli, IO.web... etc

export interface iservice{
    interface: IO
    name: string
    method: imethod[]
}