"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EventTable } from "./table-event-chart"
import { BudgetRadialChart } from "./budget-radial-chart"
import { TaskBarChart } from "./task-bar-chart"
import { EventCalendar } from "./event-calender"

export default function Dashboard() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex flex-col">
        <header className="sticky top-0 z-10 border-b bg-background px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            </div>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Event Actual Budget Status</CardTitle>
              </CardHeader>
              <CardContent>
                <EventTable />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Budget Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <BudgetRadialChart />
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Task Completion</CardTitle>
              </CardHeader>
              <CardContent style={{ paddingLeft: 0, textAlign: 'left' }}>
  <TaskBarChart />
</CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Event Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <EventCalendar />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
