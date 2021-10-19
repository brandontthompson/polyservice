import { iresult } from "../../lib/iresult";
import { format, imethod } from "../../lib/iservice";

export const info:imethod = {
    name: "info",
    // protected: true,
    request: "GET",
    alias: "i",
    desc: "get info about this microservice ",
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
            error: false,
            code: 200,
            message: str,
        };

        
        return response;
    }),
}