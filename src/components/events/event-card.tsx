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
import { eventStatusColorMap } from "@/utils/eventStatusColorMap";
import useHr from "@/hooks/use-hr";
import { ADMINEXECUTIVEINTERNAL, checkRoleClient } from "@/lib/rbac-client";

interface EventCardProps {
  event: EventSchema;
  onStatusUpdate?: (eventId: string, status: EventStatusEnum) => void;
  onDeleteEvent?: (eventId: string) => void;
  userRole: string | null;
  onStatusUpdate?: (eventId: string, status: EventStatusEnum) => void;
  onDeleteEvent?: (eventId: string) => void;
  userRole: string | null;
}

const EventCard = ({
  event,
  onStatusUpdate,
  onDeleteEvent,
  userRole,
  userRole,
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

  const { users, fetchAllUsers, loading: usersLoading } = useHr();
  const [usersFetched, setUsersFetched] = useState(false);

  useEffect(() => {
    if (expanded) {
      if (!usersFetched) {
        fetchAllUsers();
        setUsersFetched(true);
      }
      fetchAllTasks();
    }
  }, [expanded, fetchAllUsers, fetchAllTasks, usersFetched]);

  const handleStatusChange = (e: React.MouseEvent, status: EventStatusEnum) => {
    e.stopPropagation();
    if (userRole === "FREELANCE") return;
    onStatusUpdate?.(eventData.event_id, status);
    if (userRole === "FREELANCE") return;
    onStatusUpdate?.(eventData.event_id, status);
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
        onClick={() => setExpanded((prev) => !prev)}
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
            {checkRoleClient(ADMINEXECUTIVEINTERNAL) && !["DONE"].includes(eventData.status) ? (
              <>
              
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  onClick={(e) => e.stopPropagation()}
                  disabled={!checkRoleClient(ADMINEXECUTIVEINTERNAL)}
                >
                  <span
                    className={`rounded px-2 py-1 text-xs font-semibold ${
                      eventStatusColorMap[eventData.status] ||
                      "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {eventData.status}
                  </span>
                  <MoreHorizontal className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {EventStatusEnum.options.map((status) => (
                    <DropdownMenuItem
                      key={status}
                      onClick={(e) => handleStatusChange(e, status)}
                    >
                      <span
                        className={`rounded px-2 py-1 text-xs font-semibold ${
                          eventStatusColorMap[status] ||
                          "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {status}
                      </span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </>
            ) : (
              <div
                className={
                  "rounded px-2 py-1 text-xs font-semibold border inline-block truncate max-w-[130px] " +
                  (eventStatusColorMap[event.status] ||
                    "bg-gray-100 text-gray-800")
                }
                title={event.status}
              >
                {event.status}
              </div>
            )}
          </DropdownMenu>
          <Button variant="secondary" onClick={handleViewDetails}>
            View Details
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={userRole === "FREELANCE"}
          >
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={userRole === "FREELANCE"}
          >
            Delete
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="p-4">
          {tasksLoading || usersLoading ? (
            <div>Loading tasks...</div>
          ) : (
            <DataTable
              columns={taskColumns(users)}
              data={tasks}
              users={users}
            />
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
                if (userRole !== "FREELANCE") {
                  onDeleteEvent?.(eventData.event_id);
                }
                if (userRole !== "FREELANCE") {
                  onDeleteEvent?.(eventData.event_id);
                }
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
