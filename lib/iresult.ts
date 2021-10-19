import { ierror } from "./ierror";

export interface iresult{
    code: number
    data: any
    error?: ierror | null
}