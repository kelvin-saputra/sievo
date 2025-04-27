"use client"

import { TrendingUp } from "lucide-react"
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function BudgetRadialChart() {
  // Sample data for budget comparison
  const budgetCategories = [
    { category: "Venue", actual: 15000, projected: 20000, fill: "hsl(var(--chart-1))" },
    { category: "Catering", actual: 8000, projected: 10000, fill: "hsl(var(--chart-2))" },
    { category: "Marketing", actual: 5000, projected: 8000, fill: "hsl(var(--chart-3))" },
    { category: "Equipment", actual: 7000, projected: 7000, fill: "hsl(var(--chart-4))" },
    { category: "Other", actual: 3000, projected: 5000, fill: "hsl(var(--chart-5))" },
  ]

  const totalActual = budgetCategories.reduce((sum, item) => sum + item.actual, 0)
  const totalProjected = budgetCategories.reduce((sum, item) => sum + item.projected, 0)
  const percentUsed = Math.round((totalActual / totalProjected) * 100)

  // Format for radial chart
  const chartData = [
    {
      name: "Budget",
      actual: totalActual,
      projected: totalProjected,
    },
  ]

  const actualColor = "#e07a5f"
  const projectedColor = "#a8dadc" 

  const chartConfig = {
    actual: {
      label: "Actual Budget",
      color: actualColor,
    },
    projected: {
      label: "Projected Budget",
      color: projectedColor,
    },
  }

  return (
    <div className="flex flex-col">
      <ChartContainer config={chartConfig} className="mx-auto aspect-square w-full max-w-[250px]">
        <RadialBarChart
          data={chartData}
          startAngle={90}
          endAngle={-270}
          innerRadius={60}
          outerRadius={120}
          barSize={20}
          cx="50%"
          cy="50%"
        >
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                      <tspan x={viewBox.cx} y={(viewBox.cy || 0) - 10} className="fill-foreground text-2xl font-bold">
                        {percentUsed}%
                      </tspan>
                      <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 10} className="fill-muted-foreground text-xs">
                        of budget used
                      </tspan>
                    </text>
                  )
                }
              }}
            />
          </PolarRadiusAxis>
          <RadialBar
            dataKey="projected"
            fill={projectedColor}
            background
            className="opacity-70 stroke-transparent stroke-2"
          />
          <RadialBar dataKey="actual" fill={actualColor} className="stroke-transparent stroke-2" />
        </RadialBarChart>
      </ChartContainer>

      <div className="mt-4 flex justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: projectedColor }} />
          <span className="text-sm">Projected Budget</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: actualColor }} />
          <span className="text-sm">Actual Budget</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 text-sm">
        <TrendingUp className="h-4 w-4" />
        <div className="font-medium leading-none">Budget utilization: {percentUsed}%</div>
      </div>
    </div>
  )
}
