import { authType, iauth } from "../iservice";

export async function protect(auth:iauth, obj:any):Promise<boolean> {       
    let key:any;
        
    switch(auth.type){
        case(authType.BASIC):{
            key = (Buffer.from(obj.req.headers["authorization"], 'base64').toString('binary')).split("Basic ")[1].trim();
            break;
        }
        case(authType.BEARER):{
            const bearer = obj.req.headers["authorization"]
            if(!bearer || !bearer.startsWith("Bearer ")) return false;
            key = bearer.split("Bearer ")[1].trim();
            break;
        }
        case(authType.BODY):{
            key = obj.req.body[auth.key || "Key"];
            break;
        }
        case(authType.CUSTOM):{
            break;   
        }
        case(authType.HEADER):{
            key = obj.req.headers[auth.key || "Key"];
            break;
        }
        case(authType.OAUTH2):{
            
            break;
        }
        case(authType.PARAM):{
            key = obj.req.params[auth.key || "Key"];
            break;
        }
        case(authType.PARAM_AUTHORIZATION):{
            key = {
                param: obj.req.headers[auth.key || "Key"],
                authorization: obj.req.headers["authorization"],
            }
            break;   
        }
        case(authType.PARAM_BODY):{
            key = {
                param: obj.req.headers[auth.key || "Key"],
                body: obj.req.body[auth.key || "Key"],
            }
            break;   
        }
        case(authType.QUERY_PARAM):{
            key = obj.req.query[auth.key || "Key"];
            break;
        }
    }

    if(key === undefined && key === null)
        return false;

    return await auth.fnc(key, obj);
}
