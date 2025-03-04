import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import { TaskSchema } from "@/models/schemas";
import { AddTaskDTO, UpdateTaskDTO } from "@/models/dto";

const API_URL = process.env.NEXT_PUBLIC_EVENT_API_URL!;

export default function useEventTask(eventId: string) {
  const router = useRouter();
  const [task, setTask] = useState<TaskSchema | null>(null);
  const [tasks, setTasks] = useState<TaskSchema[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAllTasks = useCallback(async () => {
    setLoading(true);
    try {
      const { data: rawTasks } = await axios.get(`${API_URL}/${eventId}/task`);
      const validatedTasks = rawTasks.map((t: any) => TaskSchema.parse(t));
      setTasks(validatedTasks);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data task:", error);
      toast.error("Gagal mengambil data task.");
    }
    setLoading(false);
  }, [eventId]);

  const fetchTaskById = useCallback(
    async (taskId: string) => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${API_URL}/${eventId}/task/${taskId}`
        );
        setTask(TaskSchema.parse(data));
      } catch (error) {
        console.error("Terjadi kesalahan saat mengambil task:", error);
        toast.error("Gagal mengambil task.");
      }
      setLoading(false);
    },
    [eventId]
  );

  const handleUpdateTask = async (
    taskId: string,
    created_by: string,
    data: UpdateTaskDTO
  ) => {
    try {
      const updatedData = TaskSchema.partial().parse({
        ...data,
        taskId: taskId,
        created_by: created_by,
        // TODO: Replace with logged-in user ID
        updated_by: "ID Anonymous",
      });

      const { data: updatedTask } = await axios.put(
        `${API_URL}/${eventId}/task/${taskId}`,
        updatedData
      );
      const parsedTask = TaskSchema.parse(updatedTask);
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.task_id === taskId ? parsedTask : t))
      );
      if (task?.task_id === taskId) {
        setTask(parsedTask);
      }
      toast.success("Task berhasil diperbarui!");
    } catch (error) {
      console.error("Terjadi kesalahan saat memperbarui task:", error);
      toast.error("Gagal memperbarui task.");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await axios.delete(`${API_URL}/${eventId}/task/${taskId}`);
      setTasks((prevTasks) => prevTasks.filter((t) => t.task_id !== taskId));
      toast.success("Task berhasil dihapus!");
    } catch (error) {
      console.error("Terjadi kesalahan saat menghapus task:", error);
      toast.error("Gagal menghapus task.");
    }
  };

  const handleAddTask = async (newTask: AddTaskDTO) => {
    try {
      const taskData = TaskSchema.partial().parse({
        ...newTask,
        // TODO: Replace with logged-in user ID
        created_by: "ID Anonymous",
        updated_by: "ID Anonymous",
      });

      const { data: createdTask } = await axios.post(
        `${API_URL}/${eventId}/task`,
        taskData
      );
      const parsedTask = TaskSchema.parse(createdTask);

      setTasks((prevTasks) => [...prevTasks, parsedTask]);
      toast.success("Task berhasil ditambahkan!");
    } catch (error) {
      console.error("Terjadi kesalahan saat menambahkan task:", error);
      toast.error("Gagal menambahkan task.");
    }
  };

  return {
    task,
    tasks,
    loading,
    fetchAllTasks,
    fetchTaskById,
    handleUpdateTask,
    handleDeleteTask,
    handleAddTask,
  };
}
