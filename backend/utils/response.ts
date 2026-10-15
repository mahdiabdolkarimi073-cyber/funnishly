export function response(status: boolean, data?: object, message?: string): ActionResponse {
    return { ok: status, data: data ?? undefined, ...(message && { message: message }) }
}
export function error(message: string): ActionResponse {
    return response(false, undefined, message)
}
