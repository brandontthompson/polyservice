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
            error: false,
            code: 0,
            message: undefined
        };
        if (key !== process.env.CLAIM_KEY){
            response = {
                error: true,
                code: 401,
                message: undefined
            };
            return response;
        }

        return response;
    }),
}