import { AddBudgetPlanItemDTO, UpdateBudgetPlanItemDTO } from "@/models/dto";
import { BudgetItemPlanResponse } from "@/models/response/item-plan.response";
import { BudgetPlanItemSchema, BudgetSchema } from "@/models/schemas";
import axios from "axios";
import { useCallback, useState } from "react";
import { toast } from "sonner";


const BUDGET_PLAN_API = process.env.NEXT_PUBLIC_BUDGET_PLAN_API_URL!;
const BUDGET_API = process.env.NEXT_PUBLIC_BUDGET_API_URL!;

export default function useBudgetPlan(event_id:string) {
    const [budgetPlan, setBudgetPlan] = useState<BudgetSchema | null>(null);
    const [budgetPlanItems, setBudgetPlanItems] = useState<BudgetItemPlanResponse[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchBudgetPlan = useCallback(async () => {
        setLoading(true);
        try {
            const { data: rawBudgetPlan } = await axios.get(`${BUDGET_API}`, {params: {event_id:event_id, is_actual:false}});
            setBudgetPlan(() => rawBudgetPlan.data);
        } catch {
        }
        setLoading(false);
    }, [event_id]);

    const fetchAllBudgetPlanItems = useCallback(async () => {
        setLoading(true);
        try {
            let requestData;
            requestData = { event_id: event_id };
            if (budgetPlan?.budget_id !== undefined) {
                requestData = { budget_id: budgetPlan?.budget_id };
            }
            const { data: rawBudgets } = await axios.get(`${BUDGET_PLAN_API}`, { params: requestData });
            const validatedBudgets = rawBudgets.data.map((budget: any) => BudgetItemPlanResponse.parse(budget));
            
            setBudgetPlanItems(validatedBudgets);
        } catch (error) {
            console.log(error instanceof Error ? error.message : error);
        }
        setLoading(false);
    }, [event_id, budgetPlan?.budget_id]);

    const handleAddBudgetPlanItem = async (data: AddBudgetPlanItemDTO) => {
        setLoading(true);
        try {
            const requestData = {
                ...data,
                budget_id: budgetPlan?.budget_id,
            };
            
            const parsedRequest = BudgetPlanItemSchema.parse(requestData);
            const response = await axios.post(`${BUDGET_PLAN_API}`, parsedRequest);

            const parsedBudgetPlanItem = BudgetItemPlanResponse.parse(response.data);
            setBudgetPlanItems((prevItems) => [...prevItems, parsedBudgetPlanItem]);
            toast.success("Berhasil menambahkan item budget plan.");
        } catch {
            toast.error("Gagal menambahkan item budget plan.");
        }
        setLoading(false);
    }

    const handleUpdateBudgetPlanItem = async (data: UpdateBudgetPlanItemDTO) => {
        setLoading(true);
        try {
            const requestData = {
                ...data,
                budget_id: budgetPlan?.budget_id,
            };
            const response = await axios.put(`${BUDGET_PLAN_API}`, requestData);
            const parsedBudgetPlanItem = BudgetItemPlanResponse.parse(response.data);
            setBudgetPlanItems((prevItems) =>
                prevItems.map((item) => (item.budget_item_id === parsedBudgetPlanItem.budget_item_id ? parsedBudgetPlanItem : item))
            );
            toast.success("Berhasil mengubah item budget plan.");
        } catch {
            toast.error("Gagal mengubah item budget plan.");
        }
        setLoading(false);  
    }

    const handleDeleteBudgetPlanItem = async (budgetItemId: string) => {
        setLoading(true);
        try {
            const requestData = { budget_item_id: budgetItemId };
            await axios.delete(`${BUDGET_PLAN_API}`,  { data: requestData });
            setBudgetPlanItems((prevItems) => prevItems.filter((item) => item.budget_item_id !== budgetItemId));
            toast.success("Berhasil menghapus item budget plan.");
        } catch {
            toast.error("Gagal menghapus item budget plan.");
        }
        setLoading(false);
    }

    return {
        budgetPlan,
        budgetPlanItems,
        loading,
        fetchBudgetPlan,
        fetchAllBudgetPlanItems,
        handleAddBudgetPlanItem,
        handleUpdateBudgetPlanItem,
        handleDeleteBudgetPlanItem,
    }
}