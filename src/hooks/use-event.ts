"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import axios from "axios";
import { BudgetSchema, EventSchema } from "@/models/schemas";
import { AddBudgetDTO, AddEventDTO, UpdateEventDTO } from "@/models/dto";
import { EventStatusEnum } from "@/models/enums";
import { getUserDataClient } from "@/lib/userData";

const API_URL = process.env.NEXT_PUBLIC_EVENT_API_URL!;
const BUDGET_API_URL = process.env.NEXT_PUBLIC_BUDGET_API_URL!;

export default function useEvent() {
  const [event, setEvent] = useState<EventSchema | null>(null);
  const [events, setEvents] = useState<EventSchema[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAllEvents = useCallback(async () => {
    setLoading(true);
    try {
      const { data: rawEvents } = await axios.get(API_URL);
      const validatedEvents = rawEvents.map((ev: any) => EventSchema.parse(ev));
      setEvents(validatedEvents);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data event:", error);
      toast.error("Gagal mengambil data event.");
    }
    setLoading(false);
  }, []);

  const fetchEventById = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/${id}`);
      setEvent(EventSchema.parse(data));
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil event:", error);
      toast.error("Gagal mengambil event.");
    }
    setLoading(false);
  }, []);

  const handleUpdateEvent = async (
    eventId: string,
    created_by: string,
    data: UpdateEventDTO
  ) => {
    try {
      const userName = getUserDataClient().name;
      if (!userName) {
        toast.error("User belum login, tidak bisa memperbarui event.");
        return;
      }

      const updatedData = EventSchema.partial().parse({
        ...data,
        event_id: eventId,
        created_by,
        updated_by: userName,
      });

      const { data: response } = await axios.put(`${API_URL}`, updatedData);

      const parsedEvent = EventSchema.parse(response.data);

      setEvents((prevEvents) =>
        prevEvents.map((ev) => (ev.event_id === eventId ? parsedEvent : ev))
      );
      if (event?.event_id === eventId) {
        setEvent(parsedEvent);
      }
      toast.success("Event berhasil diperbarui!");
    } catch {
      toast.error("Gagal memperbarui event.");
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await axios.delete(`${API_URL}/${eventId}`);
      setEvents((prevEvents) =>
        prevEvents.filter((ev) => ev.event_id !== eventId)
      );
      toast.success("Event berhasil dihapus!");
    } catch (error) {
      console.error("Terjadi kesalahan saat menghapus event:", error);
      toast.error("Gagal menghapus event.");
    }
  };

  const handleStatusChange = async (
    eventId: string,
    newStatus: EventStatusEnum
  ) => {
    try {
      const userName = getUserDataClient().name;
      if (!userName) {
        toast.error("User belum login, tidak bisa memperbarui status event.");
        return;
      }

      const { data: updatedEvent } = await axios.put(
        `${API_URL}/${eventId}/status`,
        {
          status: newStatus,
          updated_by: userName,
        }
      );

      const parsedEvent = EventSchema.parse(updatedEvent.event);
      setEvents((prevEvents) =>
        prevEvents.map((ev) => (ev.event_id === eventId ? parsedEvent : ev))
      );
      if (event?.event_id === eventId) {
        setEvent(parsedEvent);
      }
      toast.success("Status event berhasil diperbarui!");
      toast.success("Status event berhasil diperbarui!");
    } catch (error) {
      console.error("Terjadi kesalahan saat memperbarui status event:", error);
      toast.error("Gagal memperbarui status event.");
    }
    setLoading(false);
  };



  const handleAddEvent = async (newEvent: AddEventDTO) => {
    try {
      const userName = getUserDataClient().name;
      if (!userName) {
        toast.error("User belum login, tidak bisa menambahkan event.");
        return;
      }

      const eventData = EventSchema.partial().parse({
        ...newEvent,
        created_by: userName,
        updated_by: userName,
      });


      const { data: createdEvent } = await axios.post(API_URL, eventData);
      const parsedEvent = EventSchema.parse(createdEvent);


      setEvents((prevEvents) => [...prevEvents, parsedEvent]);

      const addBudgetDTO: AddBudgetDTO = {
        status: "PENDING",
        created_by: parsedEvent.manager_id,
        event_id: createdEvent.event_id,
      };

      const budgetData = BudgetSchema.partial().parse({
        ...addBudgetDTO,
      });


      await axios.post(BUDGET_API_URL, budgetData);
    } catch {
      toast.error("Gagal menambahkan event.");
    }
  };

  return {
    event,
    events,
    loading,
    fetchAllEvents,
    fetchEventById,
    handleUpdateEvent,
    handleDeleteEvent,
    handleStatusChange,
    handleAddEvent,
  };
}
