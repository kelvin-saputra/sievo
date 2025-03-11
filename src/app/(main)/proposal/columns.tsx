"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Trash2, Pencil } from "lucide-react"; // ✅ Added Pencil icon
import { Button } from "@/components/ui/button";
import { ProposalStatusEnum } from "@/models/enums";

// Define Proposal Type
export interface Proposal {
  proposal_name: string;
  status: keyof typeof ProposalStatusEnum.enum;
  client_name: string;
  link: string;
}

// Ensure columns match expected type
export const proposalColumns: ColumnDef<Proposal, unknown>[] = [
  {
    accessorKey: "proposal_name",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Proposal Name <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Status <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <span className="capitalize">{row.original.status}</span>,
  },
  {
    accessorKey: "client_name",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Client Name <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "link",
    header: "Link",
    cell: ({ row }) => (
      <Button variant="link" size="sm">
        <a href={row.original.link} target="_blank" rel="noopener noreferrer">Link</a>
      </Button>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex space-x-2">
        {/* Edit Button */}
        <Button variant="outline" size="icon" onClick={() => console.log("Edit Proposal", row.original.proposal_name)}>
          <Pencil className="h-4 w-4" />
        </Button>

        {/* Delete Button */}
        <Button variant="destructive" size="icon" onClick={() => console.log("Delete Proposal", row.original.proposal_name)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
