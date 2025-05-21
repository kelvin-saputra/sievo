"use client";

import PageHeader from "@/components/common/page-header";
import useUserManagement from "@/hooks/use-user";
import UserContext from "@/models/context/user-context";
import { useEffect } from "react";

export default function UserManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    users,
    loading,
    fetchAllUsers,
    handleDeleteUser,
    handleGenerateToken,
  } = useUserManagement();

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);
  return (
    <UserContext.Provider
      value={{
        users,
        loading,
        fetchAllUsers,
        handleDeleteUser,
        handleGenerateToken,
      }}
    >
      <div className="p-6 w-full mx-auto">
        <PageHeader title="User Management" />
        <div className="p-6 bg-white rounded-lg shadow-md">{children}</div>
      </div>
    </UserContext.Provider>
  );
}
