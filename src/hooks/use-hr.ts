
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
  const [users, setUsers] = useState<UserEventsSchema[]>([]);
  const [userEvents, setUserEvents]= useState<UserEventsSchema | null>(null);
  const [userAssigned, setUsersAssigned] = useState<UserWithStatus[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [userToReassign, setUserToReassign] = useState<string | null>(null);

  const fetchAllUsersAssigned = useCallback(async () => {
    setLoading(true);
    try {
      const { data: validatedUsers } = await axios.get(`${API_URL}/assigned`);
      setUsersAssigned(validatedUsers);
    } catch {
      toast.error("Failed to fetch users.");
    }
    setLoading(false);
  }, []);

  const fetchUserEventById = useCallback(async (userId: string): Promise<UserWithStatus | null> => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/assigned/${userId}`);
      return data as UserWithStatus;
    } catch (error) {
      console.error("Failed to fetch user:", error);
      toast.error("Failed to fetch user.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

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

  const fetchUserById = useCallback(async (userId: string): Promise<UserWithStatus | null> => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/${userId}`);
      return data as UserWithStatus;
    } catch (error) {
      console.error("Failed to fetch user:", error);
      toast.error("Failed to fetch user.");
      return null;
    } finally {
      setLoading(false);
    }
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
      setLoading(true);

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
      setLoading(false);
    },
    []
  );

  const handleConfirmAssignment = async (user_id: string, event_ids: string[]) => {
    setConfirmationModalOpen(false);
    setLoading(true);
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
    setLoading(false);
  };

  const handleCancelAssignment = () => {
    setConfirmationModalOpen(false);
  };

  const fetchAssignmentByUserId = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/assignment/${id}`);
      console.log('Response data:', data);
      setUserEvents(UserEventsSchema.parse(data.data));
    } catch (error) {
      console.log("Error : " ,error)
       toast.error("Gagal mengambil Data Penugasan.");
    }
    setLoading(false)
  },[])

 const handleDeleteAssignment = async (id: string) => {
    try {


      let userEmail = "";
      console.log("usereventid:", id);
      const userData = localStorage.getItem("authUser");
      if (userData) {
        const user = JSON.parse(userData);
        userEmail = user.email || "";
      }
      const response = await axios.delete(`${API_URL}/${id}`, {
        data: {
          update_by: userEmail,
        },
      });

      

      if (response.status === 200) {
        toast.success("Assignment deleted successfully!");
        window.location.reload();
      } else {
        toast.error("Failed to delete assignment.");
      }
    } catch (error) {
      console.log("usereventid:", id);
      toast.error("Failed to delete assignment.");
      console.error("Delete assignment error:", error);
    }
  };


  return {
    fetchAllUsers,
    fetchUserById,
    fetchAllEvents,
    fetchAssignmentByUserId,
    assignUserToEvents,
    handleDeleteAssignment,
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
    fetchAllUsersAssigned,
    userAssigned,
    fetchUserEventById
  };
}
