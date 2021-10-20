import { iresult } from "../../lib/iresult";
import { authType, format, imethod } from "../../lib/iservice";
import * as dotenv from 'dotenv';
import { service } from "../../lib";

export const info:imethod = {
    name: "info",
    protect: {
        type: authType.PARAM,
        key:"key",
        fnc: ((key:string, obj:any):boolean => {
            console.log(key, obj);
            if(key === "1234")
                return true;
            return false;
        }),
    },
    request: "GET",
    alias: "i",
    desc: "get info about this microservice ",
    args: [],
    fnc: (() : iresult => {
        const data = {
            env_variables: dotenv.config(),
            services: service.services(),
            middlewares: service.middlewares(),
        }
        return {
            error: false,
            code: 200,
            message: data,
        };
    }),
}