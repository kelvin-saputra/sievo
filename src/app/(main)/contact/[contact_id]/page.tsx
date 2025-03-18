"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "lucide-react";
import useContact from "@/hooks/use-contact";
import PageHeader from "@/components/common/page-header";

const ContactDetail = () => {
  const { contact_id } = useParams();
  const { contact, loading, fetchContactById } = useContact();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (typeof contact_id === "string") {
      fetchContactById(contact_id);
    }
  }, [contact_id, fetchContactById]);

  if (loading) return <div>Loading...</div>;
  if (!contact) return <div>Contact not found.</div>;

  // Get role display text and badge styling
  const getRoleBadgeStyle = () => {
    switch (contact.role) {
      case "client":
        return { text: "Client", classes: "bg-green-100 text-green-800" };
      case "vendor":
        return { text: "Vendor", classes: "bg-orange-100 text-orange-800" };
      default:
        return { text: "None", classes: "bg-gray-100 text-gray-800" };
    }
  };

  const roleBadge = getRoleBadgeStyle();

  return (
    <div className="p-6 w-full max-w-7xl mx-auto">
      <PageHeader
        title="Contact Detail"
        breadcrumbs={[{ label: "Contacts", href: "/contact" }]}
      />
      <div className="grid md:grid-cols-[300px_1fr] gap-8">
        <div className="flex flex-col items-center">
          <div className="relative w-64 h-64 rounded-full border-4 border-muted bg-background mb-6">
            <div className="absolute inset-0 flex items-center justify-center">
              <User className="h-32 w-32 text-muted-foreground" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4">{contact.name}</h2>
          <Badge variant="outline" className={`px-4 py-1 text-sm font-medium ${roleBadge.classes}`}>
            {roleBadge.text}
          </Badge>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Name</label>
              <Input value={contact.name} disabled={!isEditing} className="w-full" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Email</label>
              <Input value={contact.email} disabled={!isEditing} className="w-full" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Phone Number</label>
              <Input value={contact.phone_number} disabled={!isEditing} className="w-full" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Role</label>
              <Input value={roleBadge.text} disabled={!isEditing} className="w-full" />
            </div>
          </div>
          <div className="flex justify-start">
            <Button onClick={() => setIsEditing(!isEditing)} className="bg-indigo-900 hover:bg-indigo-800">
              {isEditing ? "Save" : "Edit"}
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <Tabs defaultValue="description">
          <TabsList className="border-b w-full justify-start gap-8 px-0">
            <TabsTrigger value="description" className="pb-2 px-0 mr-8">Description</TabsTrigger>
            <TabsTrigger value="history" className="pb-2 px-0">History</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="pt-6">
            <p className="text-muted-foreground leading-relaxed">{contact.description || "No description available."}</p>
          </TabsContent>
          <TabsContent value="history" className="pt-6">
            <div className="relative border-l-2 border-muted pl-6 pb-6 space-y-8">
              <div className="relative">
                <div className="space-y-1">
                  <p className="font-medium">Created by {contact.created_by || "Unknown"}</p>
                  <p className="text-sm text-muted-foreground">{new Date(contact.created_at).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex justify-end mt-8">
        <Button variant="destructive">Delete</Button>
      </div>
    </div>
  );
};

export default ContactDetail;