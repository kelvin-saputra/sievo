"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

type CalendarEvent = {
  date: Date
  title: string
}

export function EventCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())

  // Sample event data
  const events: CalendarEvent[] = [
    { date: new Date(2025, 4, 15), title: "Annual Conference" },
    { date: new Date(2025, 5, 22), title: "Team Building Workshop" },
    { date: new Date(2025, 6, 10), title: "Product Launch" },
    { date: new Date(2025, 7, 5), title: "Client Presentation" },
  ]

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const renderCalendar = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const daysInMonth = getDaysInMonth(year, month)
    const firstDayOfMonth = getFirstDayOfMonth(year, month)

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-2 text-center text-muted-foreground"></div>)
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const isToday = new Date().toDateString() === date.toDateString()

      // Check if there's an event on this day
      const eventOnDay = events.find(
        (event) => event.date.getDate() === day && event.date.getMonth() === month && event.date.getFullYear() === year,
      )

      // Build class names using template literals instead of cn function
      const dayCellClass = `p-2 text-center relative ${isToday ? "bg-muted rounded-md" : ""} ${eventOnDay ? "font-bold" : ""}`
      const dayNumberClass = `flex h-8 w-8 items-center justify-center rounded-full ${eventOnDay ? "bg-primary text-primary-foreground" : ""}`

      days.push(
        <div key={`day-${day}`} className={dayCellClass}>
          <span className={dayNumberClass}>{day}</span>
          {eventOnDay && <div className="mt-1 text-xs truncate text-primary">{eventOnDay.title}</div>}
        </div>,
      )
    }

    return days
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const monthName = currentDate.toLocaleString("default", { month: "long" })
  const year = currentDate.getFullYear()

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size="icon" onClick={prevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold">
          {monthName} {year}
        </h2>
        <Button variant="outline" size="icon" onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-sm">
        <div className="p-2 text-center font-medium">Su</div>
        <div className="p-2 text-center font-medium">Mo</div>
        <div className="p-2 text-center font-medium">Tu</div>
        <div className="p-2 text-center font-medium">We</div>
        <div className="p-2 text-center font-medium">Th</div>
        <div className="p-2 text-center font-medium">Fr</div>
        <div className="p-2 text-center font-medium">Sa</div>
        {renderCalendar()}
      </div>
    </div>
  )
}
