"use client"

import { useEffect, useState } from "react"
import { createProposalColumnsWithActions } from "../../../components/proposal/columns"
import { ProposalTable } from "../../../components/proposal/data-table"
import useProposal from "@/hooks/use-proposals"
import PageHeader from "@/components/common/page-header"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { AddProposalModal } from "@/components/proposal/form/add-proposal-modal"

export default function ViewAllProposal() {
  const { proposals, loading, fetchAllProposals, handleAddProposal, handleUpdateProposal, handleDeleteProposal } =
    useProposal()
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const itemsPerPage = 8

  useEffect(() => {
    fetchAllProposals()
  }, [fetchAllProposals])

  const paginatedProposals = proposals
    .map((proposal) => ({
      ...proposal,
      updated_at: new Date(proposal.updated_at).toISOString(),
      updated_by: proposal.updated_by ?? "system",
    }))
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const totalPages = Math.ceil(proposals.length / itemsPerPage)
  const columnsWithActions = createProposalColumnsWithActions(handleDeleteProposal, handleUpdateProposal)

  return (
    <div className="p-6 w-full max-w-7xl mx-auto">
      <PageHeader title="Proposal" breadcrumbs={[{ label: "Proposal", href: "/proposal" }]} />
      <div className="mb-6">
        <Button variant="default" onClick={() => setIsModalOpen(true)}>
          + Add Proposal
        </Button>
        {isModalOpen && (
          <AddProposalModal
            onAddProposal={handleAddProposal}
            onClose={() => setIsModalOpen(false)}
            fetchAllProposals={fetchAllProposals}
          />
        )}
      </div>
      <div className="mb-6 p-6 border rounded-lg shadow-lg bg-white">
        <div className="overflow-x-auto">
          {loading ? (
            <Skeleton className="h-24 w-full mb-4 rounded-lg bg-gray-300" />
          ) : proposals.length === 0 ? (
            <div className="p-6 text-center text-gray-500 text-lg">No proposals available</div>
          ) : (
            <ProposalTable columns={columnsWithActions} data={paginatedProposals} />
          )}
        </div>
        {proposals.length > 0 && (
          <div className="p-4 border-t flex justify-end items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
