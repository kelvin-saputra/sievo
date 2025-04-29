"use client";

import { useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import useDashboard from "@/hooks/use-dashboard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function BudgetRadialChart() {
  const { budgetSummary, loading, fetchBudgetSummary } = useDashboard()
  const [selectedEventId, setSelectedEventId] = useState<"total" | string>("total");

  useEffect(() => {
    fetchBudgetSummary();
  }, [fetchBudgetSummary]);

  if (loading || !budgetSummary) {
    return <div>Loading chart...</div>;
  }

  const selectedEvent = selectedEventId === "total"
    ? {
        planned_budget: budgetSummary.planned_budget,
        actual_budget: budgetSummary.actual_budget,
      }
    : budgetSummary.events.find((event) => event.event_id === selectedEventId);

  const totalActual = selectedEvent?.actual_budget || 0;
  const totalProjected = selectedEvent?.planned_budget || 1; // avoid division by zero
  const percentUsed = Math.round((totalActual / totalProjected) * 100);

  const chartData = [
    {
      name: "Budget",
      actual: totalActual,
      projected: totalProjected,
    },
  ];

  const actualColor = "#e07a5f";
  const projectedColor = "#a8dadc";

  const chartConfig = {
    actual: {
      label: "Actual Budget",
      color: actualColor,
    },
    projected: {
      label: "Projected Budget",
      color: projectedColor,
    },
  };

  return (
    <div className="flex flex-col">
      {/* Select event */}
      <div className="mb-4 flex justify-center">
        <Select value={selectedEventId} onValueChange={setSelectedEventId}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Pilih Event" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="total">Total Semua Event</SelectItem>
            {budgetSummary.events.map((event) => (
              <SelectItem key={event.event_id} value={event.event_id}>
                {event.event_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Chart */}
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
                  );
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

      {/* Legend */}
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

      {/* Utilization Text */}
      <div className="mt-4 flex items-center justify-center gap-2 text-sm">
        <TrendingUp className="h-4 w-4" />
        <div className="font-medium leading-none">Budget utilization: {percentUsed}%</div>
      </div>
    </div>
  );
}
