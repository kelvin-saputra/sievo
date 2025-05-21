import { AddBudgetItemCategoryDTO, AddBudgetPlanItemDTO, UpdateBudgetDTO, UpdateBudgetItemCategoryDTO, UpdateBudgetPlanItemDTO } from "@/models/dto";
import { BudgetWithCategoryBudgetActual } from "@/models/response/budget-with-category-budget-actual";
import { BudgetWithCategoryBudgetPlan } from "@/models/response/budget-with-category-budget-plan";
import { ActualBudgetItemSchema, BudgetPlanItemSchema } from "@/models/schemas";
import axios from "axios";
import { useCallback, useState } from "react";
import { toast } from "sonner";

const BUDGET_PLAN_API = process.env.NEXT_PUBLIC_BUDGET_PLAN_API_URL!;
const BUDGET_API = process.env.NEXT_PUBLIC_BUDGET_API_URL!;
const BUDGET_IMPL_BATCH_API = process.env.NEXT_PUBLIC_IMPL_BATCH_API_URL!;
const BUDGET_IMPL_API = process.env.NEXT_PUBLIC_BUDGET_ACTUAL_API_URL;
const BUDGET_CATEGORY_API = process.env.NEXT_PUBLIC_BUDGET_CATEGORY_API_URL!;

export default function useBudget(eventId: string) {
    const [budgetPlanData, setBudgetPlanItems] = useState<BudgetWithCategoryBudgetPlan | null>(null);
    const [budgetActualData, setBudgetActualItems] = useState<BudgetWithCategoryBudgetActual | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchBudgetDataPlan = useCallback(async () => {
        setLoading(true);
        try {
            const requestParams = { event_id: eventId, is_actual: false };
            const { data: rawBudgetPlan } = await axios.get(`${BUDGET_API}`, { params: requestParams });
            const validatedBudgetPlan = BudgetWithCategoryBudgetPlan.parse(rawBudgetPlan.data);
            setBudgetPlanItems(validatedBudgetPlan);
        } catch (error) {
            console.log("Error", error instanceof Error ? error.message : error);
        }
        setLoading(false);
    }, [eventId]);

    const fetchBudgetDataActual = useCallback(async () => {
        setLoading(true);
        try {
            const requestParams = { event_id: eventId, is_actual: true };
            const { data: rawBudgetActual } = await axios.get(`${BUDGET_API}`, { params: requestParams });
            console.log(rawBudgetActual)
            const validatedBudgetActual = BudgetWithCategoryBudgetActual.parse(rawBudgetActual.data);
            setBudgetActualItems(validatedBudgetActual);
        } catch (error) {
            console.log("Error", error instanceof Error ? error.message : error);
        } finally {
            setLoading(false);
        }
    }, [eventId]);

    const handleAddBudgetPlanItem = useCallback(async (data: AddBudgetPlanItemDTO) => {
        setLoading(true);
        try {
            const requestData = {
                ...data,
                budget_id: budgetPlanData?.budget_id,
            };
            const parsedRequest = BudgetPlanItemSchema.parse(requestData);
            await axios.post(`${BUDGET_PLAN_API}`, parsedRequest);
            fetchBudgetDataPlan();
            toast.success("Berhasil menambahkan item budget plan.");
        } catch (error) {
            console.log("Error", error instanceof Error ? error.message : error);
            toast.error("Gagal menambahkan item budget plan.");
        }
        setLoading(false);
    }, [budgetPlanData?.budget_id, fetchBudgetDataPlan]);

    const handleUpdateBudgetPlanItem = useCallback(async (data: UpdateBudgetPlanItemDTO) => {
        setLoading(true);
        try {
            const requestData = {
                ...data,
                budget_id: budgetPlanData?.budget_id,
            };
            await axios.put(`${BUDGET_PLAN_API}`, requestData);
            fetchBudgetDataPlan();
            toast.success("Berhasil mengubah item budget plan.");
        } catch (error) {
            console.log("Error", error instanceof Error ? error.message : error);
            toast.error("Gagal mengubah item budget plan.");
        }
        setLoading(false);
    }, [budgetPlanData?.budget_id, fetchBudgetDataPlan]);

    const handleDeleteBudgetPlanItem = useCallback(async (budgetItemId: string) => {
        setLoading(true);
        try {
            const requestData = { budget_item_id: budgetItemId };
            await axios.delete(`${BUDGET_PLAN_API}`, { data: requestData });
            fetchBudgetDataPlan();
            toast.success("Berhasil menghapus item budget plan.");
        } catch {
            toast.error("Gagal menghapus item budget plan.");
        }
        setLoading(false);
    }, [fetchBudgetDataPlan]);

    const handleUpdateBudgetPlanStatus = useCallback(async (data:UpdateBudgetDTO) => {
        setLoading(true);
        const requestData = {
            ...data
        }
        try {
            await axios.put(`${BUDGET_API}`, requestData);
            fetchBudgetDataPlan();
            toast.success("Berhasil memperbaharui status budget!")
        } catch {
            toast.error("Gagal memperbaharui status budget!");
        }
    }, [fetchBudgetDataPlan])

    const handleImportBudgetData = useCallback(async () => {
        setLoading(true);
        try {
            await axios.post(`${BUDGET_IMPL_BATCH_API}`, budgetPlanData);
            fetchBudgetDataActual();
            toast.success("Berhasil mengimpor data budget.");
        } catch {
            toast.error("Gagal mengimpor data budget.");
        }
        setLoading(false);
    }, [budgetPlanData, fetchBudgetDataActual]);

    const handleAddActualBudgetItem = useCallback(async (data: AddBudgetPlanItemDTO) => {
        setLoading(true);
        try {
            const requestData = {
                ...data,
                budget_id: budgetActualData?.budget_id,
            };
            const parsedRequest = ActualBudgetItemSchema.parse(requestData);
            await axios.post(`${BUDGET_IMPL_API}`, parsedRequest);
            fetchBudgetDataActual();
            toast.success("Berhasil menambahkan item budget aktual.");
        } catch {
            toast.error("Gagal menambahkan item budget aktual.");
        } finally {
            setLoading(false);
        }
    }, [budgetActualData?.budget_id, fetchBudgetDataActual]);

    const handleUpdateActualBudgetItem = useCallback(async (data: UpdateBudgetPlanItemDTO) => {
        setLoading(true);
        try {
            const requestData = {
                ...data,
                budget_id: budgetActualData?.budget_id,
            };
            await axios.put(`${BUDGET_IMPL_API}`, requestData);
            fetchBudgetDataActual();
            toast.success("Berhasil mengupdate item budget aktual.");
        } catch {
            toast.error("Gagal mengupdate item budget aktual.");
        } finally {
            setLoading(false);
        }
    }, [budgetActualData?.budget_id, fetchBudgetDataActual]);

    const handleDeleteActualBudgetItem = useCallback(async (actual_budget_item_id: string) => {
        setLoading(true);
        try {
            const requestData = { actual_budget_item_id };
            await axios.delete(`${BUDGET_IMPL_API}`, { data: requestData });
            fetchBudgetDataActual();
            toast.success("Berhasil menghapus item budget aktual.");
        } catch (error) {
            console.log("Error", error instanceof Error ? error.message : error);
            toast.error("Gagal menghapus item budget aktual.");
        }
        setLoading(false);
    }, [fetchBudgetDataActual]);

    const handleAddCategory = useCallback(async (is_actual:boolean, data: AddBudgetItemCategoryDTO) => {
        setLoading(true);
        try {
            const requestData = is_actual? {...data, budget_id: budgetActualData?.budget_id} : {...data, budget_id: budgetPlanData?.budget_id};
            await axios.post(`${BUDGET_CATEGORY_API}`, requestData);
            if (is_actual) {
                fetchBudgetDataActual();
            } else {
                fetchBudgetDataPlan();
            }
            toast.success("Berhasil menambahkan kategori budget.");
        } catch (error) {
            console.log("Error", error instanceof Error ? error.message : error);
            toast.error("Gagal menambahkan kategori budget.");
        }
        setLoading(false);
    }, [budgetActualData?.budget_id, budgetPlanData?.budget_id, fetchBudgetDataActual, fetchBudgetDataPlan])

    const handleUpdateCategory = async (categoryId: number, data: UpdateBudgetItemCategoryDTO) => {
        setLoading(true);
        try {
            const requestData = {
                ...data,
                category_id: categoryId,
            };

            await axios.put(`${BUDGET_CATEGORY_API}`, requestData);
            window.location.reload();

            toast.success("Berhasil mengubah kategori budget.");
        } catch {
            toast.error("Gagal mengubah kategori budget.");
        }
        setLoading(false);
    }

    const handleDeleteCategory = async (categoryId: number, is_actual: boolean) => {
        setLoading(true);
        try {
            const budget_id = is_actual ? budgetActualData?.budget_id : budgetPlanData?.budget_id;
            const requestData = { category_id: categoryId, budget_id: budget_id, is_deleted: true };
            await axios.delete(`${BUDGET_CATEGORY_API}`, { data: requestData });

            if (is_actual) {
                fetchBudgetDataActual();
            } else {
                fetchBudgetDataPlan();
            }
            toast.success("Berhasil menghapus kategori dari budget");
        } catch {
            toast.error("Gagal menghapus kategori budget.");
        }
        setLoading(false);
    }

    return {
        budgetPlanData,
        budgetActualData,
        loading,
        fetchBudgetDataPlan,
        handleAddBudgetPlanItem,
        handleUpdateBudgetPlanItem,
        handleDeleteBudgetPlanItem,
        fetchBudgetDataActual,
        handleImportBudgetData,
        handleAddActualBudgetItem,
        handleUpdateActualBudgetItem,
        handleDeleteActualBudgetItem,
        handleAddCategory,
        handleUpdateCategory,
        handleDeleteCategory,
        handleUpdateBudgetPlanStatus
    }
}