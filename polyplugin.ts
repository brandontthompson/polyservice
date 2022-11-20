import {polyservice} from "../types-polyservice/polyservice"; 

export interface polyplugin {
	execute(polyservice:polyservice):void		
}
