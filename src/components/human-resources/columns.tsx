"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import useHr, { UserWithStatus } from "@/hooks/use-hr"
import { AssignmentModal } from "./form/assignment-hr-modal"
import { DetailModal } from "./detail-modal"
import { ConfirmationModal } from "./confirmation-modal"

export type Employee = {
  id: string
  name: string
  email: string
  department: string
  status: "unassigned" | "assigned" | "inactive"
}

const AssignmentCell = ({ row }: { row: any }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedEventId, setSelectedEventId] = useState<string>("")
  const [selectedEventName, setSelectedEventName] = useState<string>("")
  const pendingAssignmentRef = useRef<{ userId: string; eventIds: string[] } | null>(null)

  const user = row.original
  const {
    events,
    assignUserToEvents,
    assigning,
    fetchAllEvents,
    confirmationModalOpen,
    handleConfirmAssignment,
    handleCancelAssignment,
    userToReassign,
  } = useHr()

  useEffect(() => {
    fetchAllEvents()
  }, [fetchAllEvents])

  useEffect(() => {
    if (selectedEventId) {
      const event = events.find((e) => e.event_id === selectedEventId)
      if (event) {
        setSelectedEventName(event.event_name)
      }
    }
  }, [events, selectedEventId])

  useEffect(() => {
    if (confirmationModalOpen && userToReassign === user.id) {
      setIsModalOpen(false)
    }
  }, [confirmationModalOpen, userToReassign, user.id])

  const handleAssign = (eventId: string) => {
    setSelectedEventId(eventId)

    const selectedEvent = events.find((event) => event.event_id === eventId)
    if (selectedEvent) {
      setSelectedEventName(selectedEvent.event_name)
    }

    pendingAssignmentRef.current = {
      userId: user.id,
      eventIds: [eventId],
    }

    assignUserToEvents(user.id, [eventId])
  }

  const handleConfirm = () => {
    if (pendingAssignmentRef.current) {
      const { userId, eventIds } = pendingAssignmentRef.current
      handleConfirmAssignment(userId, eventIds)
      pendingAssignmentRef.current = null
    }
  }

  const projectsForModal = events.map((event) => ({
    id: event.event_id,
    name: event.event_name,
  }))

  return (
    <>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={user.status === "inactive"}
          onClick={() => setIsDetailModalOpen(true)}
        >
          Detail
        </Button>

        <Button
          variant={user.status === "inactive" ? "ghost" : "default"}
          size="sm"
          disabled={user.status === "inactive"}
          onClick={() => {
            if (user.status !== "inactive") {
              if (events.length === 0) {
                fetchAllEvents()
              }
              setIsModalOpen(true)
            }
          }}
          className={user.status === "inactive" ? "bg-gray-100 text-gray-600" : ""}
        >
          Assign to
        </Button>
      </div>

      <AssignmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAssign={handleAssign}
        projects={projectsForModal}
        isLoading={assigning}
      />

      <DetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        userId={user.id}
        userName={user.name}
      />

      <ConfirmationModal
        isOpen={confirmationModalOpen && userToReassign === user.id}
        onClose={handleCancelAssignment}
        onConfirm={handleConfirm}
        isLoading={assigning}
        userName={user.name}
        eventName={selectedEventName}
      />
    </>
  )
}

export const hrColumns: ColumnDef<UserWithStatus>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string

      return (
        <Badge variant={status === "assigned" ? "default" : status === "unassigned" ? "secondary" : "destructive"}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    cell: AssignmentCell,
  },
]
