-- CreateEnum
CREATE TYPE "ROLE" AS ENUM ('EXECUTIVE', 'INTERNAL', 'FREELANCE', 'ADMIN');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'ON_PROGRESS', 'DONE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "BudgetItemStatus" AS ENUM ('PENDING', 'DONE', 'CANCELED');

-- CreateEnum
CREATE TYPE "BudgetStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('PLANNING', 'BUDGETING', 'PREPARATION', 'IMPLEMENTATION', 'REPORTING', 'DONE');

-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('DRAFT', 'ON_REVIEW', 'APPROVED', 'REJECTED', 'ON_CONTACT', 'ACCEPTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "InventoryCategory" AS ENUM ('CONSUMABLE', 'NON_CONSUMABLE');

-- CreateEnum
CREATE TYPE "VendorServiceCategory" AS ENUM ('FOOD_AND_BEVERAGES', 'DECORATION', 'DOCUMENTATION', 'ACCOMODATION', 'ENTERTAINMENT', 'TRANSPORTATION', 'OTHERS');

-- CreateEnum
CREATE TYPE "ClientType" AS ENUM ('INDIVIDUAL', 'ORGANIZATION');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "ROLE" NOT NULL DEFAULT 'FREELANCE',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inventory" (
    "inventory_id" TEXT NOT NULL,
    "item_name" TEXT NOT NULL,
    "item_qty" INTEGER NOT NULL DEFAULT 0,
    "item_qty_damaged" INTEGER NOT NULL DEFAULT 0,
    "item_qty_reserved" INTEGER NOT NULL DEFAULT 0,
    "item_price" DOUBLE PRECISION NOT NULL,
    "inventory_photo" TEXT[],
    "category" "InventoryCategory" NOT NULL DEFAULT 'CONSUMABLE',
    "is_avail" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("inventory_id")
);

-- CreateTable
CREATE TABLE "InventoryLog" (
    "inventory_log_id" TEXT NOT NULL,
    "updated_by" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "action" TEXT NOT NULL,
    "inventory_id" TEXT NOT NULL,

    CONSTRAINT "InventoryLog_pkey" PRIMARY KEY ("inventory_log_id")
);

