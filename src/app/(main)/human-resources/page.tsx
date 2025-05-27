"use client";

import { useEffect } from "react";
import useHr from "@/hooks/use-hr";
import { HrTable } from "../../../components/human-resources/data-table";
import { hrColumns } from "../../../components/human-resources/columns";
import Loading from "@/components/ui/loading";

export default function UsersPage() {
  const { fetchAllUsers, users, loading} = useHr();

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  if(loading) {
    return (<Loading message="Fetching Human Resource data..." />);
  }

  return (
    <div className="p-6 w-full max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Human Resources Management</h1>
      <HrTable columns={hrColumns} data={users} />
    </div>
  );
}
