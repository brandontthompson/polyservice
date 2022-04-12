// import { IO } from "../iinterface";
import { imiddleware } from "../imiddleware"

export const simpleError:imiddleware = {
    interface: "WEB",
    fnc: function(err:SyntaxError, req:any, res:any, next:Function){  
        const e:any = err
        
        if (err instanceof SyntaxError && e.status === 400 && 'body' in err) {
            return res.status(400).send({ message: err.message }); // Bad request
        }
        next();
    }
}