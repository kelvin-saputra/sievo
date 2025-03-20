"use client";

import { useEffect, useState } from "react";
import { ProposalTable } from "./data-table";
import { proposalColumns } from "./columns";
import useProposal from "@/hooks/use-proposals";
import PageHeader from "@/components/commons/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AddProposalModal } from "@/components/proposal/add-proposal-modal";

export default function ViewAllProposal() {
  const { proposals, loading, fetchAllProposals, handleAddProposal, handleDeleteProposal} = useProposal();
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 8;

  // Fetch proposals on mount
  useEffect(() => {
    fetchAllProposals(); // ✅ Ensure it runs when the component mounts
  }, [fetchAllProposals]);

  // Convert `updated_at` to a string & Paginate Data
  const paginatedProposals = proposals
    .map(proposal => ({
      ...proposal,
      updated_at: new Date(proposal.updated_at).toISOString(), // ✅ Convert Date to String
    }))
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Total Pages Calculation
  const totalPages = Math.ceil(proposals.length / itemsPerPage);

  return (
    <div>
      {/* Page Header */}
      <PageHeader title="Proposal" breadcrumbs={[{ label: "Proposal", href: "/proposal" }]} />

      {/* Add Proposal Button */}
      <div className="mb-6">
        <Button onClick={() => setIsModalOpen(true)} className="mb-4 bg-blue-500 text-white">
          + Add Proposal
        </Button>

        {/* Add Proposal Modal */}
        {isModalOpen && (
          <AddProposalModal
            onAddProposal={handleAddProposal}
            onClose={() => setIsModalOpen(false)}
            fetchAllProposals={fetchAllProposals}
          />
        )}
      </div>

      {/* Proposals Table */}
      <div className="mb-6 p-6 border rounded-lg shadow-lg bg-white">
        <div className="overflow-x-auto">
          {loading ? (
            <Skeleton className="h-24 w-full mb-4 rounded-lg bg-gray-300" />
          ) : proposals.length === 0 ? (
            <div className="p-6 text-center text-gray-500 text-lg">No proposals available</div>
          ) : (
            <ProposalTable columns={proposalColumns} data={paginatedProposals} onDelete={handleDeleteProposal} />
          )}
        </div>

        {/* Pagination Controls */}
        {proposals.length > 0 && (
          <div className="p-4 border-t flex justify-end items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
