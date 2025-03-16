import { NextRequest, NextResponse } from "next/server";

export function responseFormat(statusCode: number, message: string, data: unknown) {
    const response = {
        code: statusCode,
        message: message,
        data: data,
    };
    return new NextResponse(JSON.stringify(response), { status: statusCode });  
}

export function requestFormat(data: unknown) {
    return new  NextRequest(JSON.stringify(data));
}