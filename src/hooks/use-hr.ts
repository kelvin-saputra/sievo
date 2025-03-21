import { useCallback, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { UserSchema } from "@/models/schemas";

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
      const { data: validatedUsers } = await axios.get(`${API_URL}`);
      setUsers(validatedUsers);
    } catch (error) {
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
