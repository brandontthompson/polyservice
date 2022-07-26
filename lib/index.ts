import { iservice } from "./iservice";
import * as _interface from "./interface";
import { imiddleware } from "./imiddleware";
import { HttpListener } from "./server";
import {iinterface, instanceOfInterface} from "./iinterface";

/**
 * @private
 */
interface iframework{
    register:Function
    use:Function
    bind:Function
    init:Function
    services:Function
    interfaces:Function
    middlewares:Function
}

/**
 * @private
 */
const services:iservice[] = [];
const interfaces:iinterface[] = [];
const middlewares:imiddleware[] = [];

/**
 * Module exports.
 * @public
 */
export const service:iframework = {
    register: register,
    use: use,
    bind: bind,
    init: init,
    services: getServices,
    interfaces: getInterfaces,
    middlewares: getMiddlewares,
};

/**
 * @public
 *
 */
function getServices():iservice[] {
    return [...services];
}

function getMiddlewares():imiddleware[] {
    return [...middlewares];
}

function getInterfaces():iinterface[]{
    return [...interfaces]
}

/**
 * @public
 * @param module 
 */
function register(module:iservice | iinterface) {
    (instanceOfInterface(module)) ? interfaces[interfaces.length] = module : services[services.length] = module;
}


// @TODO: these loops can be optimized by how we register the services, for example if bucket all the services that need to be registerd with an IO then we can early exit the On^2 loop
/**
 * @public
 */
function init(initOpts:Paritial<>) {
    _bind();
    console.log(`Loading ${services.length} service(s)...`)
    for (let index = 0; index < services.length; index++) {
        let addCnt:number = 0;
        const target:number = (services[index].interface.split(" ")).length;
        for (const [iterator, obj] of Object.entries(interfaces)) {
            if(services[index].interface.includes(obj.identifier) || services[index].interface == "ALL"){
                obj.init(services[index]);
                console.log("LOADED: ", obj.name, services[index].name);
                addCnt++;
            }
            if(parseInt(iterator) >= (interfaces.length - 1) && addCnt < target) console.log("FAILED TO LOAD ONE OR MORE SERVICE: ", services[index].interface, services[index].name)
        }
    }
    initOpts?.onStart();
    //@BUG: This will start an HTTP listener even if there is no interfaces tha require the HTTP server
    HttpListener.Instance.Listen();
}

/**
 * @public
 * @param middleware
 */
function use(middleware:imiddleware|any) {
    for (const [name, obj] of Object.entries(_interface.default)) {    

        // if a non imiddleware is passed (express package middleware) then create an imiddlware
        if(!("fnc" in (middleware as any)))
            middleware = {
                interface: "ALL",
                fnc: middleware
            }
        if(middleware.interface.includes(obj.identifier) || middleware.interface == "ALL"){
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
    for (let index = 0; index < services.length; index++) {
        for (const [iface, obj] of Object.entries(_interface.default)) {
            if(services[index].interface.includes(obj.identifier) || services[index].interface == "ALL"){
                console.log("BOUND: ", obj.name, services[index].name);
                services[index].method.forEach(method => {                   
                    if(method.protect && !method.protect.key) method.protect.key = "Key"
                });
                obj.bind(services[index]);
            }
        }        
    }
}
