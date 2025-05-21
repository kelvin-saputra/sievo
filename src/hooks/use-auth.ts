import { encryptAES } from "@/lib/aes";
import { LoginDTO, RegisterDTO } from "@/models/dto";
import { UserSchema } from "@/models/schemas"
import { handlingError, handlingSuccess } from "@/utils/toastHandler";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

const AUTH_API = process.env.NEXT_PUBLIC_AUTH_API_URL;

export default function useAuthentication() {
    const router = useRouter();
    const [user, setUser] = useState<UserSchema | null>(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = useCallback(async (data: LoginDTO) => {
        setLoading(true);
        try {
            const requestData = {
                ...data,
            }
            const { data: dataResponse } = await axios.post(`${AUTH_API}/login`, requestData);
            const parsedResponse = UserSchema.parse(dataResponse.data);
            setUser(parsedResponse);
            const userAccess = {
                id: parsedResponse.id,
                name: parsedResponse.name,
                email: parsedResponse.email,
                role: parsedResponse.role,
                is_admin: parsedResponse.is_admin
            }
            localStorage.setItem("authUser", JSON.stringify(userAccess))
            handlingSuccess("Login successful");
            setLoading(false);
            return true;
        } catch (error) {
            handlingError(error as AxiosError);
            setLoading(false);
            return false;
        }
    }, [])

    const handleRegister = useCallback(async (data: RegisterDTO) => {
        setLoading(true);
        try {
            const { token, ...registerData } = data;
            const requestData = {
                ...registerData,
            }
            const parsedRequest = UserSchema.parse(requestData);
            const response = await axios.post(`${AUTH_API}/register`, parsedRequest, { params: { token: await encryptAES(token) } });
            const { } = UserSchema.parse(response.data.data);
            handlingSuccess("Registration successful, please login");
        } catch (error) {
            handlingError(error as AxiosError);
        }
    }, []);

    const handleAck = useCallback(async () => {
        setLoading(true);
        try {
            const requestData = {
                id: user?.id,
            }
            const { } = await axios.post(`${AUTH_API}/ack`, requestData);
        } catch (error) {
            handlingError(error as AxiosError);
        }
        setLoading(false);
    }, [user?.id]);

    const handleLogout = useCallback(async () => {
        setLoading(true);
        try {
            const { } = await axios.get(`${AUTH_API}/logout`)
            setUser(null);
            localStorage.removeItem("authUser");
            handlingSuccess("Logout successful");
            router.replace("/auth/login");
        } catch (error) {
            handlingError(error as AxiosError);
        }
    }, [router]);

    const handleCheckToken = useCallback(async (token: string) => {
        setLoading(true);
        try {
            const requestData = {
                token: token
            }
            const { } = await axios.post(`${AUTH_API}/check-token`, requestData);
            handlingSuccess("Token valid, please continue with registration");
            setLoading(false);
            return true;
        } catch (error) {
            handlingError(error as AxiosError);
            setLoading(false);
            return false;
        }
    }, []);

    return {
        user,
        loading,
        handleLogin,
        handleRegister,
        handleAck,
        handleLogout,
        handleCheckToken
    }
}