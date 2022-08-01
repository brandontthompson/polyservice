import { method } from "../service";
import { result } from "../result";
import { polyarg } from "../service";
import {web} from "./web";
export const print:method = {
	controller: web,
    name: "print",
    fnc:  ((str:{name:"str", type:"string"}, optional:{name:"optional", optional:true, type:"object"}, context:any): result => {
        console.log(optional, context);
        str = str;
        context.store = { passedStr: str }
        context.storeopts = {
            path: "/api/testservice/v2/print",
            maxAge: 360000
        }
        let response:result = {
            code: 200,
            message:str,
            // type: "application/xml"
        };

        return response;
    }),
}
