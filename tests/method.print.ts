import { webMethod, requestType } from "./web";
import { result, polyarg } from "../index";
import {web, requestMethod} from "./web";
export const print:webMethod = {
	controller: web,
	request: requestType.POST,
    name: "print",
    arguments: {
    	str:{type:"string", requestMethod: requestMethod.JSON},
	optional:{type:"object | undefined", requestMethod: requestMethod.JSON}
    },
    callback: function(str:string, optional:object, context:any): result {
	
    //_callback (str:{name:"str", type:"string"}, optional:{name:"optional", optional:true, type:"object"}, context:any): result {
        console.log(str, optional, context);
        str = str;
//        context.store = { passedStr: str }
//        context.storeopts = {
//            path: "/api/testservice/v2/print",
//            maxAge: 360000
//        }
        let response:result = {
            code: 200,
            message:str,
            // type: "application/xml"
        };

        return response;
    },
}
