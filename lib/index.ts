import { iservice } from "./iservice";
import * as _interface from "./interface";
import { imiddleware } from "./imiddleware";
import { HttpListener } from "./server";
import { IO } from "./iinterface";
/**
 * @private
 */
interface iframework{
    register:Function
    use:Function
    bind:Function
    init:Function
    services:Function
    middlewares:Function
}

/**
 * @private
 */
const services:iservice[] = [];
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
    middlewares: getMiddlewares,
};

/**
 * @public
 * @param module 
 */
function getServices():iservice[] {
    return [...services];
}

function getMiddlewares():imiddleware[] {
    return [...middlewares];
}

/**
 * @public
 * @param module 
 */
function register(module:iservice) {
    services[services.length] = module;
}

/**
 * @public
 */
function init() {
    bind();
    console.log(`Loading ${services.length} service(s)...`)
    for (let index = 0; index < services.length; index++) {
        for (const [name, obj] of Object.entries(_interface.default)) {           
            if((services[index].interface & obj.identifier) === obj.identifier || (services[index].interface & IO.ALL) === IO.ALL){
                console.log("LOADED: ", obj.name, services[index].name);
                obj.init(services[index]);
            }
        }
    }
    //@BUG: This will start an HTTP listener even if there is no interfaces tha require the HTTP server
    HttpListener.Instance.Listen();
}

/**
 * @public
 * @param middleware
 */
function use(middleware:imiddleware) {
    for (const [name, obj] of Object.entries(_interface.default)) {    
        if((middleware.interface & obj.identifier) === obj.identifier || (middleware.interface & IO.ALL) === IO.ALL){
            obj.middleware(middleware);
            middlewares.push(middleware);
        }
    }
}

/**
 * @private
 */
function bind() {
    console.log(`Binding ${services.length} service(s)...`)
    for (let index = 0; index < services.length; index++) {
        for (const [iface, obj] of Object.entries(_interface.default)) {
            if((services[index].interface & obj.identifier) === obj.identifier || (services[index].interface & IO.ALL) === IO.ALL){
                console.log("BOUND: ", obj.name, services[index].name);
                obj.bind(services[index]);
            }
        }        
    }
}