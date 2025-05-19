"use client"

import { useCallback, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { EventSchema, UserSchema } from "@/models/schemas";
import { UserEventsSchema } from "@/models/schemas/user-event";

const API_URL = process.env.NEXT_PUBLIC_HR_API_URL!;
const EVENT_API_URL = process.env.NEXT_PUBLIC_EVENT_API_URL!;

export type UserWithStatus = UserSchema & {
  status: "unassigned" | "inactive" | "assigned";
};

export type Event = {
  event_id: string;
  event_name: string;
};

export default function useHr() {
  const [users, setUsers] = useState<UserWithStatus[]>([]);
  const [userEvents, setUserEvents]= useState<UserEventsSchema | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [userToReassign, setUserToReassign] = useState<string | null>(null);

  const fetchAllUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data: validatedUsers } = await axios.get(`${API_URL}`);
      setUsers(validatedUsers);
    } catch {
      toast.error("Failed to fetch users.");
    }
    setLoading(false);
  }, []);

  const fetchAllEvents = useCallback(async () => {
    setLoading(true);
    try {
      const { data: rawEvents } = await axios.get(EVENT_API_URL);
      const validatedEvents = rawEvents.map((ev: any) => EventSchema.parse(ev));
      setEvents(validatedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to fetch events.");
    }
    setLoading(false);
  }, []);

  const assignUserToEvents = useCallback(
    async (user_id: string, event_ids: string[]) => {
      setAssigning(true);
      const userData = localStorage.getItem("authUser");
      let userEmail = "";

      if (userData) {
        const user = JSON.parse(userData);
        userEmail = user.email || "";
      }

      try {
        const response = await axios.post(`${API_URL}`, {
          user_id,
          event_ids,
          updated_by: userEmail,
        });

        
        if (response.status === 200 && response.data.success === false) {
          setUserToReassign(user_id);
          setConfirmationModalOpen(true);
          setAssigning(false);
          return;
        }

        if (response.status === 201) {
          window.location.reload();
          if (response.data.success === false) {
              setUserToReassign(user_id);
              setConfirmationModalOpen(true);
              setAssigning(false);
              return;
            }
          toast.success("User successfully assigned to events");
        } else {
          toast.error("Failed to assign user to events.");
        }
      } catch (error: any) {
        if (error.status === 409) {
          toast.error("User already assigned to this event.");
          setAssigning(false);
          return;
        }
        console.error("Error fetching events:", error);
        toast.error("Error assigning user to events.");
      }
      setAssigning(false);
    },
    []
  );

  const handleConfirmAssignment = async (user_id: string, event_ids: string[]) => {
    setConfirmationModalOpen(false);
    try {
      const userData = localStorage.getItem("authUser");
      let userEmail = "";

      if (userData) {
        const user = JSON.parse(userData);
        userEmail = user.email || "";
      }
      const response = await axios.post(`${API_URL}/confirmation-handle`, {
        user_id,
        event_ids,
        updated_by: userEmail,
      });

      if (response.status === 201) {
        window.location.reload();
        toast.success("User successfully assigned to events");
      } else {
        toast.error("Failed to assign user to events.");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Error confirming assignment.");
    }
  };
  
  const handleCancelAssignment = () => {
    setConfirmationModalOpen(false);
  };

  const fetchAssignmentByUserId = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/${id}`);
      console.log('Response data:', data);
      setUserEvents(UserEventsSchema.parse(data.data));
    } catch (error) {
      console.log("Error : " ,error)
       toast.error("Gagal mengambil Data Penugasan.");
    }
    setLoading(false)
  },[])


  return {
    fetchAllUsers,
    fetchAllEvents,
    fetchAssignmentByUserId,
    assignUserToEvents,
    users,
    events,
    userEvents,
    loading,
    assigning,
    confirmationModalOpen,
    setConfirmationModalOpen,
    handleConfirmAssignment,
    handleCancelAssignment,
    userToReassign,
  };
}
