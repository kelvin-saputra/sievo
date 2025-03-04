"use client";

import * as React from "react";
import { useState } from "react";
import { format } from "date-fns";
import { Check, ChevronsUpDown } from "lucide-react";

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
import { UpdateEventDTO } from "@/models/dto";
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
import { EventStatusEnum } from "@/models/enums";
import { EventSchema } from "@/models/schemas";

interface UpdateEventModalProps {
  event: EventSchema;
  createdBy: string;
  onUpdateEvent: (
    eventId: string,
    createdBy: string,
    dto: UpdateEventDTO
  ) => Promise<void>;
}

export function UpdateEventModal({
  event,
  createdBy,
  onUpdateEvent,
}: UpdateEventModalProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<UpdateEventDTO>({
    resolver: zodResolver(UpdateEventDTO),
    defaultValues: {
      event_name: event.event_name || "",
      location: event.location || "",
      start_date: event.start_date ? new Date(event.start_date) : new Date(),
      end_date: event.end_date ? new Date(event.end_date) : new Date(),
      notes: event.notes || "",
      participant_plan: event.participant_plan || 0,
      status: event.status || EventStatusEnum.enum.PLANNING,
      manager_id: event.manager_id || "",
      client_id: event.client_id || "",
    },
  });

  const onSubmit = async (data: UpdateEventDTO) => {
    try {
      await onUpdateEvent(event.event_id, createdBy, data);
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-500 text-white">Update Event</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Event</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            id="update-event-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {}
            <FormField
              control={form.control}
              name="event_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter event name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="participant_plan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Participant Plan</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Number of participants"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
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
                              : "Pick a date"}
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

              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
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
                              : "Pick a date"}
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
            </div>

            {}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional details (optional)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {}
            <div className="grid grid-cols-2 gap-4">
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
                              {field.value
                                ? field.value
                                : "Select event status"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0">
                            <Command>
                              <CommandInput placeholder="Search status..." />
                              <CommandList>
                                <CommandEmpty>No status found.</CommandEmpty>
                                <CommandGroup>
                                  {EventStatusEnum.options.map((status) => (
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

              {}
              <FormField
                control={form.control}
                name="manager_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manager ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter manager ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {}
            <FormField
              control={form.control}
              name="client_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter client ID" {...field} />
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
                form="update-event-form"
                className="bg-green-500 text-white"
              >
                Update Event
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
