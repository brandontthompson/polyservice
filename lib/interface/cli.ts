import yargs from "yargs";
import { iservice } from "../iservice";
import { iinterface } from "../iinterface";

const argv = yargs(process.argv.slice(2))

export const cli: iinterface = {
    identifier: "COMMAND_LINE",
    name: "cli",
    init: initialize,
    bind: bind,
    middleware: middleware
}

function initialize(params:Int16Array) {
    
}
/**
 * @public
 * @param service 
 */
function bind(service:iservice) {
    // console.log("BOUND" + service);
    // // let command = argv.command(service.name, '(() => {})', (yargs) => {}, (argv) => {

    // // });

    // let command = argv.command(service.name, )

    // // for (let index = 0; index < service.args.length; index++) {
    // //     command.options(service.args[index].name, {
    // //         alias: service.args[index].alias,
    // //         // type: service.args[index].type,
    // //         description: service.args[index].desc,
    // //     });
    // // }
    // command.argv = argv.argv;
    // console.log(command)
}

function middleware(middleware:Object) {
    
}
