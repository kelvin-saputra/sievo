import { AxiosError } from "axios"
import { toast } from "sonner";

export function handlingError(error: AxiosError) {
    const MESSAGE = (error.response?.data as any).message;
    if (MESSAGE) {
        toast.error(MESSAGE);
    }
}

export function handlingSuccess(message: string) {
    toast.success(message)
}