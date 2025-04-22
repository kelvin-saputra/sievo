"use client"

import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ProposalSchema } from "@/models/schemas"
import type { Proposal } from "../columns"
import type { updateProposalDTO } from "@/models/dto/proposal.dto"

// 🧠 Only allow editing these fields
const UpdateProposalSchema = ProposalSchema.pick({
  proposal_name: true,
  client_name: true,
  proposal_link: true,
})

type UpdateProposalType = z.infer<typeof UpdateProposalSchema>

interface UpdateProposalModalProps {
  isOpen: boolean
  onClose: () => void
  onUpdate: (proposalId: string, updatedBy: string, data: updateProposalDTO) => void
  proposal: Proposal | null
}

export function UpdateProposalModal({ isOpen, onClose, onUpdate, proposal }: UpdateProposalModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateProposalType>({
    resolver: zodResolver(UpdateProposalSchema),
  })

  // Set default values when proposal changes or modal opens
  useEffect(() => {
    if (proposal && isOpen) {
      reset({
        proposal_name: proposal.proposal_name,
        client_name: proposal.client_name,
        proposal_link: proposal.proposal_link,
      })
    }
  }, [proposal, isOpen, reset])

  const onSubmit = (data: UpdateProposalType) => {
    if (proposal) {
      onUpdate(proposal.proposal_id, proposal.updated_by ?? "ID Anonymous", data)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Update Proposal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Proposal Name */}
          <div className="space-y-2">
            <Label htmlFor="proposal_name">Proposal Name</Label>
            <Input id="proposal_name" {...register("proposal_name")} />
            {errors.proposal_name && (
              <p className="text-sm text-red-500">{errors.proposal_name.message}</p>
            )}
          </div>

          {/* Client Name */}
          <div className="space-y-2">
            <Label htmlFor="client_name">Client Name</Label>
            <Input id="client_name" {...register("client_name")} />
            {errors.client_name && (
              <p className="text-sm text-red-500">{errors.client_name.message}</p>
            )}
          </div>

          {/* Proposal Link */}
          <div className="space-y-2">
            <Label htmlFor="proposal_link">Proposal Link</Label>
            <Input id="proposal_link" {...register("proposal_link")} />
            {errors.proposal_link && (
              <p className="text-sm text-red-500">{errors.proposal_link.message}</p>
            )}
          </div>

          {/* Buttons */}
          <DialogFooter className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#1e2a4a] hover:bg-[#162039] text-white">
              Update Proposal
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
