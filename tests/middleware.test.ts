import { IO } from "../index";
import { imiddleware } from "../index";

export const testmiddlware:imiddleware = {
    interface: IO.ALL,
    fnc: function (){
        console.log("MIDDWARE");
        return function (req:any, res:any, next:Function) {
            console.log("MIDDWARE INSIDE");   
            next();
        }
    }
}