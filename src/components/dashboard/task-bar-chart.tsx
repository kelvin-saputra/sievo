"use client"

import { useEffect } from "react"
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import useDashboard from "@/hooks/use-dashboard"

export function TaskBarChart() {
  const { taskCompletionData, loading, fetchTaskCompletion } = useDashboard()

  useEffect(() => {
    fetchTaskCompletion()
  }, [fetchTaskCompletion])

  // Process data and truncate long event names
  const chartData = taskCompletionData.map((item) => {
    // Truncate long event names
    let displayName = item.event_name
    if (displayName.length > 20) {
      displayName = displayName.substring(0, 18) + "..."
    }

    return {
      event: displayName,
      fullName: item.event_name, // Keep full name for tooltip
      completed: item.completed_tasks,
      total: item.total_tasks,
    }
  })

  const maxTasks = chartData.length > 0 ? Math.max(...chartData.map((item) => item.total)) + 5 : 35

  // Custom colors
  const totalColor = "#a8dadc" // Light blue/teal color
  const completedColor = "#e07a5f" // Coral/orange color

  const chartConfig = {
    completed: {
      label: "Completed",
      color: completedColor,
    },
    total: {
      label: "Total Tasks",
      color: totalColor,
    },
  }

  // Custom tooltip to show full event name
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow-sm">
          <p className="font-medium">{payload[0]?.payload.fullName}</p>
          <p className="text-sm">
            <span className="inline-block w-3 h-3 mr-1 rounded-full" style={{ backgroundColor: totalColor }}></span>
            Total: {payload[0]?.payload.total}
          </p>
          <p className="text-sm">
            <span className="inline-block w-3 h-3 mr-1 rounded-full" style={{ backgroundColor: completedColor }}></span>
            Completed: {payload[0]?.payload.completed}
          </p>
        </div>
      )
    }
    return null
  }

  if (loading) {
    return <div>Loading chart...</div>
  }

  if (chartData.length === 0) {
    return <div>Tidak ada data task untuk ditampilkan.</div>
  }

  return (
    <div className="w-full">
      <ChartContainer config={chartConfig} className="h-[300px]">
        <BarChart data={chartData} layout="vertical" margin={{ top: 20, right: 30, left: 80, bottom: 20 }}>
          <CartesianGrid horizontal={false} strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, maxTasks]} tickLine={false} axisLine={false} />
          <YAxis
            dataKey="event"
            type="category"
            tickLine={false}
            axisLine={false}
            width={80}
            tickFormatter={(value) => {
              return value.length > 12 ? value.substring(0, 10) + "..." : value
            }}
          />
          <ChartTooltip cursor={false} content={<CustomTooltip />} />
          <Bar dataKey="total" fill={totalColor} radius={[0, 4, 4, 0]} className="opacity-70" barSize={20} />
          <Bar dataKey="completed" fill={completedColor} radius={[0, 4, 4, 0]} barSize={20} />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </BarChart>
      </ChartContainer>
    </div>
  )
}
