import { useState, useEffect } from "react";
import { ProposalStatusEnum } from "@/models/enums";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";
import useProposal from "@/hooks/use-proposals";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

const StatusDropdown = ({ proposalId, initialStatus }: { 
  proposalId: string; 
  initialStatus: ProposalStatusEnum; 
}) => {
  const { handleStatusChange, fetchAllProposals } = useProposal();
  const [status, setStatus] = useState<ProposalStatusEnum | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<ProposalStatusEnum | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setStatus(initialStatus);
  }, [initialStatus]);

  const getAvailableStatuses = (currentStatus: ProposalStatusEnum): ProposalStatusEnum[] => {
    switch (currentStatus) {
      case "DRAFT":
        return ["ON_REVIEW", "CANCELLED"];
      case "ON_REVIEW":
        return ["APPROVED", "REJECTED", "CANCELLED"];
      case "APPROVED":
        return ["ON_CONTACT", "CANCELLED"];
      case "ON_CONTACT":
        return ["ACCEPTED", "CANCELLED"];
      case "REJECTED":
        return ["DRAFT", "CANCELLED"];
      case "ACCEPTED":
        return ["CANCELLED"]; 
      case "CANCELLED":
        return Object.values(ProposalStatusEnum.enum) as ProposalStatusEnum[];
      default:
        return [];
    }
  };

  const availableStatuses = getAvailableStatuses(status as ProposalStatusEnum);

  const onStatusSelect = (newStatus: ProposalStatusEnum) => {
    if (newStatus === status) return;
    setSelectedStatus(newStatus);
    setIsModalOpen(true);
  };

  const confirmStatusChange = async () => {
    if (!selectedStatus) return;

    try {
      setStatus(selectedStatus);
      await handleStatusChange(proposalId, selectedStatus);
      setIsModalOpen(false);
      toast.success(`Status updated to ${selectedStatus}!`);

      await fetchAllProposals();

      setTimeout(() => {
        window.location.reload(); 
      }, 100);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status. Please try again.");
    }
  };

  const statusColors: Record<ProposalStatusEnum, string> = {
    DRAFT: "bg-slate-200 text-slate-700",
    ON_REVIEW: "bg-sky-200 text-sky-700",
    APPROVED: "bg-emerald-200 text-emerald-700",
    REJECTED: "bg-rose-200 text-rose-700",
    ON_CONTACT: "bg-indigo-200 text-indigo-700",
    ACCEPTED: "bg-teal-200 text-teal-700",
    CANCELLED: "bg-amber-200 text-amber-700",
  };

  const getStatusColor = (status: ProposalStatusEnum | null) => {
    return status ? statusColors[status] : "bg-gray-200 text-black";
  };

  return (
    <>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`w-28 text-xs justify-center flex mx-auto ${getStatusColor(status)}`}
          >
            {status ?? "Loading..."} 
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-32 p-1 text-sm text-center">
          <Command>
            <CommandInput placeholder="Search..." className="text-xs" />
            <CommandList>
              <CommandEmpty>No status found.</CommandEmpty>
              <CommandGroup>
                {availableStatuses.map((s) => (
                  <CommandItem key={s} value={s} onSelect={() => onStatusSelect(s)}>
                    <span className={`px-2 py-1 rounded-md ${statusColors[s]}`}>{s}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      
      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Status Change</DialogTitle>
              <p>Are you sure you want to change the status to <b>{selectedStatus}</b>?</p>
            </DialogHeader>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button variant="default" onClick={confirmStatusChange}>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default StatusDropdown;
