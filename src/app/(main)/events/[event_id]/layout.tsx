"use client";

import { useEffect, useMemo, useCallback, useState } from "react";
import { useParams } from "next/navigation";
import PageHeader from "@/components/common/page-header";
import NavigationTabs from "@/components/events/navigation-tabs";
import { Button } from "@/components/ui/button";
import EventContext from "@/models/context/event.context";
import EventDetailSkeleton from "@/components/events/event-detail-skeleton";
import { UpdateEventForm } from "@/components/events/form/update-event-form";
import { Trash } from "lucide-react";

import useEvent from "@/hooks/use-event";
import useEventTask from "@/hooks/use-event-task";
import useBudgetPlan from "@/hooks/use-budget-plan";
import useActualBudget from "@/hooks/use-budget-actual";
import useCategory from "@/hooks/use-category";
import usePurchasing from "@/hooks/use-purchase";
import useVendorService from "@/hooks/use-vendor-service";
import useInventory from "@/hooks/use-inventory";
import useHr from "@/hooks/use-hr";
import useContact from "@/hooks/use-contact";
import { getUserRoleFromStorage } from "@/utils/authUtils";

export default function EventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { event_id } = useParams();
  const [userRole, setUserRole] = useState<string | null>(null);

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
    budgetPlan,
    budgetPlanItems,
    loading: budgetPlanLoading,
    fetchBudgetPlan,
    fetchAllBudgetPlanItems,
    handleAddBudgetPlanItem,
    handleUpdateBudgetPlanItem,
    handleDeleteBudgetPlanItem,
  } = useBudgetPlan(event_id as string);

  const {
    actualBudget,
    actualBudgetItems,
    loading: actualBudgetLoading,
    fetchActualBudget,
    fetchAllActualBudgetItems,
    handleAddActualBudgetItem,
    handleUpdateActualBudgetItem,
    handleDeleteActualBudgetItem,
    handleImportBudgetData,
  } = useActualBudget(event_id as string);

  const {
    categoriesPlan,
    actualCategories,
    loading: budgetCategoriesLoadingPlan,
    fetchCategoriesByBudgetIdPlan,
    fetchCategoriesByActualBudgetId,
    handleAddCategory,
    handleUpdateCategory,
    handleDeleteCategory,
  } = useCategory(
    event_id as string,
    budgetPlan?.budget_id as string,
    actualBudget?.budget_id as string
  );

  const { handleAddPurchase, handleUpdatePurchase, handleDeletePurchase } =
    usePurchasing();
  const { vendorServices, fetchAllVendorServices } = useVendorService();
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
      fetchBudgetPlan();
      fetchActualBudget();
      fetchAllBudgetPlanItems();
      fetchAllActualBudgetItems();
      fetchCategoriesByBudgetIdPlan();
      fetchCategoriesByActualBudgetId();
      fetchAllVendorServices();
      fetchAllInventories();
    }
  }, [
    event_id,
    fetchEventById,
    fetchAllTasks,
    fetchBudgetPlan,
    fetchActualBudget,
    fetchAllBudgetPlanItems,
    fetchAllActualBudgetItems,
    fetchCategoriesByBudgetIdPlan,
    fetchCategoriesByActualBudgetId,
    fetchAllVendorServices,
    fetchAllInventories,
  ]);

  useEffect(() => {
    refetchAll();
    setUserRole(getUserRoleFromStorage());
  }, [refetchAll]);

  useEffect(() => {
    fetchAllUsers();
    fetchAllContacts();
  }, [fetchAllUsers, fetchAllContacts]);

  if (
    eventLoading ||
    budgetPlanLoading ||
    budgetCategoriesLoadingPlan ||
    taskLoading
  ) {
    return <EventDetailSkeleton />;
  }

  if (!event) {
    return <p className="text-red-500 text-lg">Event not found.</p>;
  }
  if (!tasks) {
    return <p className="text-red-500 text-lg">Task not found.</p>;
  }

  return (
    <EventContext.Provider
      value={{
        event,
        client,
        users,
        manager,
        tasks,
        budgetPlan,
        actualBudget,
        budgetPlanItems,
        actualBudgetItems,
        categoriesPlan,
        actualCategories,
        inventories,
        vendorServices,
        loading:
          eventLoading ||
          taskLoading ||
          budgetPlanLoading ||
          budgetCategoriesLoadingPlan ||
          actualBudgetLoading,
        handleUpdateEvent,
        handleDeleteEvent,
        handleStatusChange,
        fetchAllTasks,
        fetchTaskById,
        handleUpdateTask,
        handleDeleteTask,
        handleAddTask,
        fetchBudgetPlan,
        fetchAllBudgetPlanItems,
        handleAddBudgetPlanItem,
        handleDeleteBudgetPlanItem,
        handleUpdateBudgetPlanItem,
        fetchActualBudget,
        fetchAllActualBudgetItems,
        handleAddActualBudgetItem,
        handleDeleteActualBudgetItem,
        handleUpdateActualBudgetItem,
        handleImportBudgetData,
        fetchCategoriesByBudgetIdPlan,
        fetchCategoriesByActualBudgetId,
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
      <div className="p-6 max-w-4xl mx-auto">
        <PageHeader
          title={event.event_name}
          breadcrumbs={[
            { label: "Events", href: "/events" },
            { label: "Event Overview" },
          ]}
        />
        <div className="flex items-center justify-between border-b -mt-2 mb-4 pb-2">
          <NavigationTabs eventStatus={event.status} />
        </div>
        <div className="flex gap-2 px-6 justify-end">
          {["ADMIN", "EXECUTIVE"].includes(userRole || "") && (
            <UpdateEventForm
              event={event}
              createdBy={event.created_by}
              onUpdateEvent={handleUpdateEvent}
              users={users}
              clientContacts={clientContacts}
            />
          )}

          {["ADMIN", "EXECUTIVE"].includes(userRole || "") && (
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
