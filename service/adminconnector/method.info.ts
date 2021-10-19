import { iresult } from "../../lib/iresult";
import { format, imethod } from "../../lib/iservice";
import * as dotenv from 'dotenv';
import { service } from "../../lib";

export const info:imethod = {
    name: "info",
    // protected: true,
    request: "GET",
    alias: "i",
    desc: "get info about this microservice ",
    args: [],
    fnc: (() : iresult => {
        const data = {
            env_variables: dotenv.config(),
            services: service.services(),
        }
        return {
            code: 200,
            data: data,
            error: null,
        };
    }),
}