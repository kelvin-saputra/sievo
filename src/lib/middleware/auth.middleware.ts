// lib/middleware/auth.middleware.ts
import redisClient from '@/utils/redis'
import { NextRequest, NextResponse } from 'next/server'
import { verify } from '@/lib/jwt'
import axios from 'axios'
import { encryptAES } from '../aes'

const AUTH_API = process.env.NEXT_PUBLIC_AUTH_API_URL
/**
 * Checking cookies or refreshToken for authenticated user.
 * If there is no cookies, return response to redirect to login page.
 * If cookies exist, return null to continue the request.
 */
export async function AuthMiddleware(req: NextRequest) {
  const { origin, pathname, searchParams } = req.nextUrl

  if (pathname.startsWith('/auth')) {
    const accessToken = req.cookies.get('accessToken')?.value
    const target = searchParams.get('from') ?? '/'
    const targetURL = new URL(target, origin);
    if (accessToken) {
      return NextResponse.redirect(targetURL)
    } 
    const refreshToken = req.cookies.get('refreshToken')?.value || "";
    const decodedToken = verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET!)
    if (refreshToken) {
      try {
        const requestData = {
          id: (decodedToken as any).id
        }
        await axios.post(`${AUTH_API}/ack`, requestData);
      } catch {
      }
      return NextResponse.redirect(targetURL)
    }
  }
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/api/auth')
  ) {
    return null
  }

  // Get the access Token
  const accessToken = req.cookies.get('accessToken')?.value
  if (accessToken) {
    return null
  }
  const refreshToken = req.cookies.get('refreshToken')?.value;
  
  if (!refreshToken) {
      const loginURL = new URL('/auth/login', origin);
    loginURL.searchParams.set('from', pathname);
    return NextResponse.redirect(loginURL);
	}

  const decodedToken = verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET!)
  const cookiesSession = await redisClient.get(`refreshToken:${await encryptAES((decodedToken as any).id)}`)
  if (refreshToken !== cookiesSession) {
    // Not logged in yet -> Redirect to login page
    const loginUrl = new URL('/auth/login', origin)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }
	try {
		const requestData = {
			id: (decodedToken as any).id
		}
		await axios.post(`${AUTH_API}/ack`, requestData);
	} catch {
	}
	return null;
}