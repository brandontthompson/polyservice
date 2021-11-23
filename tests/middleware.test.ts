import { IO } from "../index";
import { imiddleware } from "../index";

export const testmiddleware:imiddleware = {
    interface: IO.ALL,
    namespace: "testservice", // Note this optional param if blank all services will use this middlware
    fnc: function (req:any, res:any, next:Function) {            
        console.log("MIDDWARE");
                
        res.locals.context.CustomValue = "Some data we can use later"
        
        next();
    }
}