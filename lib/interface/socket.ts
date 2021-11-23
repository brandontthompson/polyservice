import { Namespace, Server, Socket } from "socket.io";
import { imethod, iservice } from "../iservice";
import { iinterface, IO } from "../iinterface";
import { iresult } from "../iresult";
import { HttpListener } from "../server";
import { imiddleware } from "../imiddleware";

// @TOOD: write exit and errors io events
// @TODO: expose an event system for for others to use or even just allow for callbacks for connection and disconnect
let io:Server;
const services:iservice[] = [];
const middlewares:any[][] = [];
const connected:Socket[] = [];

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
 * wraps expressjs middleware functions for socketio
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
        const namespace = io.of(services[index].name.toLowerCase() + ((services[index].version) ? "/" + services[index].version?.toLowerCase() : ""));
        for (let subdex = 0; subdex < middlewares.length; subdex++) {
            if(middlewares[subdex][0]?.namespace !== undefined && (middlewares[subdex][0].namespace != services[index].name)) continue;
            const nspace = middlewares[subdex][0]?.namespace ? namespace : io;
            registerMiddleware(nspace, middlewares[subdex]);
        };
        
        namespace.on('connection', function(soc:Socket) {
            connected.push(soc);
            services[index].method.forEach(function(method:imethod){
                soc.on(method.name.toUpperCase(), function(context:any){
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
        // namespace.use(wrap(middlewares[index].fnc));
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
    
    return soc.emit(method.name.toUpperCase(), result);
}

