"use client"

import { useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import useHr from "@/hooks/use-hr"
import { format } from "date-fns"

interface DetailModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  userName: string
}

export function DetailModal({ isOpen, onClose, userId, userName }: DetailModalProps) {
  const { userEvents, loading, fetchAssignmentByUserId } = useHr()

  useEffect(() => {
    if (isOpen && userId) {
      fetchAssignmentByUserId(userId)
    }
  }, [isOpen, userId, fetchAssignmentByUserId])

  const handleDelete = (eventId: string) => {
    console.log(`Delete event ${eventId} for user ${userId}`)
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm")
    } catch (error) {
      return "-"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Event Assignments for {userName}</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : (
          <div className="max-h-[400px] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event Name</TableHead>
                  <TableHead>Updated By</TableHead>
                  <TableHead>Assigned At</TableHead>
                  <TableHead className="w-[80px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.isArray(userEvents) && userEvents.length > 0 ? (
                  userEvents.map((assignment: any, index: number) => (
                    <TableRow key={`event-${assignment.event?.event_id || index}`}>
                      <TableCell>{assignment.event?.event_name || "N/A"}</TableCell>
                      <TableCell>{assignment.updated_by || "-"}</TableCell>
                      <TableCell>{formatDate(assignment.assignedAt)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(assignment.event?.event_id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No assignments found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
