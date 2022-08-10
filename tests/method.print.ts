import { web, requestMethod, webMethod, requestType } from '../../polyexpress';
import { result, polyarg } from "../index";
export const print:webMethod = {
	controller: web,
	request: requestType.POST,
    name: "print",
    arguments: {
    	str:{type:"string", requestMethod: requestMethod.PARAM,
    	str1:{type:"string", requestMethod: requestMethod.QUERY},
	optional:{type:"object | undefined", requestMethod: requestMethod.PARAM}
    },
    callback: function(str:string, str1:string, optional:object, context:any): result {
	
    //_callback (str:{name:"str", type:"string"}, optional:{name:"optional", optional:true, type:"object"}, context:any): result {
        console.log(str, str1, optional, context);
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
