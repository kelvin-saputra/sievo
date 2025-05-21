"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import useDashboard from "@/hooks/use-dashboard"

// Update or add these type definitions at the top of the file
type TaskAssigned = {
  id: string
  name: string
}

type Task = {
  task_id: string
  title: string
  due_date: string
  status: string
  assigned: TaskAssigned
}


type CalendarData = {
  event_id: string
  event_name: string
  start_date: string
  end_date: string
  task?: Task[]
}

export function EventCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const { eventsDates, loading, fetchCalendarEvents } = useDashboard()

  useEffect(() => {
    fetchCalendarEvents()
  }, [fetchCalendarEvents])

  // Map events and tasks for calendar display
  const mappedEvents = eventsDates.flatMap((event: CalendarData) => {
    // Create event entry
    const eventEntry = {
      id: event.event_id,
      start: new Date(event.start_date),
      end: new Date(event.end_date),
      title: event.event_name,
      isTask: false,
      taskInfo: null,
    }

    // Create task entries with same color as parent event
    const taskEntries =
      event.task?.map((task) => ({
        id: task.task_id,
        start: new Date(task.due_date),
        end: new Date(task.due_date),
        title: event.event_name, // Same title as event for color consistency
        isTask: true,
        taskInfo: {
          title: task.title,
          dueDate: task.due_date,
          status: task.status,
          assignedName: task.assigned.name,
        },
      })) || []

    return [eventEntry, ...taskEntries]
  })

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Define brighter event colors
  const eventColors = [
    "bg-purple-400 text-white",
    "bg-red-400 text-white",
    "bg-blue-400 text-white",
    "bg-green-400 text-white",
    "bg-yellow-400 text-black",
    "bg-indigo-400 text-white",
  ]

  // Get consistent color for an event
  const getEventColor = (title: string) => {
    const hash = title.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return eventColors[hash % eventColors.length]
  }

  // Check if two dates are the same day
  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    )
  }

  // Determine event position (start, middle, end, or single)
  const getEventPosition = (date: Date, event: { start: Date; end: Date }) => {
    const isStart = isSameDay(date, event.start)
    const isEnd = isSameDay(date, event.end)

    if (isStart && isEnd) return "single"
    if (isStart) return "start"
    if (isEnd) return "end"
    if (date > event.start && date < event.end) return "middle"
    return null
  }

  const renderCalendar = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const daysInMonth = getDaysInMonth(year, month)
    const firstDayOfMonth = getFirstDayOfMonth(year, month)

    // Create a grid of all days in the month
    const dayGrid = []
    for (let i = 0; i < firstDayOfMonth; i++) {
      dayGrid.push({ day: null, events: [] })
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const eventsOnDay = mappedEvents.filter((event) => {
        const position = getEventPosition(date, event)
        return position !== null
      })

      dayGrid.push({ day, date, events: eventsOnDay })
    }

    // Render each day cell
    return dayGrid.map((dayInfo, index) => {
      if (dayInfo.day === null) {
        return <div key={`empty-${index}`} className="p-4 text-center"></div>
      }

      const isToday = new Date().toDateString() === dayInfo.date.toDateString()

      // Process events for this day
      const processedEvents = dayInfo.events.map((event) => {
        const position = getEventPosition(dayInfo.date, event)
        return { ...event, position }
      })

      return (
        <div key={`day-${dayInfo.day}`} className="relative p-0 h-12">
          {processedEvents.map((event, eventIndex) => {
            const color = getEventColor(event.title)
            if (event.position === "single") {
              return (
                <TooltipProvider key={`event-${eventIndex}`}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className={`absolute inset-0 flex items-center justify-center ${color} rounded-full z-10`}>
                        {dayInfo.day}
                        {event.isTask && <span className="absolute top-0 right-0 h-2 w-2 bg-white rounded-full"></span>}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="p-3 space-y-1">
                      {event.isTask && event.taskInfo ? (
                        <>
                          <div className="font-medium">{event.taskInfo.title}</div>
                          <div className="text-xs space-y-1">
                            <div>Due date: {new Date(event.taskInfo.dueDate).toLocaleDateString()}</div>
                            <div>Status: {event.taskInfo.status}</div>
                            <div>Assigned to: {event.taskInfo.assignedName}</div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="font-medium">{event.title}</div>
                          <div className="text-xs">
                            <div>Start: {formatDate(event.start)}</div>
                            <div>End: {formatDate(event.end)}</div>
                          </div>
                        </>
                      )}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )
            }
            let className = `absolute inset-0 flex items-center justify-center ${color} z-10 `

            if (event.position === "start") {
              className += "rounded-l-full"
            } else if (event.position === "end") {
              className += "rounded-r-full"
            }

            return (
              <TooltipProvider key={`event-${eventIndex}`}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={className}>
                      {dayInfo.day}
                      {event.isTask && <span className="absolute top-0 right-0 h-2 w-2 bg-white rounded-full"></span>}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="p-3 space-y-1">
                    {event.isTask && event.taskInfo ? (
                      <>
                        <div className="font-medium">{event.taskInfo.title}</div>
                        <div className="text-xs space-y-1">
                          <div>Due date: {new Date(event.taskInfo.dueDate).toLocaleDateString()}</div>
                          <div>Status: {event.taskInfo.status}</div>
                          <div>Assigned to: {event.taskInfo.assignedName}</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="font-medium">{event.title}</div>
                        <div className="text-xs">
                          <div>Start: {formatDate(event.start)}</div>
                          <div>End: {formatDate(event.end)}</div>
                        </div>
                      </>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )
          })}

          {/* If no events, render just the day number */}
          {processedEvents.length === 0 && (
            <div className={`absolute inset-0 flex items-center justify-center ${isToday ? "font-bold" : ""}`}>
              {dayInfo.day}
            </div>
          )}
        </div>
      )
    })
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const monthName = currentDate.toLocaleString("default", { month: "long" })
  const year = currentDate.getFullYear()

  if (loading) {
    return <div>Loading calendar...</div>
  }

  // Get unique event names for the legend
  const uniqueEventNames = [...new Set(eventsDates.map((event: CalendarData) => event.event_name))]

  return (
    <div className="w-full rounded-lg border p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={prevMonth} className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-base font-medium">
            {monthName} {year}
          </span>
          <Button variant="outline" size="icon" onClick={nextMonth} className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-sm">
        <div className="p-2 text-center font-medium text-muted-foreground">S</div>
        <div className="p-2 text-center font-medium text-muted-foreground">M</div>
        <div className="p-2 text-center font-medium text-muted-foreground">T</div>
        <div className="p-2 text-center font-medium text-muted-foreground">W</div>
        <div className="p-2 text-center font-medium text-muted-foreground">T</div>
        <div className="p-2 text-center font-medium text-muted-foreground">F</div>
        <div className="p-2 text-center font-medium text-muted-foreground">S</div>
        {renderCalendar()}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {uniqueEventNames.map((eventName, index) => (
          <div key={index} className="flex items-center gap-1 text-xs">
            <div className={`h-3 w-3 rounded-full ${getEventColor(eventName).split(" ")[0]}`}></div>
            <span>{eventName}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
