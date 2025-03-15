import { useCallback, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { UserSchema } from "@/models/schemas";

export type Proposal = {
  id: string;
  title: string;
  status: string;
  userId: string;
};

const API_URL = process.env.NEXT_PUBLIC_HR_API_URL!;

export type UserWithStatus = UserSchema & {
  status: "inactive" | "available" | "on work";
};

export default function useHr() {
  const [users, setUsers] = useState<UserWithStatus[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAllUsers = useCallback(async () => {
    setLoading(true);
    try {
      console.log("Fetching users from:", `${API_URL}`); // Debugging log
      const { data: validatedUsers } = await axios.get(`${API_URL}`);
      setUsers(validatedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users.");
    }
    setLoading(false);
  }, []);

  return {
    fetchAllUsers,
    users,
    loading,
  };
}
