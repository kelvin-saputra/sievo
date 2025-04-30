import { AddBudgetItemCategoryDTO, UpdateBudgetItemCategoryDTO } from "@/models/dto";
import { BudgetItemCategorySchema } from "@/models/schemas";
import axios from "axios";
import { useCallback, useState } from "react";
import { toast } from "sonner";

const BUDGET_CATEGORY_API = process.env.NEXT_PUBLIC_BUDGET_CATEGORY_API_URL!;

export default function useCategory(eventId: string, budgetPlanId: string, actualBudgetId: string) {
    const [categoriesPlan, setCategoriesPlan] = useState<BudgetItemCategorySchema[]>([]);
    const [actualCategories, setActualCategories] = useState<BudgetItemCategorySchema[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchCategoriesByBudgetIdPlan = useCallback(async () => {
        setLoading(true);
        try {
            const requestData = { event_id: eventId, is_actual: false };
            const { data: rawCategories } = await axios.get(`${BUDGET_CATEGORY_API}`, { params: requestData });
            const validatedCategories = rawCategories.data.map((cat: any) => BudgetItemCategorySchema.parse(cat));
            setCategoriesPlan(validatedCategories);
            console.log("Categories Plan", validatedCategories);
        } catch {
            console.log("Error");
        }
        setLoading(false);
    }, [eventId]);

    const fetchCategoriesByActualBudgetId = useCallback(async () => {
        setLoading(true);
        try {
            console.log("masuk ke dalam  hook")
            const requestData = { event_id: eventId, is_actual: true };
            const { data: rawCategories } = await axios.get(`${BUDGET_CATEGORY_API}`, { params: requestData });
            const validatedCategories = rawCategories.data.map((cat: any) => BudgetItemCategorySchema.parse(cat));
            console.log("Validated Categories", validatedCategories);
            setActualCategories(validatedCategories);
            console.log("Actual Categories", validatedCategories);
        } catch (error) {
            console.log("Error", error instanceof Error ? error.message : error);
        }
        setLoading(false);
    }, [eventId]);

    const handleAddCategory = async (is_actual: boolean, data: AddBudgetItemCategoryDTO) => {
        setLoading(true);
        console.log("Masuk Ke dalam add category");
        try {
            console.log(budgetPlanId, actualBudgetId);
            const requestData = is_actual ? { ...data, budget_id: actualBudgetId } : { ...data, budget_id: budgetPlanId };

            const { data: response } = await axios.post(`${BUDGET_CATEGORY_API}`, requestData);
            const parsedCategory = BudgetItemCategorySchema.parse(response.data);

            if (is_actual) {
                setActualCategories((prevCategories) => [...prevCategories, parsedCategory]);
            } else {
                setCategoriesPlan((prevCategories) => [...prevCategories, parsedCategory]);
            }

            toast.success("Berhasil menambahkan kategori budget.");
        } catch (error) {
            console.log("Error", error instanceof Error ? error.message : error);
            toast.error("Gagal menambahkan kategori budget.");
        }
        setLoading(false);
    }

    const handleUpdateCategory = async (categoryId: number, data: UpdateBudgetItemCategoryDTO) => {
        setLoading(true);
        try {
            const requestData = {
                ...data,
                category_id: categoryId,
            };

            const { data: response } = await axios.put(`${BUDGET_CATEGORY_API}`, requestData);
            const parsedCategory = BudgetItemCategorySchema.parse(response.data);

            setCategoriesPlan((prevCategories) =>
                prevCategories.map((cat) => (cat.category_id === parsedCategory.category_id ? parsedCategory : cat))
            );

            toast.success("Berhasil mengubah kategori budget.");
        } catch {
            toast.error("Gagal mengubah kategori budget.");
        }
        setLoading(false);
    }

    const handleDeleteCategory = async (categoryId: number, is_actual: boolean) => {
        setLoading(true);
        try {
            const budget_id = is_actual ? actualBudgetId : budgetPlanId;
            const requestData = { category_id: categoryId, budget_id: budget_id, is_deleted: true };
            await axios.delete(`${BUDGET_CATEGORY_API}`, { data: requestData });

            if (is_actual) {
                setActualCategories((prevCategories) => prevCategories.filter((cat) => cat.category_id !== categoryId));
            } else {
                setCategoriesPlan((prevCategories) => prevCategories.filter((cat) => cat.category_id !== categoryId));
            }
            toast.success("Berhasil menghapus kategori dari budget");
        } catch {
            toast.error("Gagal menghapus kategori budget.");
        }
        setLoading(false);
    }

    return {
        categoriesPlan,
        actualCategories,
        loading,
        fetchCategoriesByBudgetIdPlan,
        fetchCategoriesByActualBudgetId,
        handleAddCategory,
        handleUpdateCategory,
        handleDeleteCategory,
    }
}