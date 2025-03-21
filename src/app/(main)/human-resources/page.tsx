"use client";

import { useEffect } from "react";
import useHr from "@/hooks/use-hr";
import { HrTable } from "./data-table";
import { hrColumns } from "./columns";

export default function UsersPage() {
  const { fetchAllUsers, users } = useHr();

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  return (
    <div className="p-6 w-full max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Users</h1>
      <HrTable columns={hrColumns} data={users} />
    </div>
  );
}
