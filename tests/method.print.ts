import { authType, format, iresult, imethod } from "../index";

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
            type: "string",
            format: format.JSON,
        },
    ],
    fnc: ((str: string, optional:any, context:any) : iresult => {
        console.log(optional, context);
        str = "<data><str>"+str+"</str></data>";
        let response:iresult = {
            error:false,
            code: 200,
            message:str,
            // type: "application/xml"
        };

        return response;
    }),
}