"use client";

import { DataTable } from "@/components/user-management/data-table";
import { createColumns } from "@/components/user-management/columns";
import { Button } from "@/components/ui/button";
import { useSafeContext } from "@/hooks/use-safe-context";
import UserContext from "@/models/context/user-context";
import { GenerateTokenModal } from "@/components/user-management/form/generate-token-form";
import { useState } from "react";
import { Plus } from "lucide-react";

export default function Page() {
  const { users, handleDeleteUser, handleGenerateToken } = useSafeContext(
    UserContext,
    "UserContext"
  );
  const columns = createColumns({ onDeleteUser: handleDeleteUser });
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <Button
          variant={"default"}
          className="mb-4"
          onClick={() => setIsGenerateModalOpen(true)}
        >
          <GenerateTokenModal
            open={isGenerateModalOpen}
            onOpenChange={setIsGenerateModalOpen}
            onGenerateToken={handleGenerateToken}
          />{" "}
          <Plus /> Generate Token
        </Button>
      </div>
      <div className="border rounded-lg">
        <DataTable columns={columns} data={users} />
      </div>
    </div>
  );
}
