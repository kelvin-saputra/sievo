"use client"

import Link from "next/link"

export function Footer() {
  return (
    <div className="w-full border-t bg-background">
      <div className="px-4 py-4 md:px-6 md:py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-muted-foreground">
            &copy; 2025 <span className="text-blue-matahati font-semibold hover:underline"><Link href={"https://api.whatsapp.com/send?phone=6281294040609"}>PT Matahati Inspira</Link></span>. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground hover:underline">
              Terms of Service
            </Link>
            <Link href={"https://api.whatsapp.com/send?phone=6281294040609"} className="text-xs text-muted-foreground hover:text-foreground hover:underline">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

