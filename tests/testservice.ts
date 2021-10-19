import { authType, format, imethod, iservice } from "../lib/iservice";
import { iresult } from "../lib/iresult";
import { IO } from "../lib/iinterface";

const print:imethod = {
    name: "print",
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
            code: 200,
            data: str,
            error: null,
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
            code: 200,
            data: str,
            error: null,
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
    interface: IO.WEB,
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