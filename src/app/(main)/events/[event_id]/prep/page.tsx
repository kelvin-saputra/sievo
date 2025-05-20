"use client";

import React from "react";
import { getPrepColumns } from "@/components/event_tasks/prep-columns";
import { DataTable } from "@/components/event_tasks/data-table";
import EventContext from "@/models/context/event.context";
import { useSafeContext } from "@/hooks/use-safe-context";
import { AddTaskModal } from "@/components/event_tasks/form/add-task-modal";
import Loading from "@/components/ui/loading";
import { ADMINEXECUTIVEINTERNAL, checkRoleClient } from "@/lib/rbac-client";

export default function EventPrepPage() {
  const {
    event,
    tasks,
    users,
    loading: tasksLoading,
    handleDeleteTask,
    handleAddTask,
    handleUpdateTask,
  } = useSafeContext(EventContext, "EventContext");

  // console.log("Users from EventContext:", users);

  if (tasksLoading) {
    return <Loading message="Fetching Task Data..."/>
  }

  return (
    <div>
        {checkRoleClient(ADMINEXECUTIVEINTERNAL) && !["DONE", "REPORTING"].includes(event.status) && (
          <div className="mb-4">
            <AddTaskModal
              onAddTask={handleAddTask}
              users={Array.isArray(users) ? users : []}
              currentEventId={event.event_id}
        />
          </div>
        )}
      <DataTable
        columns={getPrepColumns({
          onDeleteTask: handleDeleteTask,
          onUpdateTask: handleUpdateTask,
          users,
          eventStartDate: event.start_date,
          eventEndDate: event.end_date,
        })}
        data={tasks}
        users={Array.isArray(users) ? users : []}
      />
    </div>
  );
}
