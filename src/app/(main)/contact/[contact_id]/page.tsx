"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import useContact from "@/hooks/use-contact";
import PageHeader from "@/components/common/page-header";
import { z } from "zod";
import { UserSchema } from "@/models/schemas";

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Nama kontak minimal 2 karakter" }),
  email: z.string().email({ message: "Email tidak valid" }),
  phone_number: z.string().min(10, { message: "Nomor handphone minimal 10 karakter" }),
  description: z.string().optional()
});

const ContactDetail = () => {
  const { contact_id } = useParams();
  const router = useRouter();
  const { contact, loading, fetchContactById, handleUpdateContact, handleDeleteContact } = useContact();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [user, setUser] = useState<Partial<UserSchema> | null>(null);
  const [createdByUser, setCreatedByUser] = useState<string>("Unknown");
  const [updatedByUser, setUpdatedByUser] = useState<string>("Unknown");
  const [userRole, setUserRole] = useState<string>("");
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    description: "",
    role: "none" as "none" | "client" | "vendor"
  });

  // Check if user has permission to edit contacts
  const canEdit = ["ADMIN", "EMPLOYEE", "EXECUTIVE"].includes(userRole);
  
  // Check if user has permission to delete contacts
  const canDelete = ["ADMIN", "EXECUTIVE"].includes(userRole);

  useEffect(() => {
    if (typeof contact_id === "string") {
      fetchContactById(contact_id);
    }
  }, [contact_id, fetchContactById]);

  useEffect(() => {
    try {
      const userData = localStorage.getItem("authUser");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        const userParsed = UserSchema.partial().parse(parsedUser);
        setUser(userParsed);
        
        // Set user role for permission checks
        setUserRole((parsedUser.role || "").toUpperCase());
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }, []);

  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name,
        email: contact.email,
        phone_number: contact.phone_number,
        description: contact.description || "",
        role: contact.role || "none"
      });
      
      // Attempt to get user details for created_by and updated_by
      try {
        // Get users from localStorage if available
        const usersData = localStorage.getItem("users");
        if (usersData) {
          const users = JSON.parse(usersData);
          
          // Find created_by user
          if (contact.created_by) {
            const createdByUserData = users.find((u: any) => u.id === contact.created_by);
            setCreatedByUser(createdByUserData ? createdByUserData.name : contact.created_by);
          }
          
          // Find updated_by user
          if (contact.updated_by) {
            const updatedByUserData = users.find((u: any) => u.id === contact.updated_by);
            setUpdatedByUser(updatedByUserData ? updatedByUserData.name : contact.updated_by);
          }
        } else {
          // Fallback to showing IDs if user mapping is not available
          setCreatedByUser(contact.created_by || "Unknown");
          setUpdatedByUser(contact.updated_by || "Unknown");
        }
      } catch (error) {
        console.error("Error mapping user IDs to names:", error);
        setCreatedByUser(contact.created_by || "Unknown");
        setUpdatedByUser(contact.updated_by || "Unknown");
      }
    }
  }, [contact]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    try {
      // Extract only the fields that can be edited from formData
      const { name, email, phone_number, description } = formData;
      contactFormSchema.parse({ name, email, phone_number, description });
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0] as string] = err.message;
          }
        });
        setFormErrors(errors);
      }
      return false;
    }
  };

  const handleEdit = () => {
    if (!canEdit) {
      toast.error("Anda tidak memiliki akses untuk mengubah Contact.");
      return;
    }
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!canEdit) {
      toast.error("Anda tidak memiliki akses untuk mengubah Contact.");
      return;
    }

    if (!validateForm()) {
      toast.error("Ada kesalahan dalam pengisian form");
      return;
    }

    if (!contact_id || typeof contact_id !== "string") {
      toast.error("ID kontak tidak valid");
      return;
    }

    try {
      // Use the current user ID from localStorage if available
      const userId = user?.id || "550e8400-e29b-41d4-a716-446655440000";
      
      await handleUpdateContact(
        contact_id,
        userId,
        {
          name: formData.name,
          email: formData.email,
          phone_number: formData.phone_number,
          description: formData.description,
          // Role is not included in the update
          updated_at: new Date()
        }
      );
      
      setIsEditing(false);
      // Re-fetch the contact to get the latest data
      fetchContactById(contact_id);
    } catch (error) {
      console.error("Error updating contact:", error);
      toast.error("Gagal memperbarui contact. Silakan coba lagi.");
    }
  };

  const handleDeleteClick = () => {
    if (!canDelete) {
      toast.error("Anda tidak memiliki akses untuk menghapus Contact.");
      return;
    }
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!canDelete) {
      toast.error("Anda tidak memiliki akses untuk menghapus Contact.");
      return;
    }
    
    if (!contact_id || typeof contact_id !== "string") return;
    
    try {
      await handleDeleteContact(contact_id);
      router.push("/contact");
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast.error("Gagal menghapus contact. Silakan coba lagi.");
    }
    setIsDeleteDialogOpen(false);
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (!contact) return <div className="text-center py-12">Contact not found.</div>;

  // Get role display text and badge styling
  const getRoleBadgeStyle = () => {
    switch (formData.role) {
      case "client":
        return { text: "Client", classes: "bg-green-100 text-green-800" };
      case "vendor":
        return { text: "Vendor", classes: "bg-orange-100 text-orange-800" };
      default:
        return { text: "None", classes: "bg-gray-100 text-gray-800" };
    }
  };

  const roleBadge = getRoleBadgeStyle();

  // Format date for display
  const formatDate = (dateString: string | Date) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch (error) {
      return "Invalid date";
    }
  };

  return (
    <div className="p-6 w-full max-w-7xl mx-auto">
      <PageHeader
        title="Contact Detail"
      />
      <div className="grid md:grid-cols-[300px_1fr] gap-8">
        <div className="flex flex-col items-center">
          <div className="relative w-64 h-64 rounded-full border-4 border-muted bg-background mb-6">
            <div className="absolute inset-0 flex items-center justify-center">
              <User className="h-32 w-32 text-muted-foreground" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4">{formData.name}</h2>
          <Badge variant="outline" className={`px-4 py-1 text-sm font-medium ${roleBadge.classes}`}>
            {roleBadge.text}
          </Badge>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Name</label>
              <Input 
                name="name"
                value={formData.name} 
                onChange={handleChange}
                disabled={!isEditing} 
                className="w-full" 
              />
              {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Email</label>
              <Input 
                name="email"
                value={formData.email} 
                onChange={handleChange}
                disabled={!isEditing} 
                className="w-full" 
              />
              {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Phone Number</label>
              <Input 
                name="phone_number"
                value={formData.phone_number} 
                onChange={handleChange}
                disabled={!isEditing} 
                className="w-full" 
              />
              {formErrors.phone_number && <p className="text-red-500 text-xs mt-1">{formErrors.phone_number}</p>}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Role</label>
              <Input 
                value={roleBadge.text} 
                disabled 
                className="w-full" 
              />
              {isEditing && (
                <p className="text-xs text-muted-foreground italic mt-1">
                  Role tidak dapat diubah setelah kontak dibuat
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Description</label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full"
                placeholder="Description of contact"
              />
            </div>
          </div>
          <div className="flex justify-start">
            {isEditing ? (
              <>
                <Button 
                  onClick={handleSave} 
                  className="bg-indigo-900 hover:bg-indigo-800"
                >
                  Save
                </Button>
                <Button 
                  onClick={() => {
                    setIsEditing(false);
                    // Reset form data to original contact data
                    if (contact) {
                      setFormData({
                        name: contact.name,
                        email: contact.email,
                        phone_number: contact.phone_number,
                        description: contact.description || "",
                        role: contact.role || "none"
                      });
                    }
                    setFormErrors({});
                  }} 
                  variant="outline"
                  className="ml-2"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button 
                onClick={handleEdit} 
                className={`bg-indigo-900 hover:bg-indigo-800 ${!canEdit ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!canEdit}
              >
                Edit
              </Button>
            )}
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
            <p className="text-muted-foreground leading-relaxed">{formData.description || "No description available."}</p>
          </TabsContent>
          <TabsContent value="history" className="pt-6">
            <div className="relative border-l-2 border-muted pl-6 pb-6 space-y-8">
              <div className="relative">
                <div className="space-y-1">
                  <p className="font-medium">Created by {createdByUser}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(contact.created_at)}</p>
                </div>
              </div>
              {contact.updated_by && (
                <div className="relative">
                  <div className="space-y-1">
                    <p className="font-medium">Last Updated by {updatedByUser}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(contact.updated_at)}</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex justify-end mt-8">
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button 
              variant="destructive" 
              onClick={handleDeleteClick}
              className={!canDelete ? 'opacity-50 cursor-not-allowed' : ''}
              disabled={!canDelete}
            >
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin menghapus kontak ini? Tindakan ini tidak dapat dibatalkan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default ContactDetail;