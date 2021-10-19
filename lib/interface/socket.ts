// import {} from "http"
import { Server, Socket } from "socket.io";
import { imethod, iservice } from "../iservice";
import { iinterface, IO } from "../iinterface";
import { iresult } from "../iresult";
import { HttpListener } from "../server";

let io:Server;
const services:iservice[] = [];
const mware:Function[] = [];

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
function middleware(fnc:Function) {
    mware.push(fnc);
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

    io.on('connection', function(soc:Socket) {
        console.log("CONNECTED");
        
        registerListeners(soc);
    });
}

/**
 * @private
 * @param soc 
 */
function registerListeners(soc:Socket) {
    mware.forEach(m => {
        io.use(function (socket, next) {
            wrap(m(socket.request, next));
        });
    });

    for (let index = 0; index < services.length; index++) {
        services[index].method.forEach(function(method:imethod){
            soc.on(method.alias.toUpperCase(), function(context:any){
                callback(soc, method, context);
            }); 
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

