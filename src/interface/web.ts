import express, { Router } from "express";
import { format, imethod, iservice } from "../iservice";
import { iinterface, IO } from "../iinterface";
import morgan from "morgan";
import { iresult } from "../iresult";
const app = express();
const router = Router();


// @TODO: add dotenv variables for ports and such
// @TODO: middlware functions and protections for URLs
export const web: iinterface = {
    identifier: IO.WEB,
    name: "web",
    init: init,
    bind: bind,
    middleware: middleware,
}

function init(port?:Number) {
    app.use("/api",router);
    app.listen(3000, () => {
        console.log("listening on port " + 3000);
    });
}

function bind(service:iservice) {
    
    service.method.forEach(method => {
        let url = buildURL(service.name, method);

        if(method.request.toLowerCase() === "get")
            router.get(url, function(req:any, res:any) { resolver(req, res, method); });
        else if(method.request.toLowerCase() === "post")
            router.post(url, function(req:any, res:any) { resolver(req, res, method); });
        else if(method.request.toLowerCase() === "patch")
            router.patch(url, function(req:any, res:any) { resolver(req, res, method); });
        else if(method.request.toLowerCase() === "put")
            router.put(url, function(req:any, res:any) { resolver(req, res, method); });    
        else if(method.request.toLowerCase() === "delete")
            router.delete(url, function(req:any, res:any) { resolver(req, res, method); });  
    });
}


function middleware(fnc:any[]) {
    app.use(express.urlencoded({extended:false}));
    app.use(express.json());
    fnc.forEach(m => {
        app.use(m); 
    });
}

/**
 * @private
 * builds the URL for each service's method
 */
 function buildURL(serviceStr:string, method:imethod) {
    let url = "/"+serviceStr+"/"+method.name;
    method.args.forEach(arg => {
        if(arg.format === format.PARAM)
            url += "/:"+arg.name;
    });
    return url;
}

function resolver(req:any, res:any, method:imethod) {

    let param:any[] = [];

    for (let index = 0; index < method.args.length; index++) {
        if(method.args[index].format === format.PARAM) 
            param.push(req.params[method.args[index].name]);
        else if(method.args[index].format === format.JSON || method.args[index].format === format.XML) 
            param.push(req.body[method.args[index].name]);
        // @TODO: add the rest of the format options
    }
    // @TODO: do param type checking
    let result:iresult = method.fnc(...param);

    if(result.error !== undefined && result.error !== null){
        return res.status(result.code).send(result);
        // {
        //     "code": result.code,
        //     "success": false,
        //     "error": {
        //         "code": result.error?.errorCode,
        //         "name": result.error.errorName,
        //         "description": result.error.errorDescription,
        //     }
        // }
    }

    return res.status(200).send(JSON.stringify(result));

    // {
    //     "code": result.code,
    //     "success": true,
    //     "result": result.data,
    // }
}