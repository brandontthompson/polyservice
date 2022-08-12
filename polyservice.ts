import { service, method, polyarg } from "./service";
import { middleware } from "./middleware";
import {controller, instanceOfController, controllerOptions} from "./controller";

/**
 * @private
 */
interface polyservice{
	register(module:service | controller): void;
	use(middleware:middleware|any): void;
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
	if(!module.controller) { lateload.push({module:module, load:"bind"}); return;}
	// modify the object so we can bind it in a single for loop
	module.controller = (Array.isArray(module.controller)) ? module.controller : [module.controller];
	services[services.length] = module;

	for(let index:number = 0, len = module.controller.length; index < len; index++ ){
		module.controller[index].bind(module);
		// check if the controllers array has this if not add to it
		if(controllers.includes(module.controller[index])) continue; 
 		controllers[controllers.length] = module.controller[index];
	}
}


// @TODO: these loops can be optimized by how we register the services, for example if bucket all the services that need to be registerd with an IO then we can early exit the On^2 loop
/**
 * @public
 */
function init(options?:controllerOptions, onStart?:Function) {
	polyservice.options = polyservice.options;

	_bind();
	
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
	if(!middleware.controller) { lateload.push({module:middleware, load:"middleware"}); return; }
	middleware.controller = (Array.isArray(middleware.controller)) ? middleware.controller : [middleware.controller];
	middlewares.push(middleware);

	for(let index:number = 0, len = middleware.controller.length; index < len; index++ ){
		middleware.controller[index].middleware(middleware);
		// check if the controllers array has this if not add to it
		if(controllers.includes(middleware.controller[index])) continue; 
 		controllers[controllers.length] = middleware.controller[index];
	}
}

/**
 * @private
 */
function _bind() {
	for (let index:number = 0, len = lateload.length; index < len; index++){
		for(let contind:number = 0, len = controllers.length; contind < len; contind++ )
			(controllers[contind] as {[index:string]:any})[lateload[index].load](lateload[index].module);}
	lateload = [];
	polyservice.logger(`Bound ${services.length} service(s)...`);
}

function plugin(plugin:polyplugin){
	
}
