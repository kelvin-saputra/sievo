"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { TaskSchema } from "@/models/schemas";
import { taskColumns } from "@/components/event_tasks/columns";
import { UpdateTaskModal } from "./update-task-modal";
import { UpdateTaskDTO } from "@/models/dto";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import * as React from "react";

interface PrepColumnsProps {
  onDeleteTask: (taskId: string) => void;
  onUpdateTask: (
    taskId: string,
    createdBy: string,
    dto: UpdateTaskDTO
  ) => Promise<void>;
}

// Inline component for deletion confirmation
const DeleteTaskCell = ({
  task,
  onDeleteTask,
}: {
  task: TaskSchema;
  onDeleteTask: (taskId: string) => void;
}) => {
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  return (
    <>
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="p-2 hover:bg-gray-200 rounded-md transition"
            onClick={(e) => {
              e.stopPropagation();
              setConfirmOpen(true);
            }}
          >
            <Trash2 size={18} className="text-red-500" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Penghapusan</DialogTitle>
          </DialogHeader>
          <p className="my-4">Apakah Anda yakin ingin menghapus task ini?</p>
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setConfirmOpen(false);
              }}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setConfirmOpen(false);
                onDeleteTask(task.task_id);
              }}
            >
              Hapus
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const getPrepColumns = ({
  onDeleteTask,
  onUpdateTask,
}: PrepColumnsProps): ColumnDef<TaskSchema>[] => [
  ...taskColumns,
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const task = row.original;
      return (
        <div className="flex justify-start gap-2">
          <UpdateTaskModal task={task} onUpdateTask={onUpdateTask} />
          <DeleteTaskCell task={task} onDeleteTask={onDeleteTask} />
        </div>
      );
    },
    enableSorting: false,
  },
];
