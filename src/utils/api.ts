import { NextRequest, NextResponse } from "next/server";

export function responseFormat(statusCode: number, message: string, data: unknown, cookiesToSet?: {name:string, value: string, options: any}[]) {
    const response = {
        code: statusCode,
        message: message,
        data: data,
        
    };
    const nextResponse = new NextResponse(JSON.stringify(response), { status: statusCode });
    if (cookiesToSet) {
        for (const {name, value, options} of cookiesToSet) {
            nextResponse.cookies.set(name, value, options);
        }
    }
    return nextResponse;  
}

export function requestFormat(data: unknown) {
    return new  NextRequest(JSON.stringify(data));
}

export function responseFormatWithCookies(statusCode: number, message:string, data:unknown, ) {
    const res = responseFormat(statusCode, message, data);

    return res;
}