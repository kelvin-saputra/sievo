"use client"

import { useState, useEffect } from "react"
import { ProposalStatusEnum } from "@/models/enums"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { ChevronsUpDown, AlertTriangle } from "lucide-react"
import useProposal from "@/hooks/use-proposals"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import { UserSchema } from "@/models/schemas"

const StatusDropdown = ({
  proposalId,
  initialStatus,
}: {
  proposalId: string
  initialStatus: ProposalStatusEnum
}) => {
  const { handleStatusChange, fetchAllProposals } = useProposal()
  const [status, setStatus] = useState<ProposalStatusEnum | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<ProposalStatusEnum | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUnauthorizedModalOpen, setIsUnauthorizedModalOpen] = useState(false)
  const [user, setUser] = useState<Partial<UserSchema> | null>(null)

  useEffect(() => {
    setStatus(initialStatus)
  }, [initialStatus])

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("authUser")!)
    try {
      const userParsed = UserSchema.partial().parse(user)
      setUser(userParsed)
    } catch {}
  }, [])

  const getAvailableStatuses = (currentStatus: ProposalStatusEnum): ProposalStatusEnum[] => {
    switch (currentStatus) {
      case "DRAFT":
        return ["ON_REVIEW", "CANCELLED"]
      case "ON_REVIEW":
        return ["APPROVED", "REJECTED", "CANCELLED"]
      case "APPROVED":
        return ["ON_CONTACT", "CANCELLED"]
      case "ON_CONTACT":
        return ["ACCEPTED", "CANCELLED"]
      case "REJECTED":
        return ["DRAFT", "CANCELLED"]
      case "ACCEPTED":
        return ["CANCELLED"]
      case "CANCELLED":
        return Object.values(ProposalStatusEnum.enum) as ProposalStatusEnum[]
      default:
        return []
    }
  }

  const availableStatuses = getAvailableStatuses(status as ProposalStatusEnum)

  const canChangeFromOnReview = () => {
    return ["ADMIN", "EXECUTIVE"].includes(user?.role || "")
  }

  const onStatusSelect = (newStatus: ProposalStatusEnum) => {
    if (newStatus === status) return

    if (status === "ON_REVIEW" && !canChangeFromOnReview()) {
      setIsUnauthorizedModalOpen(true)
      return
    }

    setSelectedStatus(newStatus)
    setIsModalOpen(true)
  }

  const confirmStatusChange = async () => {
    if (!selectedStatus) return

    try {
      setStatus(selectedStatus)
      await handleStatusChange(proposalId, selectedStatus)
      setIsModalOpen(false)
      toast.success(`Status updated to ${selectedStatus}!`)

      await fetchAllProposals()

      setTimeout(() => {
        window.location.reload()
      }, 100)
    } catch (error) {
      console.error("Error updating status:", error)
      toast.error("Failed to update status. Please try again.")
    }
  }

  const statusColors: Record<ProposalStatusEnum, string> = {
    DRAFT: "bg-gray-500 text-white",
    ON_REVIEW: "bg-blue-500 text-white",
    APPROVED: "bg-green-300 text-white",
    REJECTED: "bg-red-500 text-white",
    ON_CONTACT: "bg-blue-300 text-white",
    ACCEPTED: "bg-green-500 text-white",
    CANCELLED: "bg-red-300 text-white",
  }

  const getStatusColor = (status: ProposalStatusEnum | null) => {
    return status ? statusColors[status] : "bg-gray-200 text-black"
  }

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className={`w-28 text-xs justify-center flex mx-auto ${getStatusColor(status)}`}>
            {status ?? "Loading..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-32 p-1 text-sm text-center">
          <Command>
            <CommandInput placeholder="Search..." className="text-xs" />
            <CommandList>
              <CommandEmpty>No status found.</CommandEmpty>
              <CommandGroup>
                {availableStatuses.map((s) => (
                  <CommandItem key={s} value={s} onSelect={() => onStatusSelect(s)}>
                    <span className={`px-2 py-1 rounded-md ${statusColors[s]}`}>{s}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Status Change</DialogTitle>
              <p>
                Are you sure you want to change the status to <b>{selectedStatus}</b>?
              </p>
            </DialogHeader>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="default" onClick={confirmStatusChange}>
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Unauthorized Access Modal */}
      {isUnauthorizedModalOpen && (
        <Dialog open={isUnauthorizedModalOpen} onOpenChange={setIsUnauthorizedModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-amber-600">
                <AlertTriangle className="h-5 w-5" />
                Access Restricted
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-gray-600 mb-3">
                You don&#39;t have permission to change the status from{" "}
                <span className="font-semibold text-blue-600">ON_REVIEW</span>.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                <p className="text-sm text-amber-800">
                  <span className="font-semibold">Only the following roles can edit this status:</span>
                </p>
                <ul className="mt-2 text-sm text-amber-700">
                  <li className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-amber-600 rounded-full"></span>
                    EXECUTIVE
                  </li>
                  <li className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-amber-600 rounded-full"></span>
                    ADMIN
                  </li>
                </ul>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Your current role: <span className="font-medium">{user?.role || "Unknown"}</span>
              </p>
            </div>
            <DialogFooter>
              <Button variant="default" onClick={() => setIsUnauthorizedModalOpen(false)} className="w-full">
                Understood
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

export default StatusDropdown
