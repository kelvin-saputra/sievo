"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Trash2, Pencil} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProposalStatusEnum } from "@/models/enums";
import StatusDropdown from "@/components/proposal/status-dropdown";

export interface Proposal {
  proposal_id : string;
  proposal_name: string;
  status: keyof typeof ProposalStatusEnum.enum;
  client_name: string;
  proposal_link: string;
  updated_at: string;
}

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
    cell: ({ row }) => (
      <StatusDropdown proposalId={row.original.proposal_id} initialStatus={row.original.status} />
    ), 
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
