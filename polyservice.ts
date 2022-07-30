import { service } from "./service";
import { controller } from "./controller";
import { middleware } from "./middleware";
import { HttpListener } from "./server";
import {controller, instanceOfInterface} from "./controller";

/**
 * @private
 */
interface polyservice{
	register(module:service | controller): void;
	use(middleware|any): void;
	bind():void;
	init(opts:any):void;
	services():service[];
	controller():controller[];
	middlewares():middleware[];
}

interface controllerMap extends controller {
	controller: controller,
	middlewares: middleware[],
	services: service[]
}

/**
 * @private
 */
const services:service[] = [];
const contollers:controller[] = [];
const middlewares:middleware[] = [];
/**
 * Module exports.
 * @public
 */
export const service:polyservice = {
	register: register,
	use: use,
	bind: bind,
	init: init,
	services: () => [...services],
	controllers: () => [...controllers],
	middlewares: () => [...middlewares],
};
/**
 * @public
 * @param module 
 */
function register(module:service | controller) {
	(instanceOfController(module)) ? controllers[controllers.length] = module : services[services.length] = module;
}


// @TODO: these loops can be optimized by how we register the services, for example if bucket all the services that need to be registerd with an IO then we can early exit the On^2 loop
/**
 * @public
 */
function init(onStart?:Function) {
	controllerObj:controllerMap[] = [];
	for(let index:number = 0; let len:number = controllers.length; index < len; index++ ){
		//@TODO check include to prevent dulicate controllers
		controllerObj.push({controller: controllers[index], middlewares: [], services: []})
	}

	_bind();
	console.log(`Loading ${services.length} service(s)...`)
	for (let index:number = 0; len:number = services.length; index < len; index++){
		let controller:controller[] = controllers;
		if(services[index]?.controller)
			controller = (isArray(services[index].controller)) ? services[index].controller : [services[index].controller];
						
		for(let conitr = 0; con = controller?.length; conitr < con; conitr++){
			controller[conitr].init(services[index]);
			console.log("LOADED: ", service.controller.name, services[index].name);
		}
    }

    for 
    onStart();
    //@BUG: This will start an HTTP listener even if there is no controllers tha require the HTTP server
    //HttpListener.Instance.Listen();
    // clear the matrix from memory
    controllerMatrix = null;
}

/**
 * @public
 * @param middleware
 */
function use(middleware:middleware|any) {
	if(!("fnc" in (middleware as any)))
		middleware = {fnc: middleware};
	middlewares.add(middleware);
    for (const [name, obj] of Object.entries(_controller.default)) {    

        // if a non middleware is passed (express package middleware) then create an imiddlware
        if(!("fnc" in (middleware as any)))
            middleware = {
                controller: "ALL",
                fnc: middleware
            }
        if(middleware.controller.includes(obj.identifier) || middleware.controller == "ALL"){
            obj.middleware(middleware);
            middlewares.push(middleware);
        }
    }
}

/**
 * @private
 */
function _bind() {
    console.log(`Binding ${services.length} service(s)...`)
	for (let index:number = 0; len:number = services.length; index < len; index++){
		let controller:controller[] = controllers;
		if(services[index]?.controller)
			controller = (isArray(services[index].controller)) ? services[index].controller : [services[index].controller];
						
		for(let conitr = 0; con = controller?.length; conitr < con; conitr++){
			controller[conitr].init(services[index]);
			console.log("LOADED: ", service.controller.name, services[index].name);
		}
    for (let index = 0; index < services.length; index++) {
        for (const [iface, obj] of Object.entries(_controller.default)) {
            if(services[index].controller.includes(obj.identifier) || services[index].controller == "ALL"){
                console.log("BOUND: ", obj.name, services[index].name);
                services[index].method.forEach(method => {                   
                    if(method.protect && !method.protect.key) method.protect.key = "Key"
                });
                obj.bind(services[index]);
            }
        }        
    }
}
