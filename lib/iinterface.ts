export interface iinterface{
    identifier: string
    name: string
    init: Function
    bind: Function
    middleware: Function
}

export function Interface(identifier:string, name:string) {
	this.identifer = identifer;
	this.name = name;
}

Interface.prototype._bind

export function instanceOfInterface(object:any): object is iinterface {
    return 'identifier' in object;
}
