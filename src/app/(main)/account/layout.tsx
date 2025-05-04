"use client";

import PageHeader from "@/components/common/page-header";
import useProfile from "@/hooks/use-profile";
import ProfileContext from "@/models/context/profile-context";
import { useEffect } from "react";

export default function UserManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, fetchProfile, handleUpdateProfile } = useProfile();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);
  return (
    <ProfileContext.Provider
      value={{
        user,
        loading,
        fetchProfile,
        handleUpdateProfile,
      }}
    >
      <div className="p-6 max-w-4xl mx-auto">
        <PageHeader title="Profile Management" />
        <div className="p-6 bg-white rounded-lg shadow-md">{children}</div>
      </div>
    </ProfileContext.Provider>
  );
}
