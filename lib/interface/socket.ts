// import {} from "http"
import { Namespace, Server, Socket } from "socket.io";
import { imethod, iservice } from "../iservice";
import { iinterface, IO } from "../iinterface";
import { iresult } from "../iresult";
import { HttpListener } from "../server";
import { imiddleware } from "../imiddleware";

let io:Server;
const services:iservice[] = [];
const middlewares:imiddleware[][] = [];

export const socket:iinterface = {
    identifier: IO.SOC,
    name: "socket",
    init: init,
    bind: bind,
    middleware: middleware,
};

/**
 * @public
 * @param port 
 */
function init() {
    listen();
}

/**
 * @public
 * @param service 
 */
function bind(service:iservice) {
    services.push(service);
}

/**
 * @public
 * @param fnc 
 */
function middleware(middleware:imiddleware) {
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
}

/**
 * @private
 * @returns 
 */
 const wrap = (middleware: (arg0: any, arg1: {}, arg2: any) => any) => (socket: { request: any; }, next: any) => middleware(socket.request, {}, next);

/**
 * @private
 */

function listen(){
    if(io !== null && io !== undefined) return io;

    io = new Server(HttpListener.Instance.httpServer, {});


    for (let index = 0; index < services.length; index++) {
        const namespace = io.of(services[index].name.toLowerCase());
        for (let index = 0; index < middlewares.length; index++) {
            if(middlewares[index][0]?.namespace && (middlewares[index][0].namespace != services[index].name)) continue;
            const nspace = middlewares[index][0]?.namespace ? namespace : io;
            registerMiddleware(nspace, middlewares[index]);
        };
        
        namespace.on('connection', function(soc:Socket) {
            services[index].method.forEach(function(method:imethod){
                soc.on(method.alias.toUpperCase(), function(context:any){
                    callback(soc, method, context);
                }); 
            });
        });
    }
}

/**
 * @private
 * @param namespace 
 * @param middlewares[]
 */
function registerMiddleware(namespace:Server | Namespace, middlewares:imiddleware[]){
    for (let index = 0; index < middlewares.length; index++) {
        namespace.use(function(socket, next) {
            wrap(middlewares[index].fnc(socket.request, next));
        });
    }
}

/**
 * @private
 * @param soc 
 * @param method 
 * @param context 
 * @returns 
 */
function callback(soc:Socket, method:imethod, context:any) {
    const result:iresult = method.fnc(context)
    if(result.error){
        return soc.emit('SOCKET_ERROR', result);
    }
    return soc.emit(method.alias.toUpperCase(), result);
}

