import { AddPurchaseDTO, UpdatePurchaseDTO } from "@/models/dto/purchasing.dto";
import { PurchasingSchema } from "@/models/schemas";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

const PURCHASE_API = process.env.NEXT_PUBLIC_PURCHASE_API_URL

export default function usePurchasing() {
    const [loading, setLoading] = useState(false)
    const handleAddPurchase = async(data: AddPurchaseDTO) => {
        setLoading(true);
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
        } finally {
            setLoading(false)
        }
    }

    const handleUpdatePurchase = async (data: UpdatePurchaseDTO) => {
        setLoading(true);
        try {
            const requestData = {
                ...data,
            }
            const {data: updatedPurchase} = await axios.put(`${PURCHASE_API}`, requestData)
            const updatedPurchaseParsed =  PurchasingSchema.parse(updatedPurchase.data)
            setLoading(false);            
            return updatedPurchaseParsed
        } catch (error) {
            console.log("error hook purchase", error instanceof Error ? error.message : error)        } finally {
        } 
    }
    
    const handleDeletePurchase = async (purchase_id: string) => {
        setLoading(true);
        try {
            const requestData = { purchase_id: purchase_id }
            await axios.delete(`${PURCHASE_API}`, { params: requestData})
            toast.success("Berhasil menghapus item purchasing")
        } catch {
            toast.error("Gagal menghapus item purchasing")
        } finally {
            setLoading(false)
        }
    }   

    return {
        loading,
        handleAddPurchase,
        handleUpdatePurchase,
        handleDeletePurchase
    }
}