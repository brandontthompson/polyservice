import { connection } from "../interface/database/redis/connection";

interface ioptions {
    timeout:Number,
    requests:Number,
    timeBetweenRequests:Number,
}

const redis = connection();

/**
 * setup options
 * @param options 
 * @param next 
 */
function rateLimit(options:ioptions) {
    
    console.log("HERE")

    // return function 
    // return next();

    return function limitCheck(req:any, next:Function){
        
        next();
        // redis.connection.get("RATELIMIT:"+);
    }
}

function getip(req:any) {
    return req.ip ||
      req._remoteAddress ||
      (req.connection && req.connection.remoteAddress) ||
      undefined
  }

export {
    rateLimit,
    ioptions
}