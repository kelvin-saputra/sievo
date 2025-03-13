"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ Import useRouter
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";


import { ProposalStatusEnum } from "@/models/enums";
import { ProposalSchema } from "@/models/schemas/proposal";
import { addProposalDTO } from "@/models/dto/proposal.dto";

interface AddProposalModalProps {
  onAddProposal: (data: addProposalDTO) => Promise<void>;
  onClose: () => void;
  fetchAllProposals: () => Promise<void>; // ✅ Properly typed function
}

export function AddProposalModal({ onAddProposal, onClose, fetchAllProposals }: AddProposalModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(true); 

  const form = useForm<z.infer<typeof ProposalSchema>>({
    resolver: zodResolver(ProposalSchema),
    defaultValues: {
      proposal_name: "",
      status: ProposalStatusEnum.enum.DRAFT,
      client_name: "",
      proposal_link: "",
      created_by: "550e8400-e29b-41d4-a716-446655440000",
      updated_by: "550e8400-e29b-41d4-a716-446655440000",
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  const onSubmit = async (data: z.infer<typeof ProposalSchema>) => {
    console.log("Form submitted:", data);
    await onAddProposal(data);
    form.reset();
    handleClose(); // ✅ Close the modal properly
    await fetchAllProposals(); // ✅ Refresh proposal list
    router.replace("/proposal"); // ✅ Redirect to /proposal
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}> {/* ✅ Ensure modal state updates correctly */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Proposal</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form id="add-proposal-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="proposal_name" render={({ field }) => (
              <FormItem>
                <FormLabel>Proposal Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter proposal name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}/>
            
            <FormField control={form.control} name="client_name" render={({ field }) => (
              <FormItem>
                <FormLabel>Client Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter client name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}/>

            <FormField control={form.control} name="proposal_link" render={({ field }) => (
              <FormItem>
                <FormLabel>Proposal Link</FormLabel>
                <FormControl>
                  <Input placeholder="Enter proposal link" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}/>

            {/* Submit & Cancel Buttons */}
            <div className="flex justify-end space-x-2">
              <Button variant="secondary" type="button" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" form="add-proposal-form" className="bg-green-500 text-white">
                Add Proposal
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
