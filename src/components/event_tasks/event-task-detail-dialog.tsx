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

interface EventTaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventData: TaskSchema;
}

export function EventTaskDetailModal({
  isOpen,
  onClose,
  eventData,
}: EventTaskDetailModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-lg"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle>{eventData.title}</DialogTitle>
          <DialogDescription>Detail tugas dari event ini.</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <p>
            <strong>Task ID:</strong> {eventData.task_id}
          </p>
          <p>
            <strong>Judul:</strong> {eventData.title}
          </p>
          <p>
            <strong>Deskripsi:</strong>{" "}
            {eventData.description || "Tidak ada deskripsi"}
          </p>
          <p>
            <strong>Assigned To:</strong>{" "}
            {eventData.assigned_id || "Unassigned"}
          </p>
          <p>
            <strong>Tanggal Jatuh Tempo:</strong>{" "}
            {eventData.due_date
              ? new Date(eventData.due_date).toLocaleDateString()
              : "N/A"}
          </p>
          <p>
            <strong>Status:</strong> {eventData.status}
          </p>
          <p>
            <strong>Dibuat Oleh:</strong> {eventData.created_by}
          </p>
          <p>
            <strong>Diperbarui Oleh:</strong> {eventData.updated_by}
          </p>
          <p>
            <strong>Tanggal Dibuat:</strong>{" "}
            {new Date(eventData.created_at).toLocaleString()}
          </p>
          <p>
            <strong>Tanggal Diperbarui:</strong>{" "}
            {eventData.updated_at
              ? new Date(eventData.updated_at).toLocaleString()
              : "N/A"}
          </p>
          <p>
            <strong>ID Event:</strong> {eventData.event_id}
          </p>
        </div>
        <DialogFooter>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
