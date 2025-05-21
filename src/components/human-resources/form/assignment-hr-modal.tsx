"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

interface Project {
  id: string
  name: string
}

interface AssignmentModalProps {
  isOpen: boolean
  onClose: () => void
  onAssign: (projectId: string) => void
  projects: Project[]
  isLoading?: boolean
}

export function AssignmentModal({ isOpen, onClose, onAssign, projects, isLoading = false }: AssignmentModalProps) {
  const [selectedProject, setSelectedProject] = useState<string>("")

  const handleAssign = () => {
    if (selectedProject) {
      onAssign(selectedProject)
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose()
          setSelectedProject("")
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign to Event</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">Select an event to assign this user to</p>
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger>
              <SelectValue placeholder="Select an event" />
            </SelectTrigger>
            <SelectContent>
              {projects.length > 0 ? (
                projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="loading" disabled>
                  No events available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            className="bg-[#1e2c4f] hover:bg-[#2a3c66]"
            disabled={!selectedProject || isLoading}
            variant="default"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Assigning...
              </>
            ) : (
              "Assign"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
