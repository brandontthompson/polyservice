import express, { Router } from "express";
import { authType, format, iauth, imethod, iservice } from "../iservice";
import { iinterface, IO } from "../iinterface";
import { iresult } from "../iresult";
import { HttpListener } from "../server";
import { protect } from "../auth";
import { imiddleware } from "../imiddleware";

const app = express();
const router = Router();
const middlewares:imiddleware[] = [];

export const web: iinterface = {
    identifier: IO.WEB,
    name: "web",
    init: init,
    bind: bind,
    middleware: middleware,
};

function init() {
    app.use("/"+process.env.API_BASE,router);

    HttpListener.app = app;
}

function bind(service:iservice) {

    // setup the context so we can user it later
    app.use((req:any, res:any, next:Function) => {
        if(!res.locals.context) res.locals.context = {}; 
        return next();
    });

    app.use(express.urlencoded({extended:false}));
    app.use(express.json());

    for (let index = 0; index < middlewares.length; index++) {
        const middleware:imiddleware | any = middlewares[index];
        middleware.namespace ? app.use("/"+process.env.API_BASE+"/"+middleware.namespace, middleware.fnc) : app.use(middleware.fnc);   
    }

    service.method.forEach((method, index)=> {

        const url = buildURL(service, method);
        
        if(method.protect != undefined && method.protect != null){
            const protection:iauth = method.protect;
            
            router.use(url, (async(req, res, next) => { 
                // @TODO: generalize this so we dont leave it up to the interfaces to define the bitshifting for the services
                // const protectContext = await protect(protection, { service: { name: service.name, id:1 << index, },  body:req.body, headers:req.headers, param:req.params, query:req.query })
                const protectContext = await protect(protection, { service: { name: service.name, id:1 << index, },  req })

                if(!protectContext)                
                    return res.status(401).end();

                res.locals.context.protect = protectContext
                return next();
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
    middlewares.push(middleware)
}

/**
 * @private
 * builds the URL for each service's method
 */
function buildURL(service:iservice, method:imethod) {
    let url = "/" +service.name+"/" + ((service.version) ? service.version + "/" : "") + method.name;
    
    if((method.protect && method.protect.type === authType.PARAM )|| (method.protect && method.protect.type === authType.PARAM_AUTHORIZATION )|| (method.protect && method.protect.type === authType.PARAM_BODY))
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
        if(method.args[index].format === format.PARAM) 
            param.push(req.params[method.args[index].name]);
        else if(method.args[index].format === format.JSON || method.args[index].format === format.XML){
            param.push(req.body[method.args[index].name]);
        }
        else if (method.args[index].format === format.TEXT){}
        else if (method.args[index].format === format.FILE){ 
            param.push(req.files[method.args[index].name]) 
        }
        // @TODO: add the rest of the format options

        // param type checking
        //@PB: if the param is set to optional it will bypass any types even if sent
        if(typeof param[index] != method.args[index].type && !method.args[index].optional)
            return res.status(400).end();
    }

    if(param.length != method.args.length)
        return res.status(400).end();

    
    const result:iresult = await method.fnc(...param, res.locals.context);

    if(!result) res.status(500).end();
    
    if(res.locals.context.store)
        for (let index = 0; index < Object.entries(res.locals.context.store).length; index++) {
            const element = Object.entries(res.locals.context.store)[index];
            res.cookie(element[0], element[1], res.locals.context?.storeopts);           
        }
    res.locals.context = null;    

    // @TODO: add support for redirecting and making requests
    if(result.redirect) return res.redirect(result.code || 302, result.redirect);
    //@TODO: rework for multiple types, use enum not strings
    res.type(result.type || "application/json");
    // if(result.type !== undefined) res.type(result.type || "application/json");

    if(result.error)
        return res.status(result.code).send(result);
    
    return res.status(result.code).send((result.type !== undefined) ? result.message : JSON.stringify(result));
}