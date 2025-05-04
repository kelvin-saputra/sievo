"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Trash2, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ProposalStatusEnum } from "@/models/enums"
import StatusDropdown from "@/components/proposal/status-dropdown"
import { useState } from "react"
import { DeleteConfirmationModal } from "./form/delete-confirmation-modal"
import { UpdateProposalModal } from "./form/edit-proposal-modal"
import { updateProposalDTO } from "@/models/dto/proposal.dto"

export interface Proposal {
  proposal_id: string
  proposal_name: string
  status: keyof typeof ProposalStatusEnum.enum
  client_name: string
  proposal_link: string
  updated_at: string
  updated_by:string
}

function ActionCell({
  row,
  onDelete,
  onUpdate,
}: {
  row: any
  onDelete: (proposalId: string) => void
  onUpdate: (proposalId: string, updatedBy: string, data:updateProposalDTO) => void
}) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true)
  }

  const handleEditClick = () => {
    setIsUpdateModalOpen(true)
  }

  const handleConfirmDelete = () => {
    onDelete(row.original.proposal_id)
    setIsDeleteModalOpen(false)
  }

  return (
    <>
      <div className="flex justify-center space-x-2">
        {/* Edit Button */}
        <Button variant="outline" size="icon" className="p-1 h-8 w-8" onClick={handleEditClick}>
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

      <UpdateProposalModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onUpdate={onUpdate}
        proposal={row.original}
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
    cell: ({ row }: any) => (
      <ActionCell
        row={row}
        onDelete={(id) => console.log("Delete Proposal", id)}
        onUpdate={(id, data) => console.log("Update Proposal", id, data)}
      />
    ),
  },
] as ColumnDef<Proposal, unknown>[]

// Export a function to create columns with the delete and update handlers
export function createProposalColumnsWithActions(
  onDelete: (proposalId: string) => void,
  onUpdate: (proposalId: string, updatedBy: string, data:updateProposalDTO) => void,
) {
  // Create a copy of the columns array
  const columnsWithActions = [...proposalColumns]

  // Replace the actions column with one that has the onDelete and onUpdate handlers
  columnsWithActions[columnsWithActions.length - 1] = {
    id: "actions",
    header: "Actions",
    cell: ({ row }: any) => <ActionCell row={row} onDelete={onDelete} onUpdate={onUpdate} />,
  }

  return columnsWithActions
}
