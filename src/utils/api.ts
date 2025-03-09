import { NextRequest, NextResponse } from "next/server";

export function responseFormat(statusCode: number, message: string, data: unknown) {
    return new NextResponse(JSON.stringify({ code: statusCode, message: message, data: data }));  
}

export function requestFormat(data: unknown) {
    return new  NextRequest(JSON.stringify(data));
}
    
