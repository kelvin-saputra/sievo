
export function responseFormat(statusCode: number, message: string, data: unknown) {
    return new Response(JSON.stringify({ code: statusCode, message: message, data: data }));  
}

export function requestFormat(data: unknown) {
    return new  Request(JSON.stringify(data));
}
    
