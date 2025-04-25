"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle, XCircle, Filter } from "lucide-react"

type Status = "All" | "Approved" | "Error" | "Disabled"

type Event = {
  id: string
  name: string
  status: "Approved" | "Error" | "Disabled"
  date: string
  progress: number
}

export function EventTable() {
  const [statusFilter, setStatusFilter] = useState<Status>("All")

  const events: Event[] = [
    {
      id: "1",
      name: "Annual Conference",
      status: "Approved",
      date: "2025-05-15",
      progress: 75,
    },
    {
      id: "2",
      name: "Team Building Workshop",
      status: "Disabled",
      date: "2025-06-22",
      progress: 30,
    },
    {
      id: "3",
      name: "Product Launch",
      status: "Error",
      date: "2025-07-10",
      progress: 85,
    },
    {
      id: "4",
      name: "Client Presentation",
      status: "Error",
      date: "2025-08-05",
      progress: 45,
    },
  ]

  const filteredEvents = statusFilter === "All" ? events : events.filter((event) => event.status === statusFilter)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "Error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "Disabled":
        return <XCircle className="h-5 w-5 text-gray-500" />
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="w-full">
      <div className="flex justify-end mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter Status
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={statusFilter} onValueChange={(value) => setStatusFilter(value as Status)}>
              <DropdownMenuRadioItem value="All">All</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Approved">Approved</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Error">Error</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Disabled">Disabled</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">NAME</TableHead>
              <TableHead className="w-[150px]">STATUS</TableHead>
              <TableHead className="w-[150px]">DATE</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEvents.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="font-medium">{event.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(event.status)}
                    <span>{event.status}</span>
                  </div>
                </TableCell>
                <TableCell>{formatDate(event.date)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
