"use client";

import * as React from "react";
import { useState } from "react";
import { Plus } from "lucide-react";

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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AddBudgetItemCategoryDTO } from "@/models/dto/category.dto";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

interface AddBudgetItemCategoryFormProps {
  onAddBudgetItemCategory: (is_actual:boolean, dto: AddBudgetItemCategoryDTO) => void;
  is_actual: boolean;
}

export function AddBudgetItemCategoryForm({onAddBudgetItemCategory, is_actual} : AddBudgetItemCategoryFormProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<AddBudgetItemCategoryDTO>({
    resolver: zodResolver(AddBudgetItemCategoryDTO),
    defaultValues: {
        category_name: "",
    }
  })
  const onSubmit = async (data: AddBudgetItemCategoryDTO) => {
    try {
        onAddBudgetItemCategory(is_actual, data);
        form.reset();
        setOpen(false);
    } catch {
        toast.error("Gagal mengirimkan data kategori budget")
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
            <Plus />
            Budget Category
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Budget Category</DialogTitle>
          <DialogDescription>Fill all the field to add budget category</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="add-budget-category-item-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {}
            <FormField
              control={form.control}
              name="category_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Budget Category Name..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {}
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="add-budget-category-item-form"
                className="text-white"
              >
                Add Category
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
