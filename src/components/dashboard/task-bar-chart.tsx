"use client";

import { useEffect } from "react";
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import useDashboard from "@/hooks/use-dashboard";


export function TaskBarChart() {
  const { taskCompletionData, loading, fetchTaskCompletion } = useDashboard();

  useEffect(() => {
    fetchTaskCompletion();
  }, [fetchTaskCompletion]);

  const chartData = taskCompletionData.map((item) => ({
    event: item.event_name,
    completed: item.completed_tasks,
    total: item.total_tasks,
  }));

  const maxTasks = chartData.length > 0 ? Math.max(...chartData.map((item) => item.total)) + 5 : 35;

  const chartConfig = {
    completed: {
      label: "Completed",
      color: "#e07a5f",
    },
    total: {
      label: "Total Tasks",
      color: "#a8dadc",
    },
  };

  if (loading) {
    return <div>Loading chart...</div>;
  }

  if (chartData.length === 0) {
    return <div>Tidak ada data task untuk ditampilkan.</div>;
  }

  return (
    <div className="w-full">
      <ChartContainer config={chartConfig} className="h-[300px]">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="event" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} domain={[0, maxTasks]} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
          <Bar dataKey="total" fill="var(--color-total)" radius={[4, 4, 0, 0]} className="opacity-70" />
          <Bar dataKey="completed" fill="var(--color-completed)" radius={[4, 4, 0, 0]} />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
