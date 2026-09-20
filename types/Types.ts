export type ActionResponse = {
    ok: boolean,
    data?: object
    message?: string
}

export interface User {
    name: string
    last_name: string
    phone: string
    id : string

}