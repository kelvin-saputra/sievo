"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TaskSchema } from "@/models/schemas";
import { Badge } from "@/components/ui/badge";
import { UserWithStatus } from "@/hooks/use-hr";
import { cn } from "@/utils/shadUtils";
import { taskStatusColorMap } from "@/utils/eventStatusColorMap";

function compactId(id: string, front = 6, back = 4) {
  if (!id || id.length <= front + back + 3) return id;
  return `${id.slice(0, front)}...${id.slice(-back)}`;
}

interface EventTaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventData: TaskSchema;
  users: UserWithStatus[];
}

export function EventTaskDetailModal({
  isOpen,
  onClose,
  eventData,
  users,
}: EventTaskDetailModalProps) {
  const assignee =
    users.find((u) => u.id === eventData.assigned_id)?.name ||
    users.find((u) => u.id === eventData.assigned_id)?.email ||
    "Unassigned";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-lg"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle>{eventData.title}</DialogTitle>
          <DialogDescription>Task details from this event.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 bg-gray-50 rounded-md p-4 border">
          <div>
            <div className="text-xs text-gray-500">Task ID</div>
            <div
              className="font-mono text-xs bg-gray-100 rounded px-2 py-1 cursor-pointer w-fit"
              title={eventData.task_id}
            >
              {compactId(eventData.task_id)}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Status</div>
            <Badge
              className={cn(
                "text-xs font-semibold",
                taskStatusColorMap[eventData.status]
              )}
            >
              {eventData.status}
            </Badge>
          </div>
          <div>
            <div className="text-xs text-gray-500">Title</div>
            <div className="break-words">{eventData.title}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Assigned To</div>
            <div>{assignee}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Due Date</div>
            <div>
              {eventData.due_date ? (
                new Date(eventData.due_date).toLocaleDateString()
              ) : (
                <span className="italic text-gray-400">N/A</span>
              )}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Event ID</div>
            <div
              className="font-mono text-xs bg-gray-100 rounded px-2 py-1 cursor-pointer w-fit"
              title={eventData.event_id}
            >
              {compactId(eventData.event_id)}
            </div>
          </div>
        </div>

        <div className="my-4">
          <div className="text-xs text-gray-500 mb-1">Description</div>
          <div className="whitespace-pre-line break-words bg-gray-100 rounded p-3 border min-h-[44px]">
            {eventData.description || (
              <span className="italic text-gray-400">No description</span>
            )}
          </div>
        </div>

        <div className="border-t mt-6 pt-4 text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
            <div>
              <div className="text-xs text-gray-500">Created By</div>
              <div>{eventData.created_by}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Updated By</div>
              <div>{eventData.updated_by}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Created At</div>
              <div>
                {eventData.created_at ? (
                  new Date(eventData.created_at).toLocaleString()
                ) : (
                  <span className="italic text-gray-400">N/A</span>
                )}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Updated At</div>
              <div>
                {eventData.updated_at ? (
                  new Date(eventData.updated_at).toLocaleString()
                ) : (
                  <span className="italic text-gray-400">N/A</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
