"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown } from "lucide-react"
import { AssignmentModal } from "./form/assignment-hr-modal"
import { ConfirmationModal } from "./confirmation-modal"
import useHr from "@/hooks/use-hr"
import type { ColumnDef } from "@tanstack/react-table"

export type User = {
  id: string
  name: string
  role: string
  status: "unassigned" | "inactive" | "assigned"
  avatar?: string
}

const AssignmentCell = ({ row }: { row: any }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
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
      <Button
        variant="default"
        size="sm"
        onClick={() => {
          if (events.length === 0) {
            fetchAllEvents()
          }
          setIsModalOpen(true)
        }}
      >
        Assign to
      </Button>

      <AssignmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAssign={handleAssign}
        projects={projectsForModal}
        isLoading={assigning}
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

export const hrColumns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }: { column: any }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Name <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }: { row: any }) => {
      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={row.original.avatar || "/placeholder.svg"} alt={row.getValue("name")} />
            <AvatarFallback>{(row.getValue("name") as string).charAt(0)}</AvatarFallback>
          </Avatar>
          <span>{row.getValue("name")}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "role",
    header: ({ column }: { column: any }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Role <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: { row: any }) => {
      const status = (row.getValue("status") as string).toLowerCase()
      let colorClass = "bg-gray-100 text-gray-800" // Default color

      if (status === "unassigned") {
        colorClass = "bg-green-100 text-green-800"
      } else if (status === "assigned") {
        colorClass = "bg-yellow-100 text-yellow-800"
      } else if (status === "inactive") {
        colorClass = "bg-gray-100 text-gray-800"
      }

      return (
        <Badge variant="secondary" className={colorClass}>
          {status}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }: { row: any }) => <AssignmentCell row={row} />,
  },
]
