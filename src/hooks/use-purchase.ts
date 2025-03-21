import { AddPurchaseDTO, UpdatePurchaseDTO } from "@/models/dto/purchasing.dto";
import axios from "axios";
import { toast } from "sonner";

const PURCHASE_API = process.env.NEXT_PUBLIC_PURCHASE_API_URL

export default function usePurchasing() {

    const handleAddPurchase = async(data: AddPurchaseDTO) => {
        // setLoading(true);
        try {
            const requestData = {
                ...data,
                created_by: "7c9e6679-7425-40de-944b-e07fc1f90ae3"
            }
            await axios.post(`${PURCHASE_API}`, requestData);           
            toast.success("Berhasil menambahkan item purchasing") 
        } catch (error) {
            console.log("error hook purchase", error instanceof Error ? error.message : error)
            toast.error("Gagal menambahkan purchase item")
        }
    }

    const handleUpdatePurchase = async (data: UpdatePurchaseDTO) => {
        // setLoading(true);
        try {
            const requestData = {
                ...data,
            }
            console.log("ini adalah requestData", requestData)
            await axios.put(`${PURCHASE_API}`, requestData)
            // setPurchaseItems((prevItems) => prevItems.map((item) => item.other_item_id === purchase_id ? parsedPurchaseItem : item))
            toast.success("Berhasil mengupdate item purchasing")
        } catch {
            toast.error("Gagal mengupdate item purchasing")
        }
    }
    
    const handleDeletePurchase = async (purchase_id: string) => {
        // setLoading(true);
        try {
            const requestData = { purchase_id: purchase_id }
            await axios.delete(`${PURCHASE_API}`, { params: requestData})
            // setPurchaseItems((prevItems) => prevItems.filter((item) => item.other_item_id !== purchase_id))
            toast.success("Berhasil menghapus item purchasing")
        } catch {
            toast.error("Gagal menghapus item purchasing")
        }
    }   

    return {
        // purchaseItems,
        // loading,
        // fetchPurchaseBudget,
        handleAddPurchase,
        handleUpdatePurchase,
        handleDeletePurchase
    }
}