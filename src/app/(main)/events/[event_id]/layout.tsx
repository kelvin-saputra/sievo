"use client";

import { useEffect, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import PageHeader from "@/components/common/page-header";
import NavigationTabs from "@/components/events/navigation-tabs";
import { Button } from "@/components/ui/button";
import EventContext from "@/models/context/event.context";
import { UpdateEventForm } from "@/components/events/form/update-event-form";
import { Trash } from "lucide-react";

import useEvent from "@/hooks/use-event";
import useEventTask from "@/hooks/use-event-task";
import usePurchasing from "@/hooks/use-purchase";
import useInventory from "@/hooks/use-inventory";
import useHr from "@/hooks/use-hr";
import useContact from "@/hooks/use-contact";
import useBudget from "@/hooks/use-budget";
import Loading from "@/components/ui/loading";
import useVendor from "@/hooks/use-vendor";
import { ADMINEXECUTIVE, ADMINEXECUTIVEINTERNAL, checkRoleClient } from "@/lib/rbac-client";

export default function EventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { event_id } = useParams();
  const {
    event,
    fetchEventById,
    loading: eventLoading,
    handleUpdateEvent,
    handleDeleteEvent,
    handleStatusChange,
  } = useEvent();

  const {
    tasks,
    loading: taskLoading,
    fetchAllTasks,
    fetchTaskById,
    handleUpdateTask,
    handleDeleteTask,
    handleAddTask,
  } = useEventTask(event_id as string);

  const {
    budgetPlanData,
    budgetActualData,
    loading: budgetLoading,
    fetchBudgetDataPlan,
    handleUpdateBudgetPlanStatus,
    handleAddBudgetPlanItem,
    handleUpdateBudgetPlanItem,
    handleDeleteBudgetPlanItem,
    fetchBudgetDataActual,
    handleImportBudgetData,
    handleAddActualBudgetItem,
    handleUpdateActualBudgetItem,
    handleDeleteActualBudgetItem,
    handleAddCategory,
    handleUpdateCategory,
    handleDeleteCategory
  } = useBudget(event_id as string);

  const { handleAddPurchase, handleUpdatePurchase, handleDeletePurchase } =
    usePurchasing();
  const { vendorServices, fetchAllVendorServices } = useVendor("");
  const { inventories, fetchAllInventories } = useInventory();
  const { fetchAllUsers, users } = useHr();
  const { fetchAllContacts, contacts } = useContact();

  const clientContacts = useMemo(
    () => contacts.filter((c) => c.role === "client"),
    [contacts]
  );

  const client = useMemo(() => {
    if (!event || contacts.length === 0) return null;
    return (
      contacts.find((c) =>
        c.client?.client_id
          ? c.client.client_id === event.client_id
          : c.contact_id === event.client_id
      ) || null
    );
  }, [event, contacts]);

  const manager = useMemo(() => {
    if (!event || users.length === 0) return null;
    return users.find((u) => u.id === event.manager_id) || null;
  }, [event, users]);

  const refetchAll = useCallback(() => {
    if (event_id) {
      fetchEventById(event_id as string);
      fetchAllTasks();
      fetchAllVendorServices();
      fetchAllInventories();
      fetchBudgetDataPlan();
      fetchBudgetDataActual();
    }
  }, [
    event_id,
    fetchEventById,
    fetchAllTasks,
    fetchAllVendorServices,
    fetchAllInventories,
    fetchBudgetDataPlan,
    fetchBudgetDataActual,
  ]);

  useEffect(() => {
    refetchAll();
  }, [refetchAll]);

  useEffect(() => {
    fetchAllUsers();
    fetchAllContacts();
  }, [fetchAllUsers, fetchAllContacts]);

  if ( eventLoading ) {
    return <Loading message="Fetching event data..." />
  } else if (taskLoading) {
    return <Loading message="Fetching task data..."/>
  } else if (budgetLoading) {
    return <Loading message="Fetching budget data..."/>
  }

  if (!event) {
    return (
      <div className=" max-w-2xl mx-auto my-16 p-8 bg-red-50 border border-red-300 rounded text-center">
        <h2 className="text-xl font-semibold mb-2 text-red-800">
          Event Not Found!
        </h2>
        <p className='text-red-700'>
          The event you are searching for is not available or doesn&apos;t exist. Please check the event ID or try searching again.
        </p>
      </div>
    );
  }
  return (
    <EventContext.Provider
      value={{
        event,
        client,
        users,
        manager,
        budgetPlanData,
        budgetActualData,
        tasks,
        inventories,
        vendorServices,
        loading:
          eventLoading ||
          taskLoading ||
          budgetLoading,
        handleUpdateEvent,
        handleDeleteEvent,
        handleStatusChange,
        fetchAllTasks,
        fetchTaskById,
        handleUpdateTask,
        handleDeleteTask,
        handleAddTask,
        fetchBudgetDataPlan,
        fetchBudgetDataActual,
        handleUpdateBudgetPlanStatus,
        handleAddBudgetPlanItem,
        handleDeleteBudgetPlanItem,
        handleUpdateBudgetPlanItem,
        handleAddActualBudgetItem,
        handleDeleteActualBudgetItem,
        handleUpdateActualBudgetItem,
        handleImportBudgetData,
        handleAddCategory,
        handleUpdateCategory,
        handleDeleteCategory,
        fetchAllInventories,
        fetchAllVendorServices,
        handleAddPurchase,
        handleUpdatePurchase,
        handleDeletePurchase,
        refetchAll,
      }}
    >
      <div className="p-6 w-full mx-auto">
        <PageHeader
          title={event.event_name}
          breadcrumbs={[
            { label: "Events", href: "/events" },
            { label: "Event Overview" },
          ]}
        />
        <div className="flex items-center justify-between border-b -mt-2 mb-4 pb-2">
          <NavigationTabs />
        </div>
        <div className="flex gap-2 px-6 justify-end">
          {checkRoleClient(ADMINEXECUTIVEINTERNAL) && !["DONE"].includes(event.status) && (
            <UpdateEventForm
              event={event}
              createdBy={event.created_by}
              onUpdateEvent={handleUpdateEvent}
              users={users}
              clientContacts={clientContacts}
            />
          )}

          {checkRoleClient(ADMINEXECUTIVE) && !["IMPLEMENTATION", "REPORTING", "DONE"].includes(event.status) && (
            <Button
              variant="destructive"
              onClick={() => event && handleDeleteEvent(event.event_id)}
            >
              <Trash />
              Delete Event
            </Button>
          )}
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">{children}</div>
      </div>
    </EventContext.Provider>
  );
}