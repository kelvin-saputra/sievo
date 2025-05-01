"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
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
  onAddContact: (data: AddContactDTO) => void;
}

export function AddContactModal({ onAddContact }: AddContactModalProps) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<Partial<UserSchema> | null>(null);

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

  const onSubmit = (data: AddContactDTO) => {
    // Ensure the current user ID is set correctly
    if (user && user.id) {
      data.created_by = user.id;
      data.updated_by = user.id;
    }
    
    console.log("Form submitted:", data);
    onAddContact(data);
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-500 text-white">+ Add Contact</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Contact</DialogTitle>
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
                    onValueChange={(value: "none" | "client" | "vendor") => field.onChange(value)} 
                    defaultValue={field.value}
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

            <div className="flex justify-end space-x-2">
              <Button variant="secondary" type="button" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" form="add-contact-form" className="bg-green-500 text-white">
                Add Contact
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}