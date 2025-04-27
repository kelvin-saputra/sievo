"use client"

import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function TaskBarChart() {
  // Sample data for tasks per event with actual counts
  const taskData = [
    {
      event: "Event 1",
      completed: 12,
      total: 15,
    },
    {
      event: "Event 2",
      completed: 18,
      total: 25,
    },
    {
      event: "Event 3",
      completed: 8,
      total: 12,
    },
    {
      event: "Event 4",
      completed: 22,
      total: 30,
    },
    {
      event: "Event 5",
      completed: 5,
      total: 15,
    },
    {
      event: "Event 6",
      completed: 15,
      total: 20,
    },
  ]

  const maxTasks = Math.max(...taskData.map((item) => item.total)) + 5

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

  return (
    <div className="w-full">
      <ChartContainer config={chartConfig} className="h-[300px]">
        <BarChart data={taskData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
  )
}
