import express, { Router } from "express";
import { service, method, polyarg, invoke, ensurefail, ensure, controller, result, middleware } from "../index";
import { HttpListener } from "../server";

export default express;
const app = express();
const router = Router();
const middlewares:middleware[] = [];
const API_BASE:string = process.env.API_BASE || "";

export enum requestType {
	GET 	= "get",
	POST 	= "post",
	PUT 	= "put",
	DELETE 	= "delete",
	PATCH 	= "patch",
	OPTIONS = "options",
	HEAD 	= "head",
	CONNECT = "connect",
	TRACE 	= "trace"
}

export enum requestMethod {
	JSON,
	XML,
	FILE,
	TEXT,
	QUERY,
	PARAM
}

export interface webMethod extends method {
	request:requestType;
	arguments?:{[name:string]:webarg}
}

export interface webService extends service {
	method: webMethod[]
}

export type webarg = polyarg & {
	requestMethod:requestMethod	
}

export const web:controller = {
    name: "web",
    init: init,
    bind: bind,
    middleware: middleware,
};

function init() {
	for (let index = 0; index < middlewares.length; index++) {
	    const middleware:middleware | any = middlewares[index];
		console.log(middleware.callback.name)
	    middleware.namespace ? app.use("/"+((API_BASE) ? API_BASE+"/" : "")+middleware.namespace, middleware.callback) : app.use(middleware.callback);   
	}
	app.use("/"+API_BASE,router);

	HttpListener.requestListener = app;
}

function bind(service:service|webService) {

    // setup the context so we can use it later
	app.use((req:any, res:any, next:Function) => {
	    if(!res.locals.context) res.locals.context = {}; 
	    return next();
	});

//	app.use();
//	app.use(express.json());
    service.method.forEach((method:webMethod, index)=> {

        const url = buildURL(service, method);
//        if(method.protect != undefined && method.protect != null){
//            const protection:iauth = method.protect;
//
//            router.use(url, (async(req, res, next) => { 
//                // @TODO: generalize this so we dont leave it up to the interfaces to define the bitshifting for the services
//                // const protectContext = await protect(protection, { service: { name: service.name, id:1 << index, },  body:req.body, headers:req.headers, param:req.params, query:req.query })
//                const protectContext = await protect(protection, { service: { name: service.name, id:1 << index },  req })
//
//                if(!protectContext)
//                    return res.status(401).end();
//
//                res.locals.context.protect = protectContext
//                return next();
//         }));
//        }
	router[method?.request](url, function(req:any, res:any){resolver(req, res, method)});
    });
}


function middleware(middleware:middleware){
    middlewares.push(middleware)
}

/**
 * @private
 * builds the URL for each service's method
 */
function buildURL(service:service, method:webMethod) {
    let url = "/" +service.name+"/" + ((service.version) ? service.version + "/" : "") + method.name;

//    if((method.protect && method.protect.type === authType.PARAM )|| (method.protect && method.protect.type === authType.PARAM_AUTHORIZATION )|| (method.protect && method.protect.type === authType.PARAM_BODY))
//        url +=  "/:"+method.protect.key;
//
    Object.keys(method.arguments).forEach((key:string) => {
	    const argument:webarg = method.arguments[key];
	    if(argument.requestMethod === requestMethod.PARAM)
		    url += "/:"+key
    });

    return url;
}

async function resolver(req:any, res:any, method:webMethod) {   

//	const param:any[] = [];
	const param:any = {};
	for(const argument in method.arguments){
		const target:webarg = method.arguments[argument];
		if(target.requestMethod === requestMethod.PARAM) 
		    //param.push(req.params[argument]);	
		    param[argument] = req.params[argument];
		else if(target.requestMethod === requestMethod.JSON || target.requestMethod === requestMethod.XML)
		    //param.push(req.body[argument]);	
		    param[argument] = req.body[argument];
		else if (target.requestMethod === requestMethod.QUERY)
		    //param.push(req.query[argument]);
		    param[argument] = req.query[argument];
		else if (target.requestMethod === requestMethod.TEXT){}
		else if (target.requestMethod === requestMethod.FILE)
		    //param.push(req.file[argument]);
		    param[argument] = req.file[argument];
		// @TODO: add the rest of the format options
		console.log(param)
		//const test = ensure(target, param[param.length - 1], argument);
		const test = ensure(target, param[argument], argument);
		if(!test || (typeof test !== "boolean" && ('blame' in (test as ensurefail)))) return res.status(400).send(test.toString());
		    
	}
  	
	const ret:result|ensurefail = invoke(method, {...param, context:res.locals.context});
	if(!ret || (typeof ret !== "boolean" && ('blame' in (ret as ensurefail)))) { console.log(ret.toString()); return res.status(400).end();}
//    const result:result = method.callback(...param, res.locals.context);
//
//    if(!result) res.status(500).end();
//
//    if(res.locals.context.store)
//        for (let index = 0; index < Object.entries(res.locals.context.store).length; index++) {
//            const element = Object.entries(res.locals.context.store)[index];
//            res.cookie(element[0], element[1], res.locals.context?.storeopts);           
//        }
//    res.locals.context = null;    
//
//    // @TODO: add support for redirecting and making requests
//    if(result.redirect) return res.redirect(result.code || 302, result.redirect);
//    //@TODO: rework for multiple types, use enum not strings
//    res.type(result.type || "application/json");
//    // if(result.type !== undefined) res.type(result.type || "application/json");
//
//    if(result.error)
//        return res.status(result.code).send(result);
//
    //return res.status(result.code).send((result.type !== undefined) ? result.message : JSON.stringify(result));
    return res.status((ret as result).code).send(JSON.stringify(ret));
}
