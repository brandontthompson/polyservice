import { IO } from "./iinterface";

export interface iarg{
    name: string
    alias?: string
    desc?: string
    optional?: boolean
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
    CUSTOM,
    HEADER,
    OAUTH2,
    PARAM,
    PARAM_AUTHORIZATION,
    PARAM_BODY,
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
    key?: string|any
    fnc: Function
}

// @TODO
// expand out so we can have methods that are only allowed on some interfaces
// example iserice: IO.MIXED/IO.METHOD
// imethod: IO.cli, IO.web... etc

export interface iservice{
    interface: IO
    version?: string,
    name: string
    method: imethod[]
}