import { UpdateUserProfileDTO } from "@/models/dto/user.dto";
import { UserSchema } from "@/models/schemas"
import axios from "axios";
import { useCallback, useState } from "react";
import { toast } from "sonner";

const PROFILE_API = process.env.NEXT_PUBLIC_PROFILE_API_URL;

export default function useProfile() {
    const [user, setUser] = useState<UserSchema | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchProfile = useCallback(async () => {
        setLoading(true);
        try {
            const { data: dataResponse } = await axios.get(`${PROFILE_API}`);
            const parsedResponse = UserSchema.parse(dataResponse.data);
            setUser(parsedResponse);
            toast.success("Profile berhasil didapatkan!");
        } catch {
            toast.success("Profil tidak tersedia, silakan coba lagi nanti");
        }
    }, [])

    const handleUpdateProfile = useCallback(async (data: UpdateUserProfileDTO) => {
        setLoading(true);
        try {
            const { ...userData } = data;
            const requestData = {
                ...userData,
            }
            const { data: response } = await axios.post(`${PROFILE_API}`, requestData);

            const userResponse = UserSchema.parse(response.data);
            setUser(userResponse);
            const userAccess = {
                id: userResponse.id,
                name: userResponse.name,
                email: userResponse.email,
                role: userResponse.role,
                is_admin: userResponse.is_admin
            }
            localStorage.setItem("authUser", JSON.stringify(userAccess))
            toast.success("Berhasil Memperbaharui Profile!");
        } catch {
            toast.error("Gagal memperbarui profil, coba lagi beberapa saat lagi.");
        }
    }, []);
    return {
        user,
        loading,
        fetchProfile,
        handleUpdateProfile
    }
}