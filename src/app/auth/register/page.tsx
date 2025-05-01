"use client"

import { useState } from "react"
import { useSafeContext } from "@/hooks/use-safe-context"
import AuthenticationContext from "@/models/context/auth-context"
import TokenVerificationForm from "@/components/authentication/forms/verify-token-form";
import RegisterForm from "@/components/authentication/forms/register-form";


export default function RegistrationPage() {
    const {
        handleRegister,
        handleCheckToken,
    } = useSafeContext(AuthenticationContext, "AuthenticationContext");
  const [isTokenVerified, setIsTokenVerified] = useState(false);
  const [token, setToken] = useState("");

  const handleTokenVerified = (token: string) => {
    setIsTokenVerified(true)
    setToken(token)
  }

  return (
    <div className="w-full max-w-md mx-auto flex items-center justify-center min-h-[50vh]">
      {!isTokenVerified ? (
        <TokenVerificationForm onTokenVerified={handleTokenVerified} onCheckToken={handleCheckToken} />
      ) : (
        <RegisterForm onRegister={handleRegister} token={token} />
      )}
    </div>
  )
}
