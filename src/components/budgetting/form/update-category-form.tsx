"use client";

import * as React from "react";
import { useState } from "react";
import { Edit } from "lucide-react";

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
import { UpdateBudgetItemCategoryDTO } from "@/models/dto";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { BudgetItemCategorySchema } from "@/models/schemas";

interface UpdateBudgetItemCategoryFormProps {
  onUpdateBudgetItemCategory: (category_id:number, dto: UpdateBudgetItemCategoryDTO) => void;
  category: BudgetItemCategorySchema
}

export function UpdateBudgetItemCategoryForm({onUpdateBudgetItemCategory, category} : UpdateBudgetItemCategoryFormProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<UpdateBudgetItemCategoryDTO>({
    resolver: zodResolver(UpdateBudgetItemCategoryDTO),
    defaultValues: {
        category_name: category.category_name,
    }
  })
  const onSubmit = async (data: UpdateBudgetItemCategoryDTO) => {
    try {
        console.log(data);
        onUpdateBudgetItemCategory(category.category_id, data);
        form.reset();
        setOpen(false);
    } catch {
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild >
        <Edit size={14} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Budget Category</DialogTitle>
          <DialogDescription>Change data that you want to change to update your categories</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="update-budget-category-item-form"
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
                    <Input placeholder="Enter the Category Name..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {}
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant={"outline"}
                onClick={() => {
                  form.reset()
                  setOpen(false)
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="update-budget-category-item-form"
                variant={"default"}
                className="text-white"
              >
                Update Category
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
