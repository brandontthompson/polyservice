import { iresult } from "../../lib/iresult";
import { format, imethod } from "../../lib/iservice";

export const claim:imethod = {
    name: "claim",
    // protected: false,
    request: "GET",
    alias: "c",
    desc: "get info about this microservice ",
    args: [
        {
            name: "key",
            alias: "key",
            desc: "key used to claim the service",
            type: "string",
            format: format.PARAM,
        },
    ],
    fnc: ((key: string) : iresult => {
        let response:iresult = {
            code: 0,
            data: undefined
        };
        if (key !== process.env.CLAIM_KEY){
            response.code = 401;
            response
            return response;
        }

        return response;
    }),
}