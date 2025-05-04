"use client"

import { LoginForm } from "@/components/authentication/forms/login-form"
import { useSafeContext } from "@/hooks/use-safe-context"
import AuthenticationContext from "@/models/context/auth-context"
import { Suspense } from "react"

export default function Login() {
    const {
        handleLogin
    } = useSafeContext(AuthenticationContext, "AuthenticationContext");
    return (
        <>
        <Suspense fallback={<div>Loading…</div>}>
            <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
                <div className="w-full max-w-sm">
                    <LoginForm onLogin={handleLogin}/>
                </div>
            </div>
        </Suspense>
        </>
    )
}