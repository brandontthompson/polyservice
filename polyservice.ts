import { service, method } from "./service";
import { polyarg } from "./polyarg";
import { polyservice as ipolyservice } from './polyservice';
import { middleware } from "./middleware";
import {controller, instanceOfController, controllerOptions} from "./controller";
import { polyplugin } from "./polyplugin";
/**
 * @private
 */
export interface polyservice{
	register(module:service | controller): void;
	use(middleware:middleware|any): void;
	plugin(plugin:polyplugin):void;
	bind():void;
	init(options?:controllerOptions, startCallback?:Function):void;
	services():service[];
	controllers():controller[];
	middlewares():middleware[];
}
/**
 * @private
 */
const services:service[] = [];
const controllers:controller[] = [];
const middlewares:middleware[] = [];
const plugins:polyplugin[] = [];
let lateload:{module:service|middleware, load:string}[] = [];
/**
 * Module exports.
 * @public
 */
export const polyservice:polyservice & {options:{log:boolean}, logger:Function|any} = {
	register: register,
	use: use,
	plugin: plugin,
	bind: _bind,
	init: init,
	services: () => [...services],
	controllers: () => [...controllers],
	middlewares: () => [...middlewares],
	options:{log:true},
	logger:(message:any) => console.log(message),
};
/**
 * @public
 * @param module 
 */
function register(module:service|controller) {
	if(instanceOfController(module)) {controllers.push(module); return;}
	lateload.push({module:module, load:"bind"});
	// modify the object so we can bind it in a single for loop
	services[services.length] = module;
}

// @TODO: these loops can be optimized by how we register the services, for example if bucket all the services that need to be registerd with an IO then we can early exit the On^2 loop
/**
 * @public
 */
function init(options?:controllerOptions, onStart?:Function) {
	polyservice.options = polyservice.options;

	_bind();
	for(let index = 0, len = plugins.length; index < len; index++)
		plugins[index].execute(polyservice);
	for(let index = 0, len = controllers.length; index < len; index++)
		controllers[index].init(options);
	polyservice.logger(`Loading ${services.length} service(s)...`)
	if(onStart) onStart();
}

/**
 * @public
 * @param middleware
 */
function use(middleware:middleware|any) {
	if(!("callback" in (middleware as any)))
		middleware = {callback: middleware};
	lateload.push({module:middleware, load:"middleware"});
	middlewares.push(middleware);

}

/**
 * @private
 */
function _bind() {

	// Get all the controllers from all service objects
	for (let index:number = 0, len = lateload.length; index < len; index++){
		const module:middleware|service = lateload[index].module
		if(!module.controller) continue;
		module.controller = (Array.isArray(module.controller)) ? module.controller : [module.controller];

		for(let contind:number = 0, len = module.controller.length; contind < len; contind++ )
			if(!controllers.includes(module.controller[contind])) controllers.push(module.controller[contind]);
		
	}

	// grab the controller list that should be bound to the module or register to all controllers if its not been defined as any
	for (let index:number = 0, len = lateload.length; index < len; index++){
		const module:middleware|service = lateload[index].module

		if(!module.controller) module.controller = controllers
		if(!Array.isArray(module.controller)) module.controller = [module.controller];

		const controllerList:controller[] = module.controller;
		for(let contind:number = 0, len = controllerList.length; contind < len; contind++ )
			// get the controller then call the method defined on the load object `bind or middlware) with the module
			(controllerList[contind] as {[index:string]:any})[lateload[index].load](lateload[index].module);
		
	}
	lateload = [];
	polyservice.logger(`Bound ${services.length} service(s)...`);
}

function plugin(plugin:polyplugin){
	plugins.push(plugin);
}
