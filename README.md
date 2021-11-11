# service
a framework for building microservice applications allowing developers to focus on building business logic not IO interfaces

This framework is still under construction

## url construction 
* hostname / HTTP_PORT / API_BASE / service.name / service.version / method.name / :params
* hostname / HTTP_PORT / service.name / service.version / method.name
* hostname / HTTP_PORT / API_BASE / service.name / method.name
* hostname / HTTP_PORT / service.name / method.name
* example.com:3000/api/testservice/service_version/method_name/:params
* 

## interfaces
```

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

export interface iservice{
    interface: IO
    version?: string,
    name: string
    method: imethod[]
}
```

## Env variables 

API_BASE=api // used to build the url for web io
HTTP_PORT=3000 // web port for sock and http
HTTP_CERT= // path to https cert - if set httplistener will attempt to use https
HTTP_KEY= // path to https key - if set httplistener will attempt to use https

## example entry point
```
import { service } from '../index';
(() => {
    service.register(require('./testservice').test);
    service.use(require('./middleware.test').testmiddleware);
    service.init();

})();

```
## example service
```
const postPrint:imethod = {
    name: "print",
    request: "POST",
    alias: "",
    desc: "",
    args: [
        {
            name: "value",
            alias: "",
            desc: "",
            type: "string",
            format: format.JSON,
        },
    ],
    fnc: print.fnc,
}


const print:imethod = {
    name: "print",
    request: "GET",
    protect: {
        type: authType.BEARER,
        fnc: ((key:string, obj:any) => {
            console.log(key, obj);
            return true;
        }),
    },
    alias: "prnt",
    desc: "print the variable",
    args: [
        {
            name: "value",
            type: "string",
            format: format.PARAM,
        },
        {
            name: "optional",
            optional: true,
            type: "string",
            format: format.JSON,
        },
    ],
    fnc: ((str: string, optional:any) : iresult => {
        console.log(optional);
        
        let response:iresult = {
            error:false,
            code: 200,
            message:str
        };

        return response;
    }),
}

export const test:iservice = {
    name: "testservice",
    version: "v2",
    method: [print, print2, postPrint],
    interface: IO.WEB | IO.SOC,
    // interface: IO.WEB,
}
```
## Future plans

### general
* expose and add support to register IO interfaces for custom interface modules
* expand methods so that are only allowed on some interfaces

### IO
* web: infer request type based on method args
* web: catching for invalid json
* web: extend support for other format options
* socket: expose event system and callbacks for connect and disconnect
* socket: write exit and errors io events

### middleware
* add support for multi namespaces
* add support for pre-post buisness logic and both

### http server
* add support for http/2
