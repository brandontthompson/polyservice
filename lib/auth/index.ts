import { authType, iauth } from "../iservice";

export async function protect(auth:iauth, obj:any):Promise<boolean> {       
    let key:any;
    switch(auth.type){
        case(authType.BASIC):{
            key = (Buffer.from(obj.headers["authorization"], 'base64').toString('binary')).split("Basic ")[1].trim();
            break;
        }
        case(authType.BEARER):{
            const bearer = obj.headers["authorization"]
            if(!bearer || !bearer.startsWith("Bearer ")) return false;
            key = bearer.split("Bearer ")[1].trim();
            break;
        }
        case(authType.BODY):{
            key = obj.body[auth.key || "Key"];
            break;
        }
        case(authType.HEADER):{
            key = obj.headers[auth.key || "Key"];
            break;
        }
        case(authType.OAUTH2):{
            
            break;
        }
        case(authType.PARAM):{
            key = obj.param[auth.key || "Key"];
            break;
        }
        case(authType.QUERY_PARAM):{
            key = obj.query[auth.key || "Key"];
            break;
        }
    }

    if(key === undefined && key === null)
        return false;

    return await auth.fnc(key, obj);
}
