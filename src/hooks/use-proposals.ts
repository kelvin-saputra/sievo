import { toast } from "sonner";
import axios from "axios";
import { ProposalSchema } from "@/models/schemas";
import { useState, useCallback } from "react";
import { addProposalDTO } from "@/models/dto/proposal.dto";

const API_URL = process.env.NEXT_PUBLIC_PROPOSAL_API_URL!;
console.log("API_URL:", API_URL);

export default function useProposal() {
  const [loading, setLoading] = useState(false);
  const [proposals, setProposals] = useState<ProposalSchema[]>([]);

  const fetchAllProposals = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      
      // Access the nested data property if applicable
      const rawProposals = response.data.data || response.data; // Ensure compatibility

      // Check if rawProposals is an array
      if (Array.isArray(rawProposals)) {
        const validatedProposals = rawProposals.map((proposal: unknown) =>
          ProposalSchema.parse(proposal)
        );
        setProposals(validatedProposals);
      } else {
        console.warn("Expected an array but received:", rawProposals);
        setProposals([]); // Set to empty array if not an array
      }
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data proposal:", error);
      toast.error("Gagal mengambil data proposal.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddProposal = async(newProposal: addProposalDTO) => {
    try {
      const response = await axios.get(API_URL);
      if (response.status !== 200){
        console.error("API Error:", response.data.message);
        toast.error("Failed to fetch existing proposal: " + response.data.message);
        return; 
      }
      const existingProposal = response.data.data || [];
      if(!Array.isArray(existingProposal)){
        console.error("Expected an array but received:", existingProposal);
        toast.error("Failed to fetch existing proposaals.");
        return; 
      }
      const proposalData = ProposalSchema.partial().parse({
        ...newProposal,
        created_by: "ID Anonymous",
        updated_by: "ID Anonymous",

      })
      const { data : createdProposal} = await axios.post(API_URL, proposalData);
      const parsedProposal = ProposalSchema.parse(createdProposal);

      setProposals((prevProposal)=>[...prevProposal,parsedProposal]);
      toast.success("Event berhasil ditambahkan!");
    } catch (error) {
      console.error("Terjadi kesalahan",error)
      toast.error("Gagal menambahkan Proposal");
    }
  }

  const handleDeleteProposal = async (proposalId : string)=>{
    return proposalId;
  }

  return {
    proposals,
    loading,
    fetchAllProposals,
    handleAddProposal,
    handleDeleteProposal,
  };
}
