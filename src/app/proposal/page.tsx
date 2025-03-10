"use client";

import { useEffect, useState } from "react";
import { ProposalTable } from "./data-table";
import { proposalColumns } from "./columns"; // Keep columns clean
import useProposal from "@/hooks/use-proposals";
import PageHeader from "@/components/commons/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Filter, Plus } from "lucide-react";

export default function ViewAllProposal() {
  const { proposals, loading, fetchAllProposals } = useProposal();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchAllProposals();
  }, [fetchAllProposals]);

  // Paginate Data
  const totalPages = Math.ceil(proposals.length / itemsPerPage);
  const paginatedProposals = proposals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle Proposal Deletion
  const handleDelete = (proposal_name: string) => {
    console.log(`Deleting proposal: ${proposal_name}`);
  };

  return (
    <div>
      {/* Header */}
      <PageHeader title="Proposal Overview" breadcrumbs={[{ label: "Proposal", href: "/proposal" }]} />

      <div className="mb-6 p-6 border rounded-lg shadow-lg bg-white">
        {/* Action Buttons */}
        <div className="p-4 border-b flex justify-between">
          <Button variant="default" size="sm" className="bg-primary text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Proposal
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Table or Skeleton Loading */}
        <div className="overflow-x-auto">
          {loading ? (
            <Skeleton className="h-24 w-full mb-4 rounded-lg bg-gray-300" />
          ) : proposals.length === 0 ? (
            <div className="p-6 text-center text-gray-500 text-lg">No proposals available</div>
          ) : (
            <ProposalTable columns={proposalColumns} data={paginatedProposals} onDelete={handleDelete} />
          )}
        </div>

        {/* Pagination */}
        {proposals.length > 0 && (
          <div className="p-4 border-t flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="mx-4 text-sm">
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
