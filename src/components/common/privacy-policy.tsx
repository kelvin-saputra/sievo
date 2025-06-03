"use client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, X } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface PrivacyPolicyModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PrivacyPolicyModal({ isOpen, onClose }: PrivacyPolicyModalProps) {
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
            <Shield className="h-6 w-6 text-blue-600" />
            <CardTitle>Privacy Policy</CardTitle>
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
                Purpose
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                This Privacy Policy outlines how Matahati Insphira collects, uses, protects, and manages data processed
                through SI-EVO, our internal information system used to support operational and strategic activities.
                This policy demonstrates our commitment to protecting the privacy and security of all data processed
                within our organization.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  2
                </span>
                Scope
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-2">
                This policy applies to all individuals who access or use SI-EVO, including:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Full-time and part-time employees</li>
                <li>Interns and temporary staff</li>
                <li>Contractors and consultants</li>
                <li>Authorized third parties with legitimate business needs</li>
                <li>System administrators and IT personnel</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  3
                </span>
                Data Collected
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-2">
                SI-EVO may collect the following types of information:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-medium mb-2">Personal Information</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Full name and employee ID</li>
                    <li>Division and department</li>
                    <li>Job role and responsibilities</li>
                    <li>Contact information (if applicable)</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-medium mb-2">System Data</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Login credentials (encrypted)</li>
                    <li>Activity logs and timestamps</li>
                    <li>IP addresses and session data</li>
                    <li>Browser and device information</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-medium mb-2">Operational Data</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Documents and files uploaded</li>
                    <li>Task records and project updates</li>
                    <li>Communication logs</li>
                    <li>Performance metrics</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-medium mb-2">Technical Metadata</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>System performance data</li>
                    <li>Error logs and diagnostics</li>
                    <li>Usage patterns and analytics</li>
                    <li>Security event logs</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  4
                </span>
                Use of Data
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-2">
                The collected data will be used for the following purposes:
              </p>

              <div className="space-y-3 mt-4">
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <h3 className="font-medium mb-1">Authentication & Authorization</h3>
                  <p className="text-sm text-muted-foreground">
                    Verifying user identity and managing access permissions based on roles and responsibilities.
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <h3 className="font-medium mb-1">Operational Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Supporting daily operations, project tracking, task management, and internal coordination.
                  </p>
                </div>

                <div className="border-l-4 border-orange-500 pl-4 py-2">
                  <h3 className="font-medium mb-1">System Integrity</h3>
                  <p className="text-sm text-muted-foreground">
                    Maintaining system security, creating audit trails, and ensuring regulatory compliance.
                  </p>
                </div>

                <div className="border-l-4 border-purple-500 pl-4 py-2">
                  <h3 className="font-medium mb-1">Business Intelligence</h3>
                  <p className="text-sm text-muted-foreground">
                    Generating reports, analytics, and insights to improve organizational workflows and decision-making.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  5
                </span>
                Data Protection
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h3 className="font-medium mb-2">Technical Safeguards</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>End-to-end encryption for data transmission</li>
                      <li>Advanced encryption for data at rest</li>
                      <li>Multi-factor authentication (MFA)</li>
                      <li>Regular security updates and patches</li>
                    </ul>
                  </div>

                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h3 className="font-medium mb-2">Administrative Controls</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Role-based access control (RBAC)</li>
                      <li>Principle of least privilege</li>
                      <li>Regular access reviews and audits</li>
                      <li>Employee security training</li>
                    </ul>
                  </div>
                </div>

                <div className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-medium mb-2">Infrastructure Security</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Secure servers with 24/7 monitoring</li>
                    <li>Automated backup systems with encryption</li>
                    <li>Intrusion detection and prevention systems</li>
                    <li>Regular vulnerability assessments and penetration testing</li>
                    <li>Disaster recovery and business continuity plans</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  6
                </span>
                Data Sharing
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-2">
                Data within SI-EVO is treated as confidential and will not be disclosed to external parties except in
                the following circumstances:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="border rounded-lg p-4 bg-red-50 border-red-200">
                  <h3 className="font-medium mb-1 text-red-800">Legal Requirements</h3>
                  <p className="text-sm text-red-700">
                    When required by law, court order, or regulatory authorities with proper legal documentation.
                  </p>
                </div>

                <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
                  <h3 className="font-medium mb-1 text-blue-800">Internal Purposes</h3>
                  <p className="text-sm text-blue-700">
                    Authorized by company management for internal audits, legal reviews, or compliance purposes.
                  </p>
                </div>

                <div className="border rounded-lg p-4 bg-green-50 border-green-200">
                  <h3 className="font-medium mb-1 text-green-800">Business Operations</h3>
                  <p className="text-sm text-green-700">
                    Shared with authorized service providers under strict confidentiality agreements for system
                    maintenance or support.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  7
                </span>
                User Responsibilities
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-2">
                All users of SI-EVO are expected to adhere to the following responsibilities:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="border-l-4 border-red-500 pl-4 py-2">
                  <h3 className="font-medium mb-1 text-red-700">Security Obligations</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Keep login credentials confidential</li>
                    <li>Use strong, unique passwords</li>
                    <li>Log out properly when sessions are complete</li>
                    <li>Report any suspected security incidents</li>
                  </ul>
                </div>

                <div className="border-l-4 border-orange-500 pl-4 py-2">
                  <h3 className="font-medium mb-1 text-orange-700">Data Handling</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Access only data necessary for job functions</li>
                    <li>No sharing internal data without authorization</li>
                    <li>Ensure data accuracy and report discrepancies</li>
                    <li>Follow data retention and disposal policies</li>
                  </ul>
                </div>

                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <h3 className="font-medium mb-1 text-blue-700">System Usage</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Use SI-EVO only for business purposes</li>
                    <li>Comply with all company policies</li>
                    <li>Report system issues to IT support</li>
                    <li>Participate in security training programs</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  8
                </span>
                Data Retention
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Data collected through SI-EVO will be retained only as long as necessary for business purposes, legal
                requirements, or regulatory compliance. Upon termination of employment or contract, user access will be
                immediately revoked, and personal data will be securely disposed of according to company data retention
                policies.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  9
                </span>
                Contact Information
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-2">
                For questions, concerns, or requests regarding this Privacy Policy or data handling practices, please
                contact:
              </p>

              <div className="border rounded-lg p-4 bg-gray-50 mt-4">
                <p className="font-semibold">IT Department</p>
                <p>Matahati Insphira</p>
                <p>Email: it-support@matahati-insphira.com</p>
                <p>Phone: [Company Phone Number]</p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  10
                </span>
                Policy Updates
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-2">
                This Privacy Policy may be updated periodically to reflect changes in our practices, technology, or
                legal requirements. Users will be notified of significant changes through SI-EVO system notifications or
                company communications. Continued use of the system constitutes acceptance of the updated policy.
              </p>

              <div className="border rounded-lg p-4 bg-blue-50 border-blue-200 mt-4">
                <p className="text-sm text-blue-700">
                  <strong>Last Updated:</strong> {new Date().toLocaleDateString()} |<strong> Version:</strong> 1.0
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
