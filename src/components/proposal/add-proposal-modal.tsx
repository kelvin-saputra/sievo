"use client";

import * as React from "react";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Check, ChevronsUpDown } from "lucide-react";

// ✅ Import Dialog Components Correctly
import {
  Dialog,
  DialogTrigger,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { ProposalStatusEnum } from "@/models/enums";
import { ProposalSchema } from "@/models/schemas/proposal";
import { addProposalDTO } from "@/models/dto/proposal.dto";

interface AddProposalModalProps {
  onAddProposal: (data: addProposalDTO) => void;
  onClose: () => void;
}

export function AddProposalModal({ onAddProposal }: AddProposalModalProps) {
  const [open, setOpen] = useState<boolean>(false); // ✅ Ensure `useState` is properly typed

  // ✅ Ensure Zod schema validation is applied
  const form = useForm<z.infer<typeof ProposalSchema>>({
    resolver: zodResolver(ProposalSchema),
    defaultValues: {
      proposal_name: "",
      status: ProposalStatusEnum.enum.DRAFT,
      client_name: "",
      link: "",
      created_by: "550e8400-e29b-41d4-a716-446655440000", // Dummy UUID
      updated_by: "550e8400-e29b-41d4-a716-446655440000",
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  const onSubmit = (data: z.infer<typeof ProposalSchema>) => {
    console.log("Form submitted:", data);
    onAddProposal(data);
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}> {/* ✅ Ensure `onOpenChange` is properly passed */}
      <DialogTrigger asChild>
        <Button className="bg-blue-500 text-white">+ Add Proposal</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Proposal</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form id="add-proposal-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Proposal Name */}
            <FormField
              control={form.control}
              name="proposal_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proposal Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter proposal name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Client Name */}
            <FormField
              control={form.control}
              name="client_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter client name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Proposal Link */}
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proposal Link</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter proposal link" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status Selection */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                          {field.value ? field.value : "Select status"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="Search status..." />
                          <CommandList>
                            <CommandEmpty>No status found.</CommandEmpty>
                            <CommandGroup>
                              {Object.values(ProposalStatusEnum.enum).map((status) => (
                                <CommandItem
                                  key={status}
                                  value={status}
                                  onSelect={() => field.onChange(status)}
                                >
                                  <Check className="mr-2 h-4 w-4" />
                                  {status}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit & Cancel Buttons */}
            <div className="flex justify-end space-x-2">
              <Button variant="secondary" type="button" onClick={() => setOpen(false)}>
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
