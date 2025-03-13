"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Trash2, Pencil, Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProposalStatusEnum } from "@/models/enums";
import { useState } from "react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

// Define Proposal Type
export interface Proposal {
  proposal_name: string;
  status: keyof typeof ProposalStatusEnum.enum;
  client_name: string;
  proposal_link: string;
  updated_at: string;
}

// ✅ Create a separate component for the Status Dropdown
const StatusDropdown = ({ initialStatus }: { initialStatus: keyof typeof ProposalStatusEnum.enum }) => {
  const [status, setStatus] = useState(initialStatus);
  const statuses = Object.values(ProposalStatusEnum.enum) as Array<keyof typeof ProposalStatusEnum.enum>;

  const handleStatusChange = (newStatus: keyof typeof ProposalStatusEnum.enum) => {
    setStatus(newStatus);
    console.log("Updated Status:", newStatus);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-28 text-xs justify-center flex mx-auto">
          {status}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-32 p-1 text-sm text-center">
        <Command>
          <CommandInput placeholder="Search..." className="text-xs" />
          <CommandList>
            <CommandEmpty>No status found.</CommandEmpty>
            <CommandGroup>
              {statuses.map((s) => (
                <CommandItem key={s} value={s} onSelect={() => handleStatusChange(s)}>
                  <Check className={`mr-2 h-4 w-4 ${s === status ? "opacity-100" : "opacity-0"}`} />
                  {s}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

// ✅ Updated `proposalColumns` with the fixed Status column
export const proposalColumns: ColumnDef<Proposal, unknown>[] = [
  {
    accessorKey: "proposal_name",
    header: ({ column }) => (
      <Button variant="ghost" className="w-full text-center" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Proposal Name <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <span className="text-sm font-medium text-center block">{row.original.proposal_name}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusDropdown initialStatus={row.original.status} />, // ✅ Using StatusDropdown component
  },
  {
    accessorKey: "client_name",
    header: ({ column }) => (
      <Button variant="ghost" className="w-full text-center" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Client Name <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <span className="text-sm text-center block">{row.original.client_name}</span>,
  },
  {
    accessorKey: "link",
    header: "Link",
    cell: ({ row }) => (
      <div className="text-center">
        <Button variant="link" size="sm" className="text-blue-500 text-xs">
          <a href={row.original.proposal_link} target="_blank" rel="noopener noreferrer">Link</a>
        </Button>
      </div>
    ),
  },
  {
    accessorKey: "updated_at",
    header: ({ column }) => (
      <Button variant="ghost" className="w-full text-center" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Updated At <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const formattedDate = new Date(row.original.updated_at).toLocaleString();
      return <span className="text-sm text-center block">{formattedDate}</span>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex justify-center space-x-2">
        {/* Edit Button */}
        <Button variant="outline" size="icon" className="p-1 h-8 w-8" onClick={() => console.log("Edit Proposal", row.original.proposal_name)}>
          <Pencil className="h-4 w-4" />
        </Button>

        {/* Delete Button */}
        <Button variant="destructive" size="icon" className="p-1 h-8 w-8" onClick={() => console.log("Delete Proposal", row.original.proposal_name)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
