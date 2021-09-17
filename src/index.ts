import { iservice } from "./iservice";
import * as _interface from "./interface";
import { test } from "../tests/testservice";
import { IO } from "./iinterface";

/**
 * @private
 */
 var io:IO = IO.None;
 let services:iservice[] = []
 
/**
 * Module exports.
 * @public
 */
export const service:any = (() => {});
service.interface = io;
service.register = register;
service.use = use;
service.bind = bind;
service.init = init;

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
            if((io & obj.identifier) === obj.identifier){
                console.log("LOADED: " + obj.name);
                obj.init(services[index]);
            }  
        }        
    }
}

/**
 * @public
 * @param fnc
 */
function use(fnc:any) {
    for (const [name, obj] of Object.entries(_interface.default)) {
        if((io & obj.identifier) === obj.identifier){
            obj.middleware(fnc);
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
            if((io & obj.identifier) === obj.identifier){
                console.log("BOUND: " + obj.name);
                obj.bind(services[index]);
            }                
        }        
    }
}

//@TODO: remove this is only to test the service while I develop it
(() => {
    io = IO.WEB;
    register(test);
    init();
})();

