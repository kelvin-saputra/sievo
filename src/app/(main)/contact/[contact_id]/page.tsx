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
import { ADMINEXECUTIVE, ADMINEXECUTIVEINTERNAL, checkRoleClient } from "@/lib/rbac-client";
import { getUserDataClient } from "@/lib/userData";

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Contact name must be at least 2 characters long" }),
  email: z.string().email({ message: "Invalid Email" }),
  phone_number: z.string().min(10, { message: "Phone number must be at least 10 characters long" }),
  address: z.string().min(5,{message: "Invalid Addres" }),
  description: z.string().optional()
});

// Format enum values to readable text
const formatEnumValue = (value: string) => {
  if (!value) return "";
  
  // Handle empty or N/A values
  if (value === "N/A") return value;
  
  return value
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const ContactDetail = () => {
  const { contact_id } = useParams();
  const router = useRouter();
  const { contact, loading, fetchContactById, handleUpdateContact, handleDeleteContact } = useContact();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    address: "",
    description: "",
    role: "none" as "none" | "client" | "vendor",
    type: ""
  });

  useEffect(() => {
    if (typeof contact_id === "string") {
      fetchContactById(contact_id);
    }
  }, [contact_id, fetchContactById]);

  useEffect(() => {
    if (contact) {
      // Determine contact type based on role
      let contactType = "N/A";
      if (contact.role === "client" && contact.client?.type) {
        contactType = contact.client.type;
      } else if (contact.role === "vendor" && contact.vendor?.type) {
        contactType = contact.vendor.type;
      }
      
      setFormData({
        name: contact.name,
        email: contact.email,
        phone_number: contact.phone_number,
        address: contact.address || "",
        description: contact.description || "",
        role: contact.role || "none",
        type: contactType
      });
    }
  }, [contact]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    try {
      const { name, email, phone_number, address, description } = formData;
      contactFormSchema.parse({ name, email, phone_number, address, description });
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
    if (!checkRoleClient(ADMINEXECUTIVEINTERNAL)) {
      toast.error("You do not have access to edit Contact.");
      return;
    }
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!checkRoleClient(ADMINEXECUTIVEINTERNAL)) {
      toast.error("You do not have access to edit Contact.");
      return;
    }

    if (!validateForm()) {
      toast.error("There was an error in filling out the form");
      return;
    }

    if (!contact_id || typeof contact_id !== "string") {
      toast.error("Invalid Contact ID");
      return;
    }

    try {
      const userId = getUserDataClient().id || "550e8400-e29b-41d4-a716-446655440000";
      
      // Create the update payload
      const updateData: any = {
        name: formData.name,
        email: formData.email,
        phone_number: formData.phone_number,
        description: formData.description,
        address: formData.address,     
        updated_at: new Date(),
      };
      
      // Only include type if it exists and the contact has a role
      if (formData.type && formData.role !== "none") {
        updateData.type = formData.type;
      }
      
      await handleUpdateContact(
        contact_id,
        userId,
        updateData
      );
      
      setIsEditing(false);
      fetchContactById(contact_id);
    } catch (error) {
      console.error("Error updating contact:", error);
      toast.error("Failed to update contact. Please try again.");
    }
  };

  const handleDeleteClick = () => {
    if (!checkRoleClient(ADMINEXECUTIVE)) {
      toast.error("You do not have access to delete Contacts.");
      return;
    }
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!checkRoleClient(ADMINEXECUTIVE)) {
      toast.error("You do not have access to delete Contacts.");
      return;
    }
    
    if (!contact_id || typeof contact_id !== "string") return;
    
    try {
      await handleDeleteContact(contact_id);
      router.push("/contact");
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast.error("Failed to delete contact. Please try again.");
    }
    setIsDeleteDialogOpen(false);
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (!contact) return <div className="text-center py-12">Contact not found.</div>;

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

  const formatDate = (dateString: string | Date) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return "Invalid date";
    }
  };

  const getCreatedByEmail = () => {
    return contact.created_by_email || contact.created_by || "Unknown";
  };

  const getUpdatedByEmail = () => {
    return contact.updated_by_email || contact.updated_by || "Unknown";
  };

  return (
    <div className="p-6 w-full max-w-7xl mx-auto">
      <PageHeader title="Contact Detail" />
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
          {formData.type && formData.type !== "N/A" && (
            <Badge variant="outline" className="px-4 py-1 text-sm font-medium bg-blue-100 text-blue-800 mt-2">
              {formatEnumValue(formData.type)}
            </Badge>
          )}
        </div>
        <div className="space-y-6">
          <div className="space-y-4">
            {["name", "email", "phone_number", "address"].map((field) => (
              <div className="space-y-2" key={field}>
                <label className="block text-sm font-medium">
                  {field === "name" ? "Name" : 
                   field === "email" ? "Email" : 
                   field === "phone_number" ? "Phone Number" : "Address"}
                </label>
                {field === "address" ? (
                  <Textarea
                    name={field}
                    value={(formData as any)[field]}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full"
                    placeholder="Contact address"
                  />
                ) : (
                  <Input 
                    name={field}
                    value={(formData as any)[field]} 
                    onChange={handleChange}
                    disabled={!isEditing} 
                    className="w-full" 
                  />
                )}
                {formErrors[field] && <p className="text-red-500 text-xs mt-1">{formErrors[field]}</p>}
              </div>
            ))}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Role</label>
              <Input value={roleBadge.text} disabled className="w-full" />
              {isEditing && (
                <p className="text-xs text-muted-foreground italic mt-1">
                  Roles cannot be changed once a contact is created.
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Type</label>
              <Input value={formatEnumValue(formData.type)} disabled className="w-full" />
              {isEditing && (
                <p className="text-xs text-muted-foreground italic mt-1">
                  Type cannot be changed once a contact is created.
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
                <Button onClick={handleSave} variant={"default"}>
                  Save
                </Button>
                <Button 
                  onClick={() => {
                    setIsEditing(false);
                    if (contact) {
                      let contactType = "N/A";
                      if (contact.role === "client" && contact.client?.type) {
                        contactType = contact.client.type;
                      } else if (contact.role === "vendor" && contact.vendor?.type) {
                        contactType = contact.vendor.type;
                      }
                      
                      setFormData({
                        name: contact.name,
                        email: contact.email,
                        phone_number: contact.phone_number,
                        address: contact.address || "",
                        description: contact.description || "",
                        role: contact.role || "none",
                        type: contactType
                      });
                    }
                    setFormErrors({});
                  }} 
                  variant={"outline"}
                  className="ml-2"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button 
                onClick={handleEdit} 
                variant={"default"}
                className={`${!checkRoleClient(ADMINEXECUTIVEINTERNAL) ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!checkRoleClient(ADMINEXECUTIVEINTERNAL)}
              >
                Edit
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="my-12 w-full max-w-5xl">
        <Tabs defaultValue="description" className="w-full">
          <TabsList>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="pt-6">
            <p className="text-muted-foreground leading-relaxed">{formData.description || "No description available."}</p>
          </TabsContent>
          <TabsContent value="history" className="pt-6">
            <div className="relative border-l-2 border-muted pl-6 pb-6 space-y-8">
              <div className="relative">
                <div className="space-y-1">
                  <p className="font-medium">Created by {getCreatedByEmail()}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(contact.created_at)}</p>
                </div>
              </div>
              {contact.updated_by && (
                <div className="relative">
                  <div className="space-y-1">
                    <p className="font-medium">Last Updated by {getUpdatedByEmail()}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(contact.updated_at)}</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {checkRoleClient(ADMINEXECUTIVE) && (
        <div className="flex justify-end mt-8">
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" onClick={handleDeleteClick}>
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to delete this contact?</AlertDialogTitle>
                <AlertDialogDescription>
                This action can not be undone. This will permanently delete the contact.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/80">
                  Delete
                </AlertDialogAction>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
};

export default ContactDetail;
