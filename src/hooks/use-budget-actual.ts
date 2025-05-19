import { AddActualBudgetItemDTO, UpdateActualBudgetItemDTO } from "@/models/dto";
import { ActualBudgetItemResponse } from "@/models/response/item-actual.response";
import { ActualBudgetItemSchema, BudgetSchema } from "@/models/schemas";
import axios from "axios";
import { useCallback, useState } from "react";
import { toast } from "sonner";

const BUDGET_IMPL_API = process.env.NEXT_PUBLIC_BUDGET_ACTUAL_API_URL;
const BUDGET_PLAN_API= process.env.NEXT_PUBLIC_BUDGET_PLAN_API_URL!;
const BUDGET_IMPL_BATCH_API = process.env.NEXT_PUBLIC_IMPL_BATCH_API_URL!;
const BUDGET_API = process.env.NEXT_PUBLIC_BUDGET_API_URL!;

export default function useActualBudget(event_id: string) {
    const [actualBudget, setActualBudget] = useState<BudgetSchema | null>(null);
    const [actualBudgetItems, setActualBudgetItems] = useState<ActualBudgetItemResponse[]>([]);
    const [loading, setLoading] = useState(false);

    const handleImportBudgetData = useCallback(async () => {
        setLoading(true);
        try {
            const {data: rawActualBudget} = await axios.get(`${BUDGET_PLAN_API}`, {params: {event_id: event_id}});
            const {data} = await axios.post(`${BUDGET_IMPL_BATCH_API}`, rawActualBudget.data);            
            setActualBudgetItems(data)
        } catch {
            toast.error("Gagal mengambil data budget aktual.");
        }
        setLoading(false);
    }, [event_id]);

    const fetchActualBudget = useCallback(async () => {
        setLoading(true);
        try {
            const { data: rawActualBudget } = await axios.get(`${BUDGET_API}`, {params: {event_id:event_id, is_actual:true}});
            setActualBudget(() => rawActualBudget.data);
        } catch {
        }
        setLoading(false);
    }, [event_id]);

    const fetchAllActualBudgetItems = useCallback(async () => {
        setLoading(true);
        try {
            let requestData;
            requestData = { event_id: event_id };
            if (actualBudget?.budget_id !== undefined) {
                requestData = { budget_id: actualBudget?.budget_id };
            }
            const { data: rawActualBudgetItems } = await axios.get(`${BUDGET_IMPL_API}`, { params: requestData });
            const validatedActualBudgetItems = rawActualBudgetItems.data.map((budget: any) => ActualBudgetItemResponse.parse(budget));
            setActualBudgetItems(validatedActualBudgetItems);
        } catch (error){
            console.log(error instanceof Error ? error.message : error);
        }
        setLoading(false);
    }, [event_id, actualBudget?.budget_id]);

    const handleAddActualBudgetItem = async(data: AddActualBudgetItemDTO) => {
        setLoading(true);
        try {
            const requestData = {
                ...data,
                budget_id: actualBudget?.budget_id,
            };
            const parsedRequest = ActualBudgetItemSchema.parse(requestData)
            const response = await axios.post(`${BUDGET_IMPL_API}`, parsedRequest);

            const parsedActualBudgetItem = ActualBudgetItemResponse.parse(response.data);
            setActualBudgetItems((prevItems) => [...prevItems, parsedActualBudgetItem]);
            toast.success("Berhasil menambahkan item budget aktual.");
        } catch (error) {
            console.log(error instanceof Error ? error.message : error);
            toast.error("Gagal menambahkan item budget aktual.");
        }
        setLoading(false);
    }

    const handleUpdateActualBudgetItem = async (data: UpdateActualBudgetItemDTO) => {
        setLoading(true);
        try {
            const requestData = {
                ...data,
                budget_id: actualBudget?.budget_id,
            };
            const response = await axios.put(`${BUDGET_IMPL_API}`, requestData);

            const parsedActualBudgetItem = ActualBudgetItemResponse.parse(response.data);
            setActualBudgetItems((prevItems) =>
                prevItems.map((item) => (item.actual_budget_item_id === parsedActualBudgetItem.actual_budget_item_id ? parsedActualBudgetItem : item))
            );
            toast.success("Berhasil mengupdate item budget aktual.");
        } catch {
            toast.error("Gagal mengupdate item budget aktual.");
        }
        setLoading(false);
    }

    const handleDeleteActualBudgetItem = async (actual_budget_item_id: string) => {
        setLoading(true);
        try {
            const requestData = {
                actual_budget_item_id: actual_budget_item_id,
            }
            await axios.delete(`${BUDGET_IMPL_API}`, { data: requestData });
            setActualBudgetItems((prevItems) => prevItems.filter((item) => item.actual_budget_item_id !== actual_budget_item_id));
            toast.success("Berhasil menghapus item budget aktual.");
        } catch {
            toast.error("Gagal menghapus item budget aktual.");
        }
        setLoading(false);
    }

    return {
        actualBudget,
        actualBudgetItems,
        loading,
        fetchActualBudget,
        fetchAllActualBudgetItems,
        handleAddActualBudgetItem,
        handleUpdateActualBudgetItem,
        handleDeleteActualBudgetItem,
        handleImportBudgetData,
    };
}