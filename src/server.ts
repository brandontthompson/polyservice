// @TODO: make a singleton server for HTTP servers
// this way web, sockets, etc. that require a web server 
// dont have to make a new server when they start
// instead they get instance, if no instance this will 
// create a new instance and return it
let listener:any = null;
export const httplistener = function() {
    if (listener !== null) return listener;

    // listener = http.createServer
}

