"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import EventCard from "@/components/events/event-card";
import useEvent from "@/hooks/use-event";
import useHr from "@/hooks/use-hr";
import useContact from "@/hooks/use-contact";
import { AddEventModal } from "@/components/events/form/add-event-modal";
import PageHeader from "@/components/common/page-header";
import { getUserDataClient } from "@/lib/userData";
import Loading from "@/components/ui/loading";
import { ADMINEXECUTIVEINTERNAL, checkRoleClient } from "@/lib/rbac-client";

export default function ViewAllEvents() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any | null>(null);

  const {
    events,
    loading,
    fetchAllEvents,
    handleDeleteEvent,
    handleAddEvent,
    handleStatusChange,
  } = useEvent();

  const { fetchAllUsers, fetchUserById, users } = useHr();
  const { fetchAllContacts, contacts } = useContact();

  useEffect(() => {
    const id = getUserDataClient().id || ""
    fetchAllEvents();
    fetchAllUsers();
    fetchAllContacts();

    if (id) {
      fetchUserById(id).then((user) => {
        if (user) setCurrentUser(user);
      });
    }
    setUserRole(getUserDataClient().role || "");
  }, [fetchAllEvents, fetchAllUsers, fetchAllContacts, fetchUserById]);

  const clientContacts = contacts.filter((c) => c.role === "client");

  const userEventIds =
    currentUser?.userEvents?.map((ue: any) => ue.eventId) || [];

  const activeEvents = events.filter(
    (event) =>
      event.status !== "DONE" &&
      (userRole !== "FREELANCE" || userEventIds.includes(event.event_id))
  );

  const pastEvents = events.filter(
    (event) =>
      event.status === "DONE" &&
      (userRole !== "FREELANCE" || userEventIds.includes(event.event_id))
  );

  if (loading) {
    return (<Loading message="Fetching Event Data..."/>)
  }

  return (
    <div className="p-6 w-full max-w-7xl mx-auto">
      <PageHeader
        title="Events Overview"
        breadcrumbs={[{ label: "Events", href: "/events" }]}
      />

      {userRole !== "FREELANCE" && (
        <div className="mb-6">
          <AddEventModal
            onAddEvent={handleAddEvent}
            users={users}
            clientContacts={clientContacts}
          />
        </div>
      )}

      <div className="mb-8 p-6 border rounded-lg shadow-lg bg-green-100">
        <h2 className="text-xl font-semibold text-green-800 mb-4">
          Active Events
        </h2>

        {loading ? (
          <Skeleton className="h-24 w-full mb-4 rounded-lg bg-gray-300" />
        ) : activeEvents.length > 0 ? (
          activeEvents.map((event) => (
            <EventCard
              key={event.event_id}
              event={event}
              userRole={userRole}
              onStatusUpdate={
                userRole !== "FREELANCE" ? handleStatusChange : undefined
              }
              onDeleteEvent={
                userRole !== "FREELANCE" ? handleDeleteEvent : undefined
              }
            />
          ))
        ) : (
          <p className="text-sm text-green-800 italic">
            You have no active events assigned. Please contact your
            administrator or manager to get assigned to one.
          </p>
        )}
      </div>

      <div className="mb-8 p-6 border rounded-lg shadow-lg bg-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Past Events
        </h2>

        {loading ? (
          <Skeleton className="h-24 w-full mb-4 rounded-lg bg-gray-300" />
        ) : pastEvents.length > 0 ? (
          pastEvents.map((event) => (
            <EventCard
              key={event.event_id}
              event={event}
              userRole={userRole}
              onStatusUpdate={
                checkRoleClient(ADMINEXECUTIVEINTERNAL) ? handleStatusChange : undefined
              }
              onDeleteEvent={
                checkRoleClient(ADMINEXECUTIVEINTERNAL) ? handleDeleteEvent : undefined
              }
            />
          ))
        ) : (
          <p className="text-sm text-gray-700 italic">
            You have no past events recorded. Once you complete an assigned
            event, it will appear here.
          </p>
        )}
      </div>
    </div>
  );
}
