import express, { Router } from "express";
import { authType, format, iauth, imethod, iservice } from "../iservice";
import { iinterface, IO } from "../iinterface";
import { iresult } from "../iresult";
import { HttpListener } from "../server";
import { protect } from "../auth";
import { imiddleware } from "../imiddleware";

const app = express();
const router = Router();
const middlewares:imiddleware[][] = [];

// @TODO: add dotenv variables for ports and such
// @TODO: middlware functions and protections for URLs
export const web: iinterface = {
    identifier: IO.WEB,
    name: "web",
    init: init,
    bind: bind,
    middleware: middleware,
};

function init() {
    app.use(express.urlencoded({extended:false}));
    app.use(express.json());

    app.use("/api",router);

    HttpListener.app = app;
}

function bind(service:iservice) {

    service.method.forEach((method, index)=> {

        const url = buildURL(service.name, method);
        
        if(method.protect != undefined && method.protect != null)
        {
            const protection:iauth = method.protect;
            router.use(url, (async(req, res, next) => { 
                if(await protect(protection, { service: { name: service.name, id:index, },  body:req.body, headers:req.headers, param:req.params, query:req.query })) 
                    return next();
                return res.status(401).end();
         }));
        }

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


function middleware(middleware:imiddleware){
    //@TODO: namespace check
    let pushed = false;
    for (let index = 0; index < middlewares.length; index++) {
        if(middlewares[index][0].namespace === middleware.namespace){
            middlewares[index].push(middleware);
            pushed = true;
            break;
        }
    }
    if(!pushed){
        middlewares.push([middleware]);
    }

    app.use(middleware.fnc());
}

/**
 * @private
 * builds the URL for each service's method
 */
 function buildURL(serviceStr:string, method:imethod) {
    let url = "/"+serviceStr+"/"+method.name;

    if(method.protect && method.protect.type === authType.PARAM)
        url +=  "/:"+method.protect.key;

    method.args.forEach(arg => {
        if(arg.format === format.PARAM)
            url += "/:"+arg.name;
    });
    return url;
}

async function resolver(req:any, res:any, method:imethod) {    
    const param:any[] = [];

    for (let index = 0; index < method.args.length; index++) {
        // @TODO: catch invalid json https://stackoverflow.com/questions/29797946/handling-bad-json-parse-in-node-safely
        if(method.args[index].format === format.PARAM) 
            param.push(req.params[method.args[index].name]);
        else if(method.args[index].format === format.JSON || method.args[index].format === format.XML) 
            param.push(req.body[method.args[index].name]);
        // @TODO: add the rest of the format options

        // param type checking
        if(typeof param[index] != method.args[index].type)
            return res.status(400).end();
    }

    if(param.length != method.args.length)
        return res.status(400).end();

    
    const result:iresult = await method.fnc(...param);

    if(result.error !== undefined && result.error !== null)
        return res.status(result.code).send(result);

    return res.status(result.code).send(JSON.stringify(result));
}