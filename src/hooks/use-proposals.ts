import { toast } from "sonner";
import axios from "axios";
import { ProposalSchema } from "@/models/schemas";
import { useState, useCallback } from "react";
import { addProposalDTO } from "@/models/dto/proposal.dto";
import { ProposalStatusEnum } from "@/models/enums";

const API_URL = process.env.NEXT_PUBLIC_PROPOSAL_API_URL!;

export default function useProposal() {
  const [loading, setLoading] = useState(false);
  const [proposals, setProposals] = useState<ProposalSchema[]>([]);

  const fetchAllProposals = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      const rawProposals = response.data.data || response.data;

      if (Array.isArray(rawProposals)) {
        const validatedProposals = rawProposals.map((proposal: unknown) =>
          ProposalSchema.parse(proposal)
        );
        setProposals(validatedProposals);
      } else {
        console.warn("Expected an array but received:", rawProposals);
        setProposals([]);
      }
    } catch (error) {
      toast.error("Gagal mengambil data proposal.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddProposal = async (newProposal: addProposalDTO) => {
    try {
      const proposalData = ProposalSchema.partial().parse({
        ...newProposal,
        created_by: "ID Anonymous",
        updated_by: "ID Anonymous",
      });

      const { data: createdProposal } = await axios.post(API_URL, proposalData);

      const transformedProposal = {
        ...createdProposal,
        created_at: new Date(createdProposal.created_at),
        updated_at: new Date(createdProposal.updated_at),
      };

      const parsedProposal = ProposalSchema.parse(transformedProposal);
      setProposals((prevProposal) => [...prevProposal, parsedProposal]);
      toast.success("Proposal berhasil ditambahkan!");
    } catch (error) {
      toast.error("Gagal menambahkan Proposal");
    }
  };

  const handleStatusChange = async (proposalId: string, newStatus: ProposalStatusEnum) => {
    try {
      setLoading(true);
      const { data: updatedProposal } = await axios.put(
        `/api/proposal/${proposalId}/status`,
        { status: newStatus }
      );

      setProposals((prevProposals) =>
        prevProposals.map((proposal) =>
          proposal.proposal_id === proposalId
            ? { ...proposal, status: newStatus, updated_at: new Date(updatedProposal.updated_at) }
            : proposal
        )
      );
      toast.success("Status updated successfully!");
    } catch (error) {
      toast.error("Failed to update status.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProposal = async (proposalId: string) => {
    return proposalId;
  }

  return {
    proposals,
    loading,
    fetchAllProposals,
    handleAddProposal,
    handleDeleteProposal,
    handleStatusChange,
  };
}
