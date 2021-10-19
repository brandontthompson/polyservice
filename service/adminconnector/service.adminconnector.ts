import { format, imethod, iservice } from "../../lib/iservice";
import { IO } from "../../lib/iinterface";
import { info } from "./method.info";

export const adminconnector:iservice = {
    name: "admin",
    method: [info],
    interface: IO.WEB,
}