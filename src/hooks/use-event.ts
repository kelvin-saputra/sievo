import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import { EventSchema } from "@/models/schemas";
import { AddEventDTO, UpdateEventDTO } from "@/models/dto";
import { EventStatusEnum } from "@/models/enums";

const API_URL = process.env.NEXT_PUBLIC_EVENT_API_URL!;

export default function useEvent() {
  const router = useRouter();
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
      const updatedData = EventSchema.partial().parse({
        ...data,
        eventId: eventId,
        created_by: created_by,
        // TODO: Connect the people that login ID here
        updated_by: "ID Anonymous",
      });

      const { data: updatedEvent } = await axios.put(
        `${API_URL}/${eventId}`,
        updatedData
      );

      const parsedEvent = EventSchema.parse(updatedEvent);

      setEvents((prevEvents) =>
        prevEvents.map((ev) => (ev.event_id === eventId ? parsedEvent : ev))
      );
      if (event?.event_id === eventId) {
        setEvent(parsedEvent);
      }
      toast.success("Event berhasil diperbarui!");
    } catch (error) {
      console.error("Terjadi kesalahan saat memperbarui event:", error);
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
      const { data: updatedEvent } = await axios.put(
        `${API_URL}/${eventId}/status`,
        { status: newStatus }
      );

      const parsedEvent = EventSchema.parse(updatedEvent.event);
      setEvents((prevEvents) =>
        prevEvents.map((ev) => (ev.event_id === eventId ? parsedEvent : ev))
      );
      if (event?.event_id === eventId) {
        setEvent(parsedEvent);
      }
    } catch (error) {
      console.error("Terjadi kesalahan saat memperbarui status event:", error);
      toast.error("Gagal memperbarui status event.");
    }
    setLoading(false);
  };

  const handleAddEvent = async (newEvent: AddEventDTO) => {
    try {
      const eventData = EventSchema.partial().parse({
        ...newEvent,
        // TODO: Connect the people that login ID here
        created_by: "ID Anonymous",
        updated_by: "ID Anonymous",
      });
      const { data: createdEvent } = await axios.post(API_URL, eventData);
      const parsedEvent = EventSchema.parse(createdEvent);

      setEvents((prevEvents) => [...prevEvents, parsedEvent]);
      toast.success("Event berhasil ditambahkan!");
    } catch (error) {
      console.error("Terjadi kesalahan saat menambahkan event:", error);
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
