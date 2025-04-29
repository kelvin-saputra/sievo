import { NextRequest, NextResponse } from "next/server";

export function responseFormat(
    statusCode: number,
    message: string, 
    data: unknown, 
    cookiesToSet?: {name:string, value: string, options: any}[],
    redirectURL?: string
) {
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

    if (redirectURL) {
        nextResponse.headers.set('Location', redirectURL);
    }
    return nextResponse;  
}

export function requestFormat(data: unknown) {
    return new  NextRequest(JSON.stringify(data));
}