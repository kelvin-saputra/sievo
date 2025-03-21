import { responseFormat } from "@/utils/api"
import { prisma } from "@/utils/prisma"

export async function GET(req: Request) {
    try {
        const { searchParams }= new URL(req.url);
        const event_id  = searchParams.get('event_id');
        const is_actual = searchParams.get('is_actual');
        if (!event_id) {
            return responseFormat(400, "Budget ID tidak ditemukan", null);
        }

        const categories = await prisma.$transaction(async (transactions) => {
            const budget = await transactions.budget.findFirst({
                where: {
                    event_id,
                    is_deleted: false,
                    is_actual: (is_actual === 'true')
                },
            });

            const categories = await prisma.budgetItemCategory.findMany({
                where: { 
                    budget: { some: { budget_id: budget?.budget_id } },
                    is_deleted: false,
                },
            })
            console.log("Categories", categories)
            console.log("Budget", budget)
            return categories;
        });

        if (categories.length === 0) {
            return responseFormat(404, "Kategori Budget untuk event belum dibuat", null)
        }
        return responseFormat(200, "Berhasil mengambil kategori budget", categories)
    } catch (error) {
        console.log(error instanceof Error ? error.message : error);
        return responseFormat(500, "Gagal mengambil kategori budget", null)
    }
}

export async function POST(req: Request) {
    try {
        const reqBody = await req.json()
        const { budget_id, ...data }  = reqBody;

        if (!budget_id) {
            return responseFormat(400, "Budget ID tidak ditemukan", null);
        }

        const category = await prisma.$transaction(async (transactions) => {
            const createdCategory = await transactions.budgetItemCategory.create({
                data: {
                    ...data,
                    budget: { connect: { budget_id } },
                },
            });

            const updatedBudget = await transactions.budget.update({
                where: { budget_id:budget_id, is_deleted: false },
                data: {
                    categories: { connect: { category_id: createdCategory.category_id } },
                },
            });

            if (!createdCategory || !updatedBudget) {
                return null;
            }
            return createdCategory;
        });

        if (!category) {
            return responseFormat(400, "Gagal membuat kategori, Input tidak sesuai", null)
        }

        return responseFormat(201, "Berhasil membuat kategori budget", category)
    }catch {
        return responseFormat(500, "Gagal membuat kategori budget", null)
    }
}

export async function PUT(req: Request) {
    try {
        const reqBody = await req.json()
        const { category_id, ...data } = reqBody;

        if (!category_id) {
            return responseFormat(400, "Category ID tidak ditemukan", null)
        }

        const category = await prisma.budgetItemCategory.update({
            where: { category_id: category_id, is_deleted: false },
            data: { ...data },
        })

        return responseFormat(200, "Berhasil mengubah kategori budget", category)
    } catch {
        return responseFormat(500, "Gagal mengubah kategori budget", null)
    }
}

export async function DELETE(req: Request) {
    try {
        const reqBody = await req.json()
        const {category_id, budget_id, ...data} = reqBody;

        if (!category_id) {
            return responseFormat(400, "Category ID tidak ditemukan", null)
        }

        const categoryDeleted = await prisma.$transaction(async (transactions) => {
            const actualBudgetItems = await transactions.actualBudgetItem.findMany({
                where: { category_id: category_id, is_deleted: false },
            })

            const budgetPlanItems = await transactions.budgetPlanItem.findMany({
                where: { category_id: category_id, is_deleted: false },
            })

            if (actualBudgetItems.length > 0 || budgetPlanItems.length > 0) {
                return null;
            }

            await transactions.budget.update({
                where: { budget_id:budget_id, is_deleted: false },
                data: {
                    categories: {
                        disconnect: { category_id: category_id }
                    }
                }
            })
            const budgetIdList = await transactions.budget.findMany({
                where: { 
                    is_deleted: false,
                    categories: { some: { category_id:category_id } } 
                }
            })

            console.log("Budget ID List pada API DELETE Category", budgetIdList)

            const budgetItemCategory = await transactions.budgetItemCategory.findFirst({
                where: { category_id: category_id }
            })

            if (budgetIdList.length === 0) {
                await transactions.budgetItemCategory.update({
                    where: { category_id: category_id },
                    data: { ...data }
                })
            }
            return budgetItemCategory;
        })

        if (categoryDeleted === null) {
            return responseFormat(400, "Kategori budget tidak bisa dihapus karena masih memiliki item terkait", null)
        }
        return responseFormat(200, "Berhasil menghapus kategori budget", categoryDeleted)
    } catch {
        return responseFormat(500, "Gagal menghapus kategori budget", null)
    }
}