import { toast } from "sonner";
import axios from "axios";
import { useState, useCallback } from "react";
import { BudgetDashboardSchema } from "@/models/schemas/dashboard-budget-table";

const API_URL = process.env.NEXT_PUBLIC_DASHBOARD_API_URL!; 

export default function useBudget() {
  const [loading, setLoading] = useState(false);
  const [budgets, setBudgets] = useState<BudgetDashboardSchema[]>([]);

  const fetchAllEventsBudgets = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/table-chart`);
      const rawBudgets = response.data.data || response.data;
  
      if (Array.isArray(rawBudgets)) {
        const validatedBudgets = rawBudgets.map((budget: unknown) =>
          BudgetDashboardSchema.parse(budget)
        );
        setBudgets(validatedBudgets);
      } else {
        console.warn("Expected an array but received:", rawBudgets);
        setBudgets([]);
      }
    } catch (err) {
      console.error("Parsing error:", err);
      toast.error("Gagal mengambil data budget.");
    } finally {
      setLoading(false);
    }
  }, []);
  
  return {
    budgets,
    loading,
    fetchAllEventsBudgets,
  };
}
