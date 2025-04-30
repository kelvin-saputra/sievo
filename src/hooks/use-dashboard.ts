import { toast } from "sonner";
import axios from "axios";
import { useState, useCallback } from "react";
import { BudgetDashboardSchema } from "@/models/schemas/dashboard-budget-table";

const API_URL = process.env.NEXT_PUBLIC_DASHBOARD_API_URL!; 

export type TaskCompletion = {
  event_name: string;
  total_tasks: number;
  completed_tasks: number;
};

export type CalendarData = {
  event_id: string;
  event_name: string;
  start_date: string; 
  end_date: string;
};

export type EventBudgetSummary = {
  event_id: string;
  event_name: string;
  planned_budget: number;
  actual_budget: number;
};

export type BudgetSummary = {
  planned_budget: number;
  actual_budget: number;
  events: EventBudgetSummary[];
};


export default function useDashboard() {
  const [loading, setLoading] = useState(false);
  const [budgets, setBudgets] = useState<BudgetDashboardSchema[]>([]);
  const [taskCompletionData, setTaskCompletionData] = useState<TaskCompletion[]>([]);
  const [eventsDates, setEventsDates] = useState<CalendarData[]>([]);
  const [budgetSummary, setBudgetSummary] = useState<BudgetSummary | null>(null);

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

  const fetchTaskCompletion = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/bar-chart`);
      const rawData = response.data;

      if (Array.isArray(rawData)) {
        setTaskCompletionData(rawData);
      } else {
        console.warn("Expected an array, got:", rawData);
        setTaskCompletionData([]);
      }
    } catch (error) {
      console.error("Failed to fetch task completion data:", error);
      toast.error("Gagal mengambil data task completion.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCalendarEvents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/calendar-chart`);
      const rawEvents = response.data;

      if (Array.isArray(rawEvents)) {
        setEventsDates(rawEvents);
      } else {
        console.warn("Expected an array but received:", rawEvents);
        setEventsDates([]);
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
      toast.error("Gagal mengambil data event.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBudgetSummary = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/radial-chart`);
      const rawData = response.data;

      if (rawData && typeof rawData === "object") {
        setBudgetSummary(rawData);
      } else {
        console.warn("Expected an object but received:", rawData);
        setBudgetSummary(null);
      }
    } catch (error) {
      console.error("Failed to fetch budget summary:", error);
      toast.error("Gagal mengambil data ringkasan budget.");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    budgets,
    loading,
    taskCompletionData,
    eventsDates,
    budgetSummary,
    fetchAllEventsBudgets,
    fetchTaskCompletion,
    fetchCalendarEvents,
    fetchBudgetSummary,
  };
}
