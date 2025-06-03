"use client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, X } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface TermsOfServiceModalProps {
  isOpen: boolean
  onClose: () => void
}

export function TermsOfServiceModal({ isOpen, onClose }: TermsOfServiceModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 z-10"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </Button>

        <CardHeader className="bg-blue-50 border-b sticky top-0 z-10">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-6 w-6 text-blue-600" />
            <CardTitle>Terms of Service</CardTitle>
          </div>
          <CardDescription>SI-EVO (Internal Information System of Matahati Insphira)</CardDescription>
          <Badge variant="outline" className="text-xs">
            Effective Date: {new Date().toLocaleDateString()}
          </Badge>
        </CardHeader>

        <ScrollArea className="h-[calc(90vh-180px)]">
          <CardContent className="p-6 space-y-6">
            <section>
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  1
                </span>
                Introduction
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms of Service (&quot;Terms&quot;) govern the use of SI-EVO, an internal information system developed and
                maintained by Matahati Insphira. By accessing or using SI-EVO, users agree to comply with these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  2
                </span>
                Eligibility and Access
              </h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>
                  SI-EVO is intended solely for authorized personnel of Matahati Insphira, including employees, interns,
                  and contractors.
                </li>
                <li>
                  Each user is responsible for ensuring that their access is secure and not shared with unauthorized
                  parties.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  3
                </span>
                User Conduct
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-2">
                Users must use SI-EVO in a lawful and responsible manner. Prohibited actions include:
              </p>

              <div className="border rounded-lg p-4 bg-red-50 border-red-200 space-y-2">
                <ul className="list-disc list-inside space-y-2 text-red-700 ml-4">
                  <li>Tampering with, altering, or deleting data without proper authority</li>
                  <li>Uploading malicious files, scripts, or content that may harm the system</li>
                  <li>Using the system for personal gain or non-business-related purposes</li>
                </ul>
              </div>;
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  4
                </span>
                System Availability and Maintenance
              </h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>
                  Matahati Insphira strives to ensure high availability of SI-EVO but does not guarantee uninterrupted
                  access.
                </li>
                <li>
                  Scheduled maintenance or emergency updates may cause temporary downtime, which will be communicated in
                  advance where possible.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  5
                </span>
                Data Ownership and Confidentiality
              </h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>All data entered, processed, and stored in SI-EVO is the property of Matahati Insphira.</li>
                <li>
                  Users must treat all data within the system as confidential and are prohibited from sharing or
                  distributing data outside authorized channels.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  6
                </span>
                Intellectual Property
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                SI-EVO, including its design, codebase, features, and documentation, is the intellectual property of
                Matahati Insphira. Users may not copy, reproduce, or reverse-engineer any part of the system without
                written permission.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  7
                </span>
                Monitoring and Audit
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                User activity within SI-EVO may be logged and monitored for operational, security, and compliance
                purposes. Any misuse or suspicious behavior may result in disciplinary action, including suspension of
                access.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  8
                </span>
                Termination of Access
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-2">Access to SI-EVO may be revoked if a user:</p>

              <div className="border rounded-lg p-4 bg-gray-50 space-y-2">
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Resigns or is terminated from their role</li>
                  <li>Violates these Terms or any company policies</li>
                  <li>Engages in behavior that compromises the integrity of the system</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  9
                </span>
                Limitation of Liability
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Matahati Insphira is not liable for any indirect damages arising from system errors, data loss, or
                service interruptions. Users are responsible for maintaining backups of any data critical to their
                workflows, if not already covered by IT policies.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  10
                </span>
                Amendments
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms may be updated periodically. Continued use of SI-EVO after changes implies acceptance of the
                new terms. Major updates will be communicated through internal announcements or system notices.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  11
                </span>
                Contact
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                For support or questions regarding these Terms, please contact:
              </p>

              <div className="border rounded-lg p-4 bg-gray-50">
                <p className="font-semibold">IT & Data Governance Unit – Matahati Insphira</p>
                <p>
                  Email:{" "}
                  <a href="mailto:it.support@matahatiinsphira.com" className="text-blue-600 hover:underline">
                    it.support@matahatiinsphira.com
                  </a>
                </p>
              </div>
            </section>
          </CardContent>
        </ScrollArea>

        <CardFooter className="border-t p-4 bg-gray-50 flex justify-between items-center sticky bottom-0">
          <div className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Matahati Insphira. All rights reserved.
          </div>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
