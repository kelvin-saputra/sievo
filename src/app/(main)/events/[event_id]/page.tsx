"use client";

import { Badge } from "@/components/ui/badge";
import { useSafeContext } from "@/hooks/use-safe-context";
import EventContext from "@/models/context/event-context";
import { EventStatusEnum } from "@/models/enums";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

export default function EventDetailPage() {
  const { event, handleStatusChange } = useSafeContext(
    EventContext,
    "EventContext"
  );

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Klien</p>
            <div className="mt-1 p-2 border rounded-md bg-gray-50 text-gray-700">
              {event.client_id}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">PIC</p>
            <div className="mt-1 p-2 border rounded-md bg-gray-50 text-gray-700">
              XXXX
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
            <div className="p-2 border rounded-md bg-gray-50 text-gray-700 w-full">
              {new Date(event.start_date).toLocaleDateString()}
            </div>
            <div className="p-2 border rounded-md bg-gray-50 text-gray-700 w-full">
              {new Date(event.end_date).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-500">Vendor</p>
          <div className="flex gap-2 mt-1">
            <Badge>PT XXXX</Badge>
            <Badge>PT XXXX</Badge>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-500">Keterangan</p>
          <div className="mt-1 p-2 border rounded-md bg-gray-50 text-gray-700">
            {event.notes || "Tidak ada keterangan"}
          </div>
        </div>
      </div>

      <div className="flex flex-col h-full bg-blue-50 p-4 rounded-lg border-2">
        <div>
          <p className="text-sm text-gray-500">Status</p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="cursor-pointer">
                {event.status} <MoreHorizontal className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {EventStatusEnum.options.map((status) => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => handleStatusChange(event.event_id, status)}
                >
                  {status}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="mt-4 flex-1 flex flex-col justify-evenly">
          <div className="p-4 border rounded-lg bg-blue-100">
            <p className="text-sm text-gray-500">Total Client Budget</p>
            <p className="text-2xl font-bold">$xxxx</p>
          </div>
          <div className="p-4 border rounded-lg bg-blue-100">
            <p className="text-sm text-gray-500">Planned Budget</p>
            <p className="text-2xl font-bold">$xxxx</p>
          </div>
          <div className="p-4 border rounded-lg bg-blue-100">
            <p className="text-sm text-gray-500">Expected Participant</p>
            <p className="text-2xl font-bold">{event.participant_plan}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
