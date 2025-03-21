"use client";

import React from "react";
import { getPrepColumns } from "@/components/event_tasks/prep-columns";
import { DataTable } from "@/components/event_tasks/data-table";
import EventContext from "@/models/context/event.context";
import { useSafeContext } from "@/hooks/use-safe-context";
import { AddTaskModal } from "@/components/event_tasks/add-task-modal";

export default function EventPrepPage() {
  const {
    tasks,
    loading: tasksLoading,
    handleDeleteTask,
    handleAddTask,
    handleUpdateTask,
  } = useSafeContext(EventContext, "EventContext");

  if (tasksLoading) {
    return <div>Loading tasks...</div>;
  }

  return (
    <div>
      <div className="mb-4">
        <AddTaskModal onAddTask={handleAddTask} />
      </div>
      <DataTable
        columns={getPrepColumns({
          onDeleteTask: handleDeleteTask,
          onUpdateTask: handleUpdateTask,
        })}
        data={tasks}
      />
    </div>
  );
}
