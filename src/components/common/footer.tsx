"use client"

import Link from "next/link"
import { PrivacyPolicyModal } from "./privacy-policy"
import { useState } from "react"
import { TermsOfServiceModal } from "./terms-of-service";

export function Footer() {
  const [isPrivacyPolicyOpen, setIsPrivacyPolicyOpen] = useState(false);
  const [isTermsOfServiceOpen, setIsTermsOfServiceOpen] = useState(false);
  return (
    <div className="w-full border-t bg-background">
      <div className="px-4 py-4 md:px-6 md:py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-muted-foreground">
            &copy; 2025 <span className="text-blue-matahati font-semibold hover:underline"><Link href={"https://api.whatsapp.com/send?phone=6281294040609"}>PT Matahati Inspira</Link></span>. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <div onClick={() => setIsPrivacyPolicyOpen(true)} className="text-xs text-muted-foreground hover:text-foreground hover:underline hover:cursor-pointer">
              Privacy Policy
            </div>
            <div onClick={() => setIsTermsOfServiceOpen(true)} className="text-xs text-muted-foreground hover:text-foreground hover:underline hover:cursor-pointer">
              Terms of Service
            </div>
            <TermsOfServiceModal isOpen={isTermsOfServiceOpen} onClose={() => setIsTermsOfServiceOpen(false)} />
            <PrivacyPolicyModal isOpen={isPrivacyPolicyOpen} onClose={() => setIsPrivacyPolicyOpen(false)} />
            <Link href={"https://api.whatsapp.com/send?phone=6281294040609"} className="text-xs text-muted-foreground hover:text-foreground hover:underline">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

