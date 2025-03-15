import { toast } from "sonner";
import axios from "axios";
import { ProposalSchema } from "@/models/schemas";
import { useState, useCallback } from "react";
import { addProposalDTO } from "@/models/dto/proposal.dto";
import { ProposalStatusEnum } from "@/models/enums";

const API_URL = process.env.NEXT_PUBLIC_PROPOSAL_API_URL!;
console.log("API_URL:", API_URL);

export default function useProposal() {
  const [loading, setLoading] = useState(false);
  const [proposals, setProposals] = useState<ProposalSchema[]>([]);

  const fetchAllProposals = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      console.log("API Response:", response.data);
      
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
      console.error("Terjadi kesalahan saat mengambil data proposal:", error);
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

          // 🔴 Debug: Log API Response Before Parsing with Zod
          console.log("📢 Raw API Response Before Zod:", createdProposal);

          // ✅ Convert `created_at` & `updated_at` from strings to Date before Zod validation
          const transformedProposal = {
              ...createdProposal,
              created_at: new Date(createdProposal.created_at),
              updated_at: new Date(createdProposal.updated_at),
          };

          console.log("📢 Transformed Proposal Before Zod:", transformedProposal);

          const parsedProposal = ProposalSchema.parse(transformedProposal);
          setProposals((prevProposal) => [...prevProposal, parsedProposal]);

          toast.success("Proposal berhasil ditambahkan!");
      } catch (error) {
          console.error("❌ Zod Validation Error:", error);
          toast.error("Gagal menambahkan Proposal");
      }
  };

  const handleStatusChange = async (proposalId: string, newStatus: ProposalStatusEnum) => {
    try {
      setLoading(true);
      console.log(`📢 Sending API request to: /api/proposal/${proposalId}/status`);
  
      // ✅ API request with correct URL and payload
      const { data: updatedProposal } = await axios.put(
        `/api/proposal/${proposalId}/status`,
        { status: newStatus }
      );
  
      // ✅ Ensure UI updates with `updated_at` from backend
      setProposals((prevProposals) =>
        prevProposals.map((proposal) =>
          proposal.proposal_id === proposalId 
            ? { ...proposal, status: newStatus, updated_at: new Date(updatedProposal.updated_at) } 
            : proposal
        )
      );
  
      toast.success("Status updated successfully!");
    } catch (error) {
      console.error("❌ Failed to update status:", error);
      toast.error("Failed to update status.");
    } finally {
      setLoading(false);
    }
  };
  
  
  const handleDeleteProposal = async (proposalId : string)=>{
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
