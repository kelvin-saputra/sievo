"use client"

import { useEffect } from "react"
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import useDashboard from "@/hooks/use-dashboard"

export function TaskBarChart() {
  const { taskCompletionData, loading, fetchTaskCompletion } = useDashboard()

  useEffect(() => {
    fetchTaskCompletion()
  }, [fetchTaskCompletion])

  const chartData = taskCompletionData.map((item) => ({
    event: item.event_name,
    completed: item.completed_tasks,
    total: item.total_tasks,
  }))

  const maxTasks = chartData.length > 0 ? Math.max(...chartData.map((item) => item.total)) + 5 : 35

  const chartConfig = {
    completed: {
      label: "Completed",
      color: "#e07a5f",
    },
    total: {
      label: "Total Tasks",
      color: "#a8dadc",
    },
  }

  // Custom formatter for long event names
  const formatEventName = (value: string) => {
    if (value.length > 18) {
      return value.substring(0, 15) + "..."
    }
    return value
  }

  if (loading) {
    return <div>Loading chart...</div>
  }

  if (chartData.length === 0) {
    return <div>Tidak ada data task untuk ditampilkan.</div>
  }

  return (
    <div className="w-full max-w-full overflow-hidden">
      <ChartContainer config={chartConfig} className="h-[450px] w-full">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 20, right: 20, left: 10, bottom: 50 }}
          barCategoryGap="12%"
        >
          <CartesianGrid horizontal={false} strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, maxTasks]} tickLine={false} axisLine={false} fontSize={10} />
          <YAxis
            dataKey="event"
            type="category"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            width={130}
            tickFormatter={formatEventName}
            fontSize={10}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
          <Bar dataKey="total" fill="var(--color-total)" radius={[0, 4, 4, 0]} className="opacity-70" />
          <Bar dataKey="completed" fill="var(--color-completed)" radius={[0, 4, 4, 0]} />
          <Legend
            verticalAlign="bottom"
            height={30}
            iconType="circle"
            wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
          />
        </BarChart>
      </ChartContainer>
    </div>
  )
}
