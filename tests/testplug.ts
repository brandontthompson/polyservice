import { polyplugin } from "../polyplugin";
import { polyservice } from "../polyservice";
export const testplugin:polyplugin = {
	execute(frame:polyservice){
		frame.services().forEach((s:any, i:number) => {
			s.id=1 << i;
		})
	}
}