-- CreateTable
CREATE TABLE "Task" (
    "task_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "assigned_id" TEXT,
    "due_date" TIMESTAMP(3),
    "status" "TaskStatus" NOT NULL DEFAULT 'PENDING',
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "event_id" TEXT NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("task_id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "contact_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "description" TEXT,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("contact_id")
);

-- CreateTable
CREATE TABLE "Vendor" (
    "vendor_id" TEXT NOT NULL,
    "contact_id" TEXT NOT NULL,
    "rating" DOUBLE PRECISION DEFAULT 0,
    "bankAccountDetail" TEXT NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("vendor_id")
);

-- CreateTable
CREATE TABLE "VendorService" (
    "service_id" TEXT NOT NULL,
    "service_name" TEXT NOT NULL,
    "category" "VendorServiceCategory" NOT NULL DEFAULT 'OTHERS',
    "price" DOUBLE PRECISION NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "vendor_id" TEXT NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "VendorService_pkey" PRIMARY KEY ("service_id")
);

-- CreateTable
CREATE TABLE "Client" (
    "client_id" TEXT NOT NULL,
    "contact_id" TEXT NOT NULL,
    "type" "ClientType" NOT NULL DEFAULT 'INDIVIDUAL',
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("client_id")
);

-- CreateTable
CREATE TABLE "Budget" (
    "budget_id" TEXT NOT NULL,
    "status" "BudgetStatus" NOT NULL DEFAULT 'PENDING',
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "event_id" TEXT NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "is_actual" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Budget_pkey" PRIMARY KEY ("budget_id")
);

-- CreateTable
CREATE TABLE "BudgetPlanItem" (
    "budget_item_id" TEXT NOT NULL,
    "item_qty" INTEGER NOT NULL,
    "item_subtotal" DOUBLE PRECISION NOT NULL,
    "category_id" INTEGER NOT NULL,
    "budget_id" TEXT,
    "vendor_service_id" TEXT,
    "inventory_id" TEXT,
    "other_item_id" TEXT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "BudgetPlanItem_pkey" PRIMARY KEY ("budget_item_id")
);

-- CreateTable
CREATE TABLE "ActualBudgetItem" (
    "actual_budget_item_id" TEXT NOT NULL,
    "item_qty" INTEGER NOT NULL,
    "item_subtotal" DOUBLE PRECISION NOT NULL,
    "category_id" INTEGER NOT NULL,
    "notes" TEXT,
    "invoice_photo" TEXT[],
    "status" "BudgetItemStatus" NOT NULL DEFAULT 'PENDING',
    "budget_id" TEXT,
    "vendor_service_id" TEXT,
    "inventory_id" TEXT,
    "other_item_id" TEXT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ActualBudgetItem_pkey" PRIMARY KEY ("actual_budget_item_id")
);

-- CreateTable
CREATE TABLE "BudgetItemCategory" (
    "category_id" SERIAL NOT NULL,
    "category_name" TEXT NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "BudgetItemCategory_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "Purchasing" (
    "other_item_id" TEXT NOT NULL,
    "item_name" TEXT NOT NULL,
    "item_price" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Purchasing_pkey" PRIMARY KEY ("other_item_id")
);

-- CreateTable
CREATE TABLE "Proposal" (
    "proposal_id" TEXT NOT NULL,
    "proposal_name" TEXT NOT NULL,
    "proposal_link" TEXT NOT NULL,
    "status" "ProposalStatus" NOT NULL DEFAULT 'DRAFT',
    "client_name" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Proposal_pkey" PRIMARY KEY ("proposal_id")
);

-- CreateTable
CREATE TABLE "Event" (
    "event_id" TEXT NOT NULL,
    "event_name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "participant_plan" INTEGER NOT NULL,
    "status" "EventStatus" NOT NULL DEFAULT 'PLANNING',
    "manager_id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("event_id")
);

-- CreateTable
CREATE TABLE "UserEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BudgetToBudgetItemCategory" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_BudgetToBudgetItemCategory_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_contact_id_key" ON "Vendor"("contact_id");

-- CreateIndex
CREATE UNIQUE INDEX "Client_contact_id_key" ON "Client"("contact_id");

-- CreateIndex
CREATE INDEX "_BudgetToBudgetItemCategory_B_index" ON "_BudgetToBudgetItemCategory"("B");

-- AddForeignKey
ALTER TABLE "InventoryLog" ADD CONSTRAINT "InventoryLog_inventory_id_fkey" FOREIGN KEY ("inventory_id") REFERENCES "Inventory"("inventory_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assigned_id_fkey" FOREIGN KEY ("assigned_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("event_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vendor" ADD CONSTRAINT "Vendor_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "Contact"("contact_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorService" ADD CONSTRAINT "VendorService_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "Vendor"("vendor_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "Contact"("contact_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Budget" ADD CONSTRAINT "Budget_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("event_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetPlanItem" ADD CONSTRAINT "BudgetPlanItem_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "BudgetItemCategory"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetPlanItem" ADD CONSTRAINT "BudgetPlanItem_budget_id_fkey" FOREIGN KEY ("budget_id") REFERENCES "Budget"("budget_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetPlanItem" ADD CONSTRAINT "BudgetPlanItem_vendor_service_id_fkey" FOREIGN KEY ("vendor_service_id") REFERENCES "VendorService"("service_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetPlanItem" ADD CONSTRAINT "BudgetPlanItem_inventory_id_fkey" FOREIGN KEY ("inventory_id") REFERENCES "Inventory"("inventory_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetPlanItem" ADD CONSTRAINT "BudgetPlanItem_other_item_id_fkey" FOREIGN KEY ("other_item_id") REFERENCES "Purchasing"("other_item_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActualBudgetItem" ADD CONSTRAINT "ActualBudgetItem_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "BudgetItemCategory"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActualBudgetItem" ADD CONSTRAINT "ActualBudgetItem_budget_id_fkey" FOREIGN KEY ("budget_id") REFERENCES "Budget"("budget_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActualBudgetItem" ADD CONSTRAINT "ActualBudgetItem_vendor_service_id_fkey" FOREIGN KEY ("vendor_service_id") REFERENCES "VendorService"("service_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActualBudgetItem" ADD CONSTRAINT "ActualBudgetItem_inventory_id_fkey" FOREIGN KEY ("inventory_id") REFERENCES "Inventory"("inventory_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActualBudgetItem" ADD CONSTRAINT "ActualBudgetItem_other_item_id_fkey" FOREIGN KEY ("other_item_id") REFERENCES "Purchasing"("other_item_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("client_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEvent" ADD CONSTRAINT "UserEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEvent" ADD CONSTRAINT "UserEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("event_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BudgetToBudgetItemCategory" ADD CONSTRAINT "_BudgetToBudgetItemCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "Budget"("budget_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BudgetToBudgetItemCategory" ADD CONSTRAINT "_BudgetToBudgetItemCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "BudgetItemCategory"("category_id") ON DELETE CASCADE ON UPDATE CASCADE;
