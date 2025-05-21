"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ContactSchema } from "@/models/schemas/contact";
import { AddContactDTO } from "@/models/dto";
import { UserSchema } from "@/models/schemas";

interface AddContactModalProps {
  onAddContact: (data: AddContactDTO & { clientType?: string; vendorType?: string }) => void;
}

export function AddContactModal({ onAddContact }: AddContactModalProps) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<Partial<UserSchema> | null>(null);
  const [selectedRole, setSelectedRole] = useState<"none" | "client" | "vendor">("none");
  const [clientType, setClientType] = useState<string>("INDIVIDUAL");
  const [vendorType, setVendorType] = useState<string>("OTHERS");

  useEffect(() => {
    try {
      const userData = localStorage.getItem("authUser");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        const userParsed = UserSchema.partial().parse(parsedUser);
        setUser(userParsed);
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }, []);

  const form = useForm<AddContactDTO>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone_number: "",
      address: "",
      description: "",
      created_by: "550e8400-e29b-41d4-a716-446655440000", // Default value, will be updated
      updated_by: "550e8400-e29b-41d4-a716-446655440000", // Default value, will be updated
      created_at: new Date(),
      updated_at: new Date(),
      is_deleted: false,
      role: "none" as "none" | "client" | "vendor"
    },
  });
  
  // Update created_by and updated_by fields when user data is loaded
  useEffect(() => {
    if (user && user.id) {
      form.setValue("created_by", user.id);
      form.setValue("updated_by", user.id);
    }
  }, [user, form]);

  const handleRoleChange = (value: "none" | "client" | "vendor") => {
    setSelectedRole(value);
    form.setValue("role", value);
  };

  const onSubmit = (data: AddContactDTO) => {
    // Ensure the current user ID is set correctly
    if (user && user.id) {
      data.created_by = user.id;
      data.updated_by = user.id;
    }
    
    const submissionData = {
      ...data,
      clientType: selectedRole === "client" ? clientType : undefined,
      vendorType: selectedRole === "vendor" ? vendorType : undefined
    };
    
    onAddContact(submissionData);
    form.reset();
    setSelectedRole("none");
    setClientType("INDIVIDUAL");
    setVendorType("OTHERS");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"default"}>+ Add Contact</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Contact</DialogTitle>
            <DialogDescription>Fill out the form below to add a new contact.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id="add-contact-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="Enter phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Additional details (optional)" 
                      {...field} 
                      value={field.value || ''} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select 
                    onValueChange={(value: "none" | "client" | "vendor") => handleRoleChange(value)} 
                    defaultValue={field.value}
                    value={selectedRole}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="client">Client</SelectItem>
                      <SelectItem value="vendor">Vendor</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedRole === "client" && (
              <FormItem>
                <FormLabel>Client Type</FormLabel>
                <Select 
                  onValueChange={setClientType}
                  defaultValue="INDIVIDUAL"
                  value={clientType}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select client type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                    <SelectItem value="CORPORATE">Corporate</SelectItem>
                    <SelectItem value="GOVERNMENT">Government</SelectItem>
                    <SelectItem value="EDUCATIONAL_INSTITUTION">Educational Institution</SelectItem>
                    <SelectItem value="COMMUNITIES_AND_ORGANIZATION">Communities and Organization</SelectItem>
                    <SelectItem value="COMMERCIAL_BRAND_AND_AGENCY">Commercial Brand and Agency</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}

            {selectedRole === "vendor" && (
              <FormItem>
                <FormLabel>Vendor Type</FormLabel>
                <Select 
                  onValueChange={setVendorType}
                  defaultValue="OTHERS"
                  value={vendorType}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vendor type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="OTHERS">Others</SelectItem>
                    <SelectItem value="FOOD_AND_BEVERAGES">Food and Beverages</SelectItem>
                    <SelectItem value="DECORATION">Decoration</SelectItem>
                    <SelectItem value="DOCUMENTATION">Documentation</SelectItem>
                    <SelectItem value="ACCOMODATION">Accommodation</SelectItem>
                    <SelectItem value="ENTERTAINMENT">Entertainment</SelectItem>
                    <SelectItem value="TRANSPORTATION">Transportation</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}

            <div className="flex justify-end space-x-2 pt-2">
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant={"default"} type="submit" form="add-contact-form">
                Add Contact
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}