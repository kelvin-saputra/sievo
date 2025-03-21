"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import PageHeader from "@/components/common/page-header";
import NavigationTabs from "@/components/events/navigation-tabs";
import { Button } from "@/components/ui/button";
<<<<<<< HEAD
import EventContext from "@/models/context/event.context";
import useEvent from "@/hooks/use-event";
import useEventTask from "@/hooks/use-event-task";
import EventDetailSkeleton from "@/components/events/event-detail-skeleton";
import { UpdateEventForm } from "@/components/form/update-event-form";
import { Trash } from "lucide-react";
import useBudgetPlan from "@/hooks/use-budget-plan";
import useCategory from "@/hooks/use-category";
import useActualBudget from "@/hooks/use-budget-actual";
import usePurchasing from "@/hooks/use-purchase";
import useVendorService from "@/hooks/use-vendor-service";
=======
import EventContext from "@/models/context/event-context";
import useEvent from "@/hooks/use-event";
import useEventTask from "@/hooks/use-event-task";
import { UpdateEventModal } from "@/components/events/update-event-modal";
import EventDetailSkeleton from "@/components/events/event-detail-skeleton";
>>>>>>> 487cdb14f8ac484c15d103509d7b4ce33afdf8bc

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

<<<<<<< HEAD
  const {
    budgetPlan,
    budgetPlanItems,
    loading: budgetPlanLoading ,
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
    // TODO: Budget Implement Param
  } = useCategory(event_id as string, budgetPlan?.budget_id as string, actualBudget?.budget_id as string);

  const {
    handleAddPurchase,
    handleUpdatePurchase,
    handleDeletePurchase,
  } = usePurchasing();

  const {
    vendorServices,  
    fetchAllVendorServices,
  } = useVendorService();

  // const {
  //   inventories,
  //   fetchInventories,
  // } = useInventory();
  
=======
>>>>>>> 487cdb14f8ac484c15d103509d7b4ce33afdf8bc
  useEffect(() => {
    if (event_id) {
      fetchEventById(event_id as string);
      fetchAllTasks();
<<<<<<< HEAD
      fetchBudgetPlan();
      fetchActualBudget();
      fetchAllBudgetPlanItems();
      fetchAllActualBudgetItems();
      fetchCategoriesByBudgetIdPlan();
      fetchCategoriesByActualBudgetId();
      fetchAllVendorServices();
      // fetchInventories();
    }
    // TODO: Add fetch for inventory
  }, [event_id, fetchActualBudget, fetchAllActualBudgetItems, fetchAllBudgetPlanItems, fetchAllTasks, fetchAllVendorServices, fetchBudgetPlan, fetchCategoriesByActualBudgetId, fetchCategoriesByBudgetIdPlan, fetchEventById, handleImportBudgetData]);

if (eventLoading|| budgetPlanLoading || budgetCategoriesLoadingPlan || taskLoading) {
=======
    }
  }, [event_id, fetchEventById, fetchAllTasks]);

  if (eventLoading || taskLoading) {
>>>>>>> 487cdb14f8ac484c15d103509d7b4ce33afdf8bc
    return <EventDetailSkeleton />;
  } else if (!event) {
    return <p className="text-red-500 text-lg">Event not found.</p>;
  } else if (!tasks) {
    return <p className="text-red-500 text-lg">Task not found.</p>;
<<<<<<< HEAD
  } 
  
=======
  }

>>>>>>> 487cdb14f8ac484c15d103509d7b4ce33afdf8bc
  return (
    <EventContext.Provider
      value={{
        event,
        tasks,
<<<<<<< HEAD
        budgetPlan,
        actualBudget,
        budgetPlanItems,
        actualBudgetItems,
        categoriesPlan,
        actualCategories,
        // inventories,
        vendorServices,
        loading: eventLoading || taskLoading || budgetPlanLoading || budgetCategoriesLoadingPlan || actualBudgetLoading,
=======
        loading: eventLoading || taskLoading,
>>>>>>> 487cdb14f8ac484c15d103509d7b4ce33afdf8bc
        handleUpdateEvent,
        handleDeleteEvent,
        handleStatusChange,
        fetchAllTasks,
        fetchTaskById,
        handleUpdateTask,
        handleDeleteTask,
        handleAddTask,
<<<<<<< HEAD
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
        // fetchAllInventories,
        fetchAllVendorServices,
        handleAddPurchase,
        handleUpdatePurchase,
        handleDeletePurchase,
=======
>>>>>>> 487cdb14f8ac484c15d103509d7b4ce33afdf8bc
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
          <NavigationTabs />
<<<<<<< HEAD
        </div>
        <div className="flex gap-2 px-6 justify-end">
          <UpdateEventForm
            event={event}
            createdBy={event.created_by}
            onUpdateEvent={handleUpdateEvent}
          />
          <Button
            variant="destructive"
            onClick={() => event && handleDeleteEvent(event.event_id)}
          >
            <Trash />
            Delete Event
          </Button>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          {children}
        </div>
      </div>
    </EventContext.Provider>
  );
}
=======
          <div className="flex gap-2">
            <UpdateEventModal
              event={event}
              createdBy={event.created_by}
              onUpdateEvent={handleUpdateEvent}
            />
            <Button
              variant="destructive"
              onClick={() => event && handleDeleteEvent(event.event_id)}
            >
              Delete Event
            </Button>
          </div>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">{children}</div>
      </div>
    </EventContext.Provider>
  );
}
>>>>>>> 487cdb14f8ac484c15d103509d7b4ce33afdf8bc
