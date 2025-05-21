"use client"

import { toast } from "sonner";
import axios from "axios";
import { ProposalSchema } from "@/models/schemas";
import { useState, useCallback } from "react";
import { addProposalDTO, updateProposalDTO } from "@/models/dto/proposal.dto";
import { ProposalStatusEnum } from "@/models/enums";
import { ADMINEXECUTIVEINTERNAL, checkRoleClient } from "@/lib/rbac-client";
import { getUserDataClient } from "@/lib/userData";

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
    } catch {
      toast.error("Gagal mengambil data proposal.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddProposal = async (newProposal: addProposalDTO) => {
    try {
      if (!checkRoleClient(ADMINEXECUTIVEINTERNAL)) {
        toast.error("Anda tidak memiliki akses untuk menambahkan Proposal.");
        return;
      }
      
      const proposalData = ProposalSchema.partial().parse({
        ...newProposal,
        status: newProposal.status ?? "DRAFT", 
        created_by: getUserDataClient().email,
        updated_by: getUserDataClient().email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
  
      const { data: createdProposal } = await axios.post(API_URL, proposalData);
  
      const transformedProposal = {
        ...createdProposal,
        created_at: createdProposal.created_at
          ? new Date(createdProposal.created_at)
          : new Date(),
        updated_at: createdProposal.updated_at
          ? new Date(createdProposal.updated_at)
          : new Date(),
      };
  
      const parsedProposal = ProposalSchema.parse(transformedProposal);
      setProposals((prevProposal) => [...prevProposal, parsedProposal]);
      toast.success("Proposal berhasil ditambahkan!");
    } catch (error) {
      console.error("❌ Failed to add proposal:", error); // ✅ Log for debugging
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

      if (!checkRoleClient(ADMINEXECUTIVEINTERNAL)) {
        toast.error("Anda tidak memiliki akses untuk mengubah status Proposal.");
        return;
      }

      setProposals((prevProposals) =>
        prevProposals.map((proposal) =>
          proposal.proposal_id === proposalId
            ? { ...proposal, status: newStatus, updated_at: new Date(updatedProposal.updated_at),updated_by: getUserDataClient().email}
            : proposal
        )
      );
      toast.success("Status updated successfully!");
    } catch {
      toast.error("Failed to update status.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProposal = async (proposalId: string) => {
    try {
      setLoading(true);
      const response = await axios.delete(`/api/proposal/${proposalId}`);
      const updatedProposal = response.data.data;

      if (!checkRoleClient(ADMINEXECUTIVEINTERNAL)) {
        toast.error("Anda tidak memiliki akses untuk menghapus Proposal.");
        return;
      }
  
      setProposals((prevProposals) =>
        prevProposals.map((proposal) =>
          proposal.proposal_id === proposalId
            ? { ...proposal, deleted: true, updated_at: new Date(updatedProposal.updated_at),updated_by: getUserDataClient().email }
            : proposal
        )
      );
      await fetchAllProposals();
      toast.success("Proposal deleted successfully!");
    } catch {
      toast.error("Failed to delete proposal.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProposal = async (
    proposalId: string,
    updated_by: string,
    data: updateProposalDTO

    
  ) => {
    try {
      if (!checkRoleClient(ADMINEXECUTIVEINTERNAL)) {
        toast.error("Anda tidak memiliki akses untuk mengubah Proposal.");
        return;
      }

      const updatedData = ProposalSchema.pick({
        proposal_name: true,
        client_name: true,
        proposal_link: true,
        updated_by: true,
        updated_at: true,
      })
        .partial()
        .parse({
          ...data,
          updated_by: getUserDataClient().email,
          updated_at: new Date().toISOString(),
        });
  
      const { data: updatedProposal } = await axios.put(
        `/api/proposal/${proposalId}`,
        updatedData
      );
  
      const parsedProposal = ProposalSchema.parse(updatedProposal);
  
      setProposals((prevProposals) =>
        prevProposals.map((p) =>
          p.proposal_id === proposalId ? parsedProposal : p
        )
      );
  
      toast.success("Proposal berhasil diperbarui!");
    } catch (error) {
      console.error("❌ Gagal memperbarui Proposal:", error);
      toast.error("Gagal memperbarui Proposal.");
    }
  };
  

  return {
    proposals,
    loading,
    fetchAllProposals,
    handleAddProposal,
    handleDeleteProposal,
    handleStatusChange,
    handleUpdateProposal,
  };
}
