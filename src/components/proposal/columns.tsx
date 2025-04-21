"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Trash2, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ProposalStatusEnum } from "@/models/enums"
import StatusDropdown from "@/components/proposal/status-dropdown"
import { useState } from "react"
import { DeleteConfirmationModal } from "./delete-confirmation-modal"

export interface Proposal {
  proposal_id: string
  proposal_name: string
  status: keyof typeof ProposalStatusEnum.enum
  client_name: string
  proposal_link: string
  updated_at: string
}

function ActionCell({ row, onDelete }: { row: any; onDelete: (proposalName: string) => void }) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    onDelete(row.original.proposal_id)
    setIsDeleteModalOpen(false)
  }

  return (
    <>
      <div className="flex justify-center space-x-2">
        {/* Edit Button */}
        <Button
          variant="outline"
          size="icon"
          className="p-1 h-8 w-8"
          onClick={() => console.log("Edit Proposal", row.original.proposal_name)}
        >
          <Pencil className="h-4 w-4" />
        </Button>

        {/* Delete Button */}
        <Button variant="destructive" size="icon" className="p-1 h-8 w-8" onClick={handleDeleteClick}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        proposalName={row.original.proposal_name}
      />
    </>
  )
}

export const proposalColumns = [
  {
    accessorKey: "proposal_name",
    header: ({ column }: any) => (
      <Button
        variant="ghost"
        className="w-full text-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Proposal Name <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }: any) => <span className="text-sm font-medium text-center block">{row.original.proposal_name}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: any) => (
      <StatusDropdown proposalId={row.original.proposal_id} initialStatus={row.original.status} />
    ),
  },
  {
    accessorKey: "client_name",
    header: ({ column }: any) => (
      <Button
        variant="ghost"
        className="w-full text-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Client Name <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }: any) => <span className="text-sm text-center block">{row.original.client_name}</span>,
  },
  {
    accessorKey: "link",
    header: "Link",
    cell: ({ row }: any) => (
      <div className="text-center">
        <Button variant="link" size="sm" className="text-blue-500 text-xs">
          <a href={row.original.proposal_link} target="_blank" rel="noopener noreferrer">
            Link
          </a>
        </Button>
      </div>
    ),
  },
  {
    accessorKey: "updated_at",
    header: ({ column }: any) => (
      <Button
        variant="ghost"
        className="w-full text-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Updated At <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }: any) => {
      const formattedDate = new Date(row.original.updated_at).toLocaleString()
      return <span className="text-sm text-center block">{formattedDate}</span>
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }: any) => <ActionCell row={row} onDelete={(id) => console.log("Delete Proposal", id)} />,
  },
] as ColumnDef<Proposal, unknown>[]

// Export a function to create columns with the delete handler
export function createProposalColumnsWithActions(onDelete: (proposalId: string) => void) {
  // Create a copy of the columns array
  const columnsWithActions = [...proposalColumns]

  // Replace the actions column with one that has the onDelete handler
  columnsWithActions[columnsWithActions.length - 1] = {
    id: "actions",
    header: "Actions",
    cell: ({ row }: any) => <ActionCell row={row} onDelete={onDelete} />,
  }

  return columnsWithActions
}
