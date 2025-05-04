import { NextRequest, NextResponse } from 'next/server'
import { AuthMiddleware } from '@/lib/middleware/auth.middleware'
import { roleMiddleware } from '@/lib/middleware/role.middleware'

export async function middleware(req: NextRequest) {
  const authResult = await AuthMiddleware(req)
  if ('redirect' in authResult) {
    return authResult.redirect
  }

  const roleRes = await roleMiddleware(req)

  if (roleRes.headers.get('location')) {
    return roleRes
  }

  const res = NextResponse.next()
  if (Array.isArray((authResult as any).setCookieHeaders)) {
    for (const cookieStr of (authResult as any).setCookieHeaders) {
      res.headers.append('Set-Cookie', cookieStr)
    }
  }
  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico).*)']
}
