// src/context/event-context.tsx
import { createContext } from "react";
import { EventSchema, TaskSchema } from "@/models/schemas";
import { UpdateEventDTO } from "@/models/dto/event.dto";
import { UpdateTaskDTO, AddTaskDTO } from "@/models/dto";
import { EventStatusEnum } from "@/models/enums";

interface EventContextType {
  event: EventSchema;
  tasks: TaskSchema[];
  loading: boolean;

  handleUpdateEvent: (
    eventId: string,
    createdBy: string,
    data: UpdateEventDTO
  ) => Promise<void>;
  handleDeleteEvent: (eventId: string) => Promise<void>;
  handleStatusChange: (eventId: string, status: EventStatusEnum) => void;

  fetchAllTasks: () => Promise<void>;
  fetchTaskById: (taskId: string) => Promise<void>;
  handleUpdateTask: (
    taskId: string,
    created_by: string,
    data: UpdateTaskDTO
  ) => Promise<void>;
  handleDeleteTask: (taskId: string) => Promise<void>;
  handleAddTask: (data: AddTaskDTO) => Promise<void>;
}

const EventContext = createContext<EventContextType | null>(null);

export default EventContext;
