"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/event_tasks/data-table";
import { taskColumns } from "@/components/event_tasks/columns";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronRight, MoreHorizontal } from "lucide-react";
import { EventStatusEnum } from "@/models/enums";
import { EventSchema } from "@/models/schemas";
import useEventTask from "@/hooks/use-event-task";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EventCardProps {
  event: EventSchema;
  onStatusUpdate: (eventId: string, status: EventStatusEnum) => void;
  onDeleteEvent: (eventId: string) => void;
}

const EventCard = ({
  event,
  onStatusUpdate,
  onDeleteEvent,
}: EventCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [eventData, setEventData] = useState(event);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const router = useRouter();

  const {
    tasks,
    loading: tasksLoading,
    fetchAllTasks,
  } = useEventTask(event.event_id);

  useEffect(() => {
    if (expanded) {
      fetchAllTasks();
    }
  }, [expanded, fetchAllTasks]);

  const handleStatusChange = (e: React.MouseEvent, status: EventStatusEnum) => {
    e.stopPropagation();
    onStatusUpdate(eventData.event_id, status);
    setEventData((prev) => ({ ...prev, status }));
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmOpen(true);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/events/${eventData.event_id}`);
  };

  return (
    <div className="mb-6 border rounded-lg shadow-md bg-white">
      <div
        className={`flex justify-between items-center ${
          eventData.status !== "DONE" ? "bg-green-200" : "bg-gray-200"
        } p-4 rounded-md cursor-pointer`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          {expanded ? (
            <ChevronDown className="h-5 w-5 text-gray-800" />
          ) : (
            <ChevronRight className="h-5 w-5 text-gray-800" />
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {eventData.event_name}
            </h3>
            <p className="text-gray-600 text-sm">
              {eventData.location} (
              {new Date(eventData.start_date).toLocaleDateString()} -{" "}
              {new Date(eventData.end_date).toLocaleDateString()})
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" onClick={(e) => e.stopPropagation()}>
                {eventData.status} <MoreHorizontal className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {EventStatusEnum.options.map((status) => (
                <DropdownMenuItem
                  key={status}
                  onClick={(e) => handleStatusChange(e, status)}
                >
                  {status}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="secondary" onClick={handleViewDetails}>
            View Details
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="p-4">
          {tasksLoading ? (
            <div>Loading tasks...</div>
          ) : (
            <DataTable columns={taskColumns} data={tasks} />
          )}
        </div>
      )}

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Penghapusan</DialogTitle>
          </DialogHeader>
          <p className="my-4">Apakah Anda yakin ingin menghapus event ini?</p>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setConfirmOpen(false);
                onDeleteEvent(eventData.event_id);
              }}
            >
              Hapus
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventCard;
