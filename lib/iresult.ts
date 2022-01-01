import { format } from "./iservice";

export interface iresult{
    error: boolean
    code: number
    message: any
    type?: string
    redirect?: string
    forward?: string
}