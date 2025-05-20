"use client";

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, Clock, Filter } from "lucide-react";
import useDashboard from "@/hooks/use-dashboard";
import { BudgetStatusEnum } from "@/models/enums";
import { z } from "zod";
import { useRouter } from "next/navigation";



type Status = "All" | z.infer<typeof BudgetStatusEnum>;


export function EventTable() {
  const [statusFilter, setStatusFilter] = useState<Status>("All");
  const { budgets, loading, fetchAllEventsBudgets } = useDashboard();
  const router = useRouter();

  useEffect(() => {
    fetchAllEventsBudgets();
  }, [fetchAllEventsBudgets]);

  const filteredBudgets = statusFilter === "All" ? budgets : budgets.filter((budget) => budget.status === statusFilter);

  const getStatusIcon = (status: z.infer<typeof BudgetStatusEnum>) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "REJECTED":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "PENDING":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const formatStatus = (status: z.infer<typeof BudgetStatusEnum>) => {
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  const formatDate = (dateInput: Date | string | undefined) => {
    if (!dateInput) return "-";
    const date = new Date(dateInput);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return <div>Loading...</div>;
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
              <DropdownMenuRadioItem value="APPROVED">Approved</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="PENDING">Pending</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="REJECTED">Rejected</DropdownMenuRadioItem>
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
            {filteredBudgets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-10 text-gray-500">
                  No Available Budget Planning
                </TableCell>
              </TableRow>
            ) : (
              filteredBudgets.map((budget) => (
                <TableRow
                  key={budget.budget_id}
                  className="cursor-pointer hover:bg-gray-100 transition"
                  onClick={() => router.push(`/events/${budget.event_id}/budget`)}
                >
                  <TableCell className="font-medium">{budget.event.event_name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(budget.status)}
                      <span>{formatStatus(budget.status)}</span>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(budget.updated_at)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
