import { decryptAES } from "@/lib/aes";
import { DeleteUserDTO, GenerateTokenDTO } from "@/models/dto/user.dto";
import { UserSchema } from "@/models/schemas";
import axios from "axios";
import { useCallback, useState } from "react";
import { toast } from "sonner";

const USER_MANAGEMENT_API = process.env.NEXT_PUBLIC_USER_MANAGEMENT_API_URL;

export default function useUserManagement() {
    const [users, setUsers] = useState<UserSchema[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchAllUsers = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${USER_MANAGEMENT_API}`);
            const transformedData = await Promise.all(data.data.map(async (user: any) => ({
                ...user,
                phone_number: await decryptAES(user.phone_number)
            })));
            const parsedResponse = UserSchema.array().parse(transformedData);
            setUsers(parsedResponse);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleDeleteUser = useCallback(async (data: DeleteUserDTO) => {
        setLoading(true);
        try {
            await axios.delete(`${USER_MANAGEMENT_API}`, { data });
            toast.success("User deleted successfully");
            fetchAllUsers();
        } catch {
            toast.error("Failed to delete user");
        } finally {
            setLoading(false);
        }
    }, [fetchAllUsers]);

    const handleGenerateToken = useCallback(async (data: GenerateTokenDTO) => {
        setLoading(true);
        try {
            const { data: response } = await axios.get(`${USER_MANAGEMENT_API}/gen-token`, { params: { ...data } });
            toast.success("Token generated successfully");
            return response.data;
        } catch {
            toast.error("Failed to generate token");
            return null
        } finally {
            setLoading(false);
        }
    }, []);

    return { users, loading, fetchAllUsers, handleDeleteUser, handleGenerateToken };
}