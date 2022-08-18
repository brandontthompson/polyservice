"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.polyservice = void 0;
const controller_1 = require("./controller");
/**
 * @private
 */
const services = [];
const controllers = [];
const middlewares = [];
const plugins = [];
let lateload = [];
/**
 * Module exports.
 * @public
 */
exports.polyservice = {
    register: register,
    use: use,
    plugin: plugin,
    bind: _bind,
    init: init,
    services: () => [...services],
    controllers: () => [...controllers],
    middlewares: () => [...middlewares],
    options: { log: true },
    logger: (message) => console.log(message),
};
/**
 * @public
 * @param module
 */
function register(module) {
    if ((0, controller_1.instanceOfController)(module)) {
        controllers.push(module);
        return;
    }
    if (!module.controller) {
        lateload.push({ module: module, load: "bind" });
        return;
    }
    // modify the object so we can bind it in a single for loop
    module.controller = (Array.isArray(module.controller)) ? module.controller : [module.controller];
    services[services.length] = module;
    for (let index = 0, len = module.controller.length; index < len; index++) {
        module.controller[index].bind(module);
        // check if the controllers array has this if not add to it
        if (controllers.includes(module.controller[index]))
            continue;
        controllers[controllers.length] = module.controller[index];
    }
}
// @TODO: these loops can be optimized by how we register the services, for example if bucket all the services that need to be registerd with an IO then we can early exit the On^2 loop
/**
 * @public
 */
function init(options, onStart) {
    exports.polyservice.options = exports.polyservice.options;
    _bind();
    for (let index = 0, len = plugins.length; index < len; index++)
        plugins[index].execute(exports.polyservice);
    for (let index = 0, len = controllers.length; index < len; index++)
        controllers[index].init(options);
    exports.polyservice.logger(`Loading ${services.length} service(s)...`);
    if (onStart)
        onStart();
}
/**
 * @public
 * @param middleware
 */
function use(middleware) {
    if (!("callback" in middleware))
        middleware = { callback: middleware };
    if (!middleware.controller) {
        lateload.push({ module: middleware, load: "middleware" });
        return;
    }
    middleware.controller = (Array.isArray(middleware.controller)) ? middleware.controller : [middleware.controller];
    middlewares.push(middleware);
    for (let index = 0, len = middleware.controller.length; index < len; index++) {
        middleware.controller[index].middleware(middleware);
        // check if the controllers array has this if not add to it
        if (controllers.includes(middleware.controller[index]))
            continue;
        controllers[controllers.length] = middleware.controller[index];
    }
}
/**
 * @private
 */
function _bind() {
    for (let index = 0, len = lateload.length; index < len; index++) {
        for (let contind = 0, len = controllers.length; contind < len; contind++)
            controllers[contind][lateload[index].load](lateload[index].module);
    }
    lateload = [];
    exports.polyservice.logger(`Bound ${services.length} service(s)...`);
}
function plugin(plugin) {
    plugins.push(plugin);
}
