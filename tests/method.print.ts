import { authType, format, iresult, imethod } from "../index";
import { iparam } from "../iparam";

export const print:imethod = {
    name: "print",
    request: "GET",
    protect: {
        type: authType.PARAM,
        fnc: ((key:string, obj:any) => {
            console.log("AA", key);
            
            // console.log(key, obj);
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
        {
            name: "optional",
            optional: true,
            type: "object",
            format: format.JSON,
        },
    ],
    fnc:  ((str:string, optional:object, context:any): iresult => {
        console.log(optional, context);
        str = str;
        context.store = { passedStr: str }
        context.storeopts = {
            path: "/api/testservice/v2/print",
            maxAge: 360000
        }
        let response:iresult = {
            error:false,
            code: 200,
            message:str,
            // type: "application/xml"
        };

        return response;
    }),
}