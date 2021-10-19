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
            code: 200,
            data: str,
            error: null,
        };

        
        return response;
    }),
}