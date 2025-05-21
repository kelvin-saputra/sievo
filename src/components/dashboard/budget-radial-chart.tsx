"use client"

import { useState, useEffect } from "react"
import { TrendingUp, Filter } from "lucide-react"
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import useDashboard from "@/hooks/use-dashboard"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

enum EventStatus {
  PLANNING = "PLANNING",
  BUDGETING = "BUDGETING",
  PREPARATION = "PREPARATION",
  IMPLEMENTATION = "IMPLEMENTATION",
  REPORTING = "REPORTING",
  DONE = "DONE",
}

type StatusFilter = "ALL" | "DONE" | "IN_PROGRESS"

export function BudgetRadialChart() {
  const { budgetSummary, loading, fetchBudgetSummary } = useDashboard()
  const [selectedEventId, setSelectedEventId] = useState<"total" | string>("total")
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("ALL")

  useEffect(() => {
    fetchBudgetSummary()
  }, [fetchBudgetSummary])

  if (loading || !budgetSummary) {
    return <div>Loading chart...</div>
  }

  // Filter events by status
  const filteredEvents = budgetSummary.events.filter((event) => {
    if (selectedStatus === "ALL") return true
    if (selectedStatus === "DONE") return event.event_status === EventStatus.DONE
    if (selectedStatus === "IN_PROGRESS") {
      return event.event_status !== EventStatus.DONE
    }
    return true
  })

  // Calculate totals for filtered events
  const filteredTotalPlanned = filteredEvents.reduce((sum, event) => sum + event.planned_budget, 0)
  const filteredTotalActual = filteredEvents.reduce((sum, event) => sum + event.actual_budget, 0)

  // Get data for selected event or filtered totals
  const selectedEvent =
    selectedEventId === "total"
      ? {
          planned_budget: filteredTotalPlanned,
          actual_budget: filteredTotalActual,
        }
      : filteredEvents.find((event) => event.event_id === selectedEventId)

  // If the selected event is not in the filtered list, use the first filtered event or default to 0
  const totalActual = selectedEvent?.actual_budget || 0
  const totalProjected = selectedEvent?.planned_budget || 1 // avoid division by zero
  const percentUsed = Math.round((totalActual / totalProjected) * 100)

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

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Get status label with color
  const getStatusLabel = (status: string) => {
    switch (status) {
      case EventStatus.DONE:
        return <span className="text-green-500 font-medium">Done</span>
      case EventStatus.REPORTING:
        return <span className="text-blue-500 font-medium">Reporting</span>
      case EventStatus.IMPLEMENTATION:
        return <span className="text-purple-500 font-medium">Implementation</span>
      case EventStatus.PREPARATION:
        return <span className="text-orange-500 font-medium">Preparation</span>
      case EventStatus.BUDGETING:
        return <span className="text-pink-500 font-medium">Budgeting</span>
      case EventStatus.PLANNING:
        return <span className="text-yellow-500 font-medium">Planning</span>
      default:
        return <span>{status}</span>
    }
  }

  // Get status filter display name
  const getStatusFilterName = (filter: StatusFilter) => {
    switch (filter) {
      case "ALL":
        return "All Events"
      case "DONE":
        return "Done"
      case "IN_PROGRESS":
        return "In Progress"
      default:
        return filter
    }
  }

  return (
    <div className="flex flex-col">
      {/* Filter controls */}
      <div className="mb-4 flex flex-wrap justify-between gap-2">
        {/* Event selector */}
        <Select value={selectedEventId} onValueChange={setSelectedEventId}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Event" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="total">All Events</SelectItem>
            {filteredEvents.map((event) => (
              <SelectItem key={event.event_id} value={event.event_id}>
                {event.event_name.length > 20 ? `${event.event_name.substring(0, 18)}...` : event.event_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-10">
              <Filter className="mr-2 h-4 w-4" />
              {getStatusFilterName(selectedStatus)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={selectedStatus}
              onValueChange={(value) => setSelectedStatus(value as StatusFilter)}
            >
              <DropdownMenuRadioItem value="ALL">All Events</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="DONE">Done</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="IN_PROGRESS">In Progress</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Selected event info */}
      {selectedEventId !== "total" && selectedEvent && (
        <div className="mb-4 text-center">
          <h3 className="text-sm font-medium truncate">
            {filteredEvents.find((e) => e.event_id === selectedEventId)?.event_name}
          </h3>
          <p className="text-xs text-muted-foreground">
            Status: {getStatusLabel(filteredEvents.find((e) => e.event_id === selectedEventId)?.event_status || "")}
          </p>
        </div>
      )}

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

      {/* Budget amounts */}
      <div className="mt-2 text-center text-sm">
        <div className="text-muted-foreground">
          <span className="font-medium text-foreground">{formatCurrency(totalActual)}</span> of{" "}
          {formatCurrency(totalProjected)}
        </div>
      </div>

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
  )
}
