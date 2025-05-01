"use client";

import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import EventCard from "@/components/events/event-card";
import useEvent from "@/hooks/use-event";
import useHr from "@/hooks/use-hr";
import useContact from "@/hooks/use-contact";
import { AddEventModal } from "@/components/events/form/add-event-modal";
import PageHeader from "@/components/common/page-header";

export default function ViewAllEvents() {
  const {
    events,
    loading,
    fetchAllEvents,
    handleDeleteEvent,
    handleAddEvent,
    handleStatusChange,
  } = useEvent();

  const { fetchAllUsers, users } = useHr();
  const { fetchAllContacts, contacts } = useContact();

  useEffect(() => {
    fetchAllEvents();
    fetchAllUsers();
    fetchAllContacts();
  }, [fetchAllEvents, fetchAllUsers, fetchAllContacts]);

  const clientContacts = contacts.filter((c) => c.role === "client");

  const activeEvents = events.filter((event) => event.status !== "DONE");
  const pastEvents = events.filter((event) => event.status === "DONE");

  return (
    <div className="p-6 w-full max-w-7xl mx-auto">
      <PageHeader
        title="Events Overview"
        breadcrumbs={[{ label: "Events", href: "/events" }]}
      />

      <div className="mb-6">
        <AddEventModal
          onAddEvent={handleAddEvent}
          users={users}
          clientContacts={clientContacts}
        />
      </div>

      <div className="mb-8 p-6 border rounded-lg shadow-lg bg-green-100">
        <h2 className="text-xl font-semibold text-green-800 mb-4">
          Active Events
        </h2>

        {loading ? (
          <Skeleton className="h-24 w-full mb-4 rounded-lg bg-gray-300" />
        ) : (
          activeEvents.map((event) => (
            <EventCard
              key={event.event_id}
              event={event}
              onStatusUpdate={handleStatusChange}
              onDeleteEvent={handleDeleteEvent}
            />
          ))
        )}
      </div>

      <div className="mb-8 p-6 border rounded-lg shadow-lg bg-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Past Events
        </h2>

        {loading ? (
          <Skeleton className="h-24 w-full mb-4 rounded-lg bg-gray-300" />
        ) : (
          pastEvents.map((event) => (
            <EventCard
              key={event.event_id}
              event={event}
              onStatusUpdate={handleStatusChange}
              onDeleteEvent={handleDeleteEvent}
            />
          ))
        )}
      </div>
    </div>
  );
}
