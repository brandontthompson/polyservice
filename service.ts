export interface iarg{
    name: string
    alias?: string
    desc?: string
    optional?: boolean
    type: string
    format: format
}

export interface methodArg {
    [name:string]:any
    type:string
}

export interface method{
    controller?: controller 
    name: string
    fnc(...args:polyarg)
}

export interface service{
    interface: string
    version?: string,
    name: string
    method: imethod[]
}

export type Partial<polyarg> = {
	name:string;
	optional?:boolean;
	type:ReturnType<this>;
}
