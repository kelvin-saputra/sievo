"use client";

import { useEffect, useState } from "react";
import { useSafeContext } from "@/hooks/use-safe-context";
import EventContext from "@/models/context/event.context";
import { EventStatusEnum } from "@/models/enums";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { eventStatusColorMap } from "@/utils/eventStatusColorMap";
import { getUserRoleFromStorage } from "@/utils/authUtils";

const taskStatusLabel: Record<string, string> = {
  PENDING: "Belum Dikerjakan",
  ON_PROGRESS: "Sedang Berjalan",
  DONE: "Selesai",
  CANCELLED: "Dibatalkan",
};

const taskStatusColorMap: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  ON_PROGRESS: "bg-blue-100 text-blue-800",
  DONE: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function EventDetailPage() {
  const { event, tasks, budgetPlanItems, client, manager, handleStatusChange } =
    useSafeContext(EventContext, "EventContext");

  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    setUserRole(getUserRoleFromStorage());
  }, []);

  const clientName = client?.name || "-";
  const managerName = manager?.name || "-";

  const clientUrl =
    client?.contact_id && process.env.NEXT_PUBLIC_URL
      ? `${process.env.NEXT_PUBLIC_URL}/contact/${client.contact_id}`
      : "#";

  const start = new Date(event.start_date);
  const end = new Date(event.end_date);
  const today = new Date();
  const msInDay = 1000 * 60 * 60 * 24;
  const diff = Math.ceil((end.getTime() - today.getTime()) / msInDay);

  const dateStatus =
    diff > 0
      ? `${diff} hari lagi`
      : diff === 0
      ? "Hari terakhir"
      : "Sudah lewat";

  const plannedBudget = Array.isArray(budgetPlanItems)
    ? budgetPlanItems.reduce(
        (sum, item) => sum + (Number(item.item_subtotal) || 0),
        0
      )
    : 0;

  const taskStatusCount = {
    PENDING: 0,
    ON_PROGRESS: 0,
    DONE: 0,
    CANCELLED: 0,
  };

  if (Array.isArray(tasks)) {
    tasks.forEach((task) => {
      if (task.status in taskStatusCount) {
        taskStatusCount[task.status]++;
      }
    });
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="flex flex-col h-full space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Klien</p>
            <div className="mt-1 p-2 border rounded-md bg-gray-50 text-gray-700">
              {client?.contact_id ? (
                <a
                  href={clientUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800"
                  title={`Lihat detail klien: ${clientName}`}
                >
                  {clientName}
                </a>
              ) : (
                clientName
              )}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">PIC</p>
            <div className="mt-1 p-2 border rounded-md bg-gray-50 text-gray-700">
              {managerName}
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-500">Lokasi</p>
          <div className="mt-1 p-2 border rounded-md bg-gray-50 text-gray-700">
            {event.location}
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-500">Tanggal</p>
          <div className="flex gap-4 mt-1">
            <div className="flex-1">
              <div className="p-2 border rounded-md bg-gray-50 text-gray-700">
                <span className="text-xs text-gray-400">Mulai:</span>{" "}
                {start.toLocaleDateString("id-ID")}
              </div>
            </div>
            <div className="flex-1">
              <div className="p-2 border rounded-md bg-gray-50 text-gray-700">
                <span className="text-xs text-gray-400">Selesai:</span>{" "}
                {end.toLocaleDateString("id-ID")}
              </div>
            </div>
          </div>
          <div className="text-right mt-1">
            <span className="text-xs px-2 py-1 rounded bg-gray-200 text-gray-700">
              {dateStatus}
            </span>
          </div>
        </div>

        <div className="flex flex-col flex-1">
          <p className="text-sm text-gray-500">Keterangan</p>
          <div className="mt-1 p-2 border rounded-md bg-gray-50 text-gray-700 flex-1 min-h-[6rem]">
            {event.notes || "Tidak ada keterangan"}
          </div>
        </div>

        <div className="p-4 border rounded-md bg-gray-50 text-sm text-gray-700 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500">Dibuat oleh</span>
            <span className="font-medium">{event.created_by || "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Tanggal dibuat</span>
            <span className="font-medium">
              {event.created_at
                ? new Date(event.created_at).toLocaleString("id-ID")
                : "-"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Diperbarui oleh</span>
            <span className="font-medium">{event.updated_by || "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Tanggal diperbarui</span>
            <span className="font-medium">
              {event.updated_at
                ? new Date(event.updated_at).toLocaleString("id-ID")
                : "-"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col h-full bg-blue-50 p-4 rounded-lg border-2">
        <div className="flex gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-500">Status</p>

            {["ADMIN", "EXECUTIVE", "EMPLOYEE"].includes(userRole || "") ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="cursor-pointer w-full flex items-center justify-between gap-2"
                  >
                    <span
                      className={
                        "rounded px-2 py-1 text-xs font-semibold truncate max-w-[130px] " +
                        (eventStatusColorMap[event.status] ||
                          "bg-gray-100 text-gray-800")
                      }
                      title={event.status}
                    >
                      {event.status}
                    </span>
                    <MoreHorizontal className="h-4 w-4 shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {EventStatusEnum.options.map((status) => (
                    <DropdownMenuItem
                      key={status}
                      onClick={() => handleStatusChange(event.event_id, status)}
                    >
                      <span
                        className={
                          "rounded px-2 py-1 text-xs font-semibold " +
                          (eventStatusColorMap[status] ||
                            "bg-gray-100 text-gray-800")
                        }
                      >
                        {status}
                      </span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
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
          </div>

          <div className="flex flex-row items-center justify-between bg-blue-100 border rounded-lg px-4 min-w-[200px]">
            <span className="text-sm text-gray-600">Jumlah Peserta</span>
            <span className="text-lg font-bold">{event.participant_plan}</span>
          </div>
        </div>

        <div className="mt-4 flex-1 flex flex-col justify-evenly gap-4">
          <div className="p-4 border rounded-lg bg-blue-100">
            <p className="text-sm text-gray-500">Total Anggaran Rencana</p>
            <p className="text-2xl font-bold">
              Rp{plannedBudget.toLocaleString("id-ID")}
            </p>
          </div>
          <div className="p-4 border rounded-lg bg-blue-100">
            <p className="text-sm text-gray-500 mb-4">Progress Tugas</p>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(taskStatusCount).map(([status, count]) => (
                <div
                  key={status}
                  className={
                    "flex flex-col items-center justify-center rounded-lg p-4 border " +
                    (taskStatusColorMap[status] || "bg-gray-100 text-gray-800")
                  }
                  style={{ minWidth: 120 }}
                  title={`${taskStatusLabel[status]}: ${count} tugas`}
                >
                  <span className="text-3xl font-extrabold leading-tight">
                    {count}
                  </span>
                  <span className="text-xs font-semibold mt-2 opacity-80 text-center">
                    {taskStatusLabel[status]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
