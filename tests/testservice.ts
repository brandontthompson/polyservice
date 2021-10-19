import { authType, format, imethod, iservice, IO, iresult } from "../index";

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
            alias: "",
            desc: "",
            type: "string",
            format: format.PARAM,
        },
    ],
    fnc: ((str: string) : iresult => {
        let response:iresult = {
            error:false,
            code: 200,
            message:str
        };

        return response;
    }),
}

const print2:imethod = {
    name: "print2",
    request: "GET",
    // protect: {
    //     type: authType.BEARER,
    //     fnc: oauth,
    // },
    alias: "prnt",
    desc: "print the variable",
    args: [
        {
            name: "value",
            alias: "",
            desc: "",
            type: "string",
            format: format.PARAM,
        },
    ],
    fnc: ((str: string) : iresult => {
        let response:iresult = {
            error:false,
            code: 200,
            message:str,
        };

        return response;
    }),
}

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

export const test:iservice = {
    name: "testservice",
    method: [print, print2, postPrint],
    interface: IO.WEB | IO.SOC,
}


//@TODO: remove this is only to test the service while I develop it
// (() => {
//     // const opts:ioptions = {
//     //     timeout: 15,
//     //     requests: 15,
//     //     timeBetweenRequests: 5
//     // }
//     service.register(require('./tests/testservice').test);
//     // service.register(require('../tests/testservice').test);
//     // use(rateLimit(opts));
//     service.init();
// })();