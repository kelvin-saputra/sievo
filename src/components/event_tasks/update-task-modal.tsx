"use client";

import * as React from "react";
import { useState } from "react";
import { format } from "date-fns";
import { Check, ChevronsUpDown, Edit } from "lucide-react";

import { cn } from "@/utils/shadUtils";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { UpdateTaskDTO } from "@/models/dto";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { TaskStatusEnum } from "@/models/enums";
import { TaskSchema } from "@/models/schemas";

interface UpdateTaskModalProps {
  task: TaskSchema;
  onUpdateTask: (
    taskId: string,
    createdBy: string,
    dto: UpdateTaskDTO
  ) => Promise<void>;
}

export function UpdateTaskModal({ task, onUpdateTask }: UpdateTaskModalProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<UpdateTaskDTO>({
    resolver: zodResolver(UpdateTaskDTO),
    defaultValues: {
      title: task.title || "",
      description: task.description || "",
      assigned_id: task.assigned_id || "",
      due_date: task.due_date ? new Date(task.due_date) : new Date(),
      status: task.status || "PENDING",
    },
  });

  const onSubmit = async (data: UpdateTaskDTO) => {
    try {
      await onUpdateTask(task.task_id, task.created_by, data);
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="hover:bg-gray-200 rounded-md transition"
          onClick={(e) => {
            e.stopPropagation();
          }}
          onMouseEnter={(e) => e.stopPropagation()}
          onMouseLeave={(e) => e.stopPropagation()}
        >
          <Edit
            onClick={(e) => e.stopPropagation()}
            size={18}
            className="text-blue-500"
          />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Task</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            id="update-task-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter task title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter task description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {}
            <FormField
              control={form.control}
              name="assigned_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assigned To</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter assignee ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {}
            <FormField
              control={form.control}
              name="due_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? format(field.value, "PPP")
                            : "Pick a due date"}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => {
                const [openStatus, setOpenStatus] = React.useState(false);
                return (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Popover open={openStatus} onOpenChange={setOpenStatus}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openStatus}
                            className="w-full justify-between"
                          >
                            {field.value || "Select task status"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput placeholder="Search status..." />
                            <CommandList>
                              <CommandEmpty>No status found.</CommandEmpty>
                              <CommandGroup>
                                {TaskStatusEnum.options.map((status) => (
                                  <CommandItem
                                    key={status}
                                    value={status}
                                    onSelect={(currentValue) => {
                                      field.onChange(
                                        currentValue === field.value
                                          ? ""
                                          : currentValue
                                      );
                                      setOpenStatus(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        field.value === status
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {status}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

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
                form="update-task-form"
                className="bg-green-500 text-white"
              >
                Update Task
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
