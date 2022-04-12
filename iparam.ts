export interface iparam{
    [key:string]:any
    optional?:boolean
}

export interface ioptional<T>{
    [key:string]:T
}