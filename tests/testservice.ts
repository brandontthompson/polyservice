import { IO } from "../lib/iinterface";
import { iresult } from "../lib/iresult";
import { format, imethod, iservice } from "../lib/iservice";

const print:imethod = {
    name: "print",
    request: "GET",
    alias: "p",
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
    fnc: ((str: string) => {
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
    method: [print, postPrint],
    interface: IO.WEB,
}
