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
            toast.success("Daftar pengguna berhasil didapatkan");
        } catch (error) {
            console.log(error instanceof Error ? error.message : "Failed to acknowledge user");
            toast.error("Gagal memuat daftar pengguna");
        } finally {
            setLoading(false);
        }
    }, []);

    const handleDeleteUser = useCallback(async (data: DeleteUserDTO) => {
        setLoading(true);
        try {
            await axios.delete(`${USER_MANAGEMENT_API}`, { data });
            toast.success("User deleted successfully");
            fetchAllUsers(); // Refresh the user list after deletion
        } catch (error) {
            console.error("Error deleting user:", error); // Log the actual error
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
        } catch (error) {
            console.error("Error generating token:", error); // Log the actual error
            toast.error("Failed to generate token");
        } finally {
            setLoading(false);
        }
    }, []);

    return { users, loading, fetchAllUsers, handleDeleteUser, handleGenerateToken };
}