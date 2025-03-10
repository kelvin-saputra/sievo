import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import { ProposalSchema } from "@/models/schemas";
import { useState, useCallback } from "react";

const API_URL = process.env.NEXT_PUBLIC_PROPOSAL_API_URL!;
console.log("API_URL:", API_URL);

export default function useProposal() {
  const router = useRouter();
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

  return {
    proposals,
    loading,
    fetchAllProposals,
  };
}
