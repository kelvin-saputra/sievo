import { responseFormat } from "@/utils/api"
import { prisma } from "@/utils/prisma"

export async function GET(req: Request) {
    try {
        const { searchParams }= new URL(req.url);
        const event_id  = searchParams.get('event_id')!;
        const is_actual = searchParams.get('is_actual');

        const existingEvent = await prisma.event.findFirst({
            where: {
                event_id: event_id,
            }
        });

        if (!existingEvent) {
            return responseFormat(400, "Event yang dilihat tidak terdaftar!", null);
        }

        const categoriesBudget = await prisma.$transaction(async (transactions) => {
            const budget = await transactions.budget.findFirst({
                where: {
                    event_id,
                    is_deleted: false,
                    is_actual: (is_actual === 'true')
                },
            });

            const categories = await prisma.budgetItemCategory.findMany({
                where: { 
                    budget: { 
                        budget_id: budget?.budget_id,
                    },
                    is_deleted: false,
                },
            })
            return {categories, budget};
        });
        const { categories, budget } = categoriesBudget;
        if (categories.length === 0) {
            return responseFormat(404, `Kategori Budget ${budget?.is_actual? "realisasi":"plan"} belum dibuat!`, null)
        }
        return responseFormat(200, `Berhasil mengambil kategori budget ${budget?.is_actual? "realisasi":"plan"}`, categories)
    } catch {
        return responseFormat(500, "Gagal mengambil kategori budget", null)
    }
}

export async function POST(req: Request) {
    try {
        const reqBody = await req.json()
        const { budget_id, category_name }  = reqBody;

        const existingBudget = await prisma.budget.findFirst({
            where: {
                budget_id: budget_id,
                is_deleted: false,
            }
        })
        if (!existingBudget) {
            return responseFormat(400, "Budget yang dicari tidak ditemukan!", null);
        }

        const existingCategory = await prisma.budgetItemCategory.findFirst({
            where: {
                budget_id: budget_id,
                category_name: category_name,
            }
        })
        
        if (existingCategory) {
            if (existingCategory.is_deleted == true) {
                const createdCategory = await prisma.$transaction(async (transactions) => {
                    const createdCategory = await transactions.budgetItemCategory.update({
                        where: {
                            category_id: existingCategory.category_id,
                            budget_id: budget_id,
                            is_deleted: true,
                        },
                        data: {
                            is_deleted: false,
                            budget_id: budget_id,
                            budget_plan_item: {},
                            actual_budget_item: {},
                        }
                    })

                    const updatedBudget = await transactions.budget.update({
                        where: { 
                            budget_id:budget_id,
                            is_deleted: false 
                        },
                        data: {
                            categories: { 
                                connect: { 
                                    category_id: createdCategory.category_id 
                                }, 
                            },
                        },
                    });
                    if (!createdCategory || !updatedBudget) {
                        return null;
                    }
                    return createdCategory
                    
                })
                if (!createdCategory) {
                    return responseFormat(400, `Gagal membuat kategori ${category_name}, input tidak sesuai!`, null)
                }
                return responseFormat(200, `Kategori ${category_name} berhasil dibuat!`, createdCategory)
            } else {
                return responseFormat(400, `Kategori ${category_name} sudah dibuat untuk budget ini!`, null)
            }
        }

        const category = await prisma.$transaction(async (transactions) => {
            const createdCategory = await transactions.budgetItemCategory.create({
                data: {
                    category_name,
                    budget: { 
                        connect: { 
                            budget_id 
                        } 
                    },
                },
            });

            const updatedBudget = await transactions.budget.update({
                where: { 
                    budget_id:budget_id,
                    is_deleted: false 
                },
                data: {
                    categories: { 
                        connect: { 
                            category_id: createdCategory.category_id 
                        }, 
                    },
                },
            });

            if (!createdCategory || !updatedBudget) {
                return null;
            }
            return createdCategory;
        });

        if (!category) {
            return responseFormat(400, `Gagal membuat kategori ${category_name}, input tidak sesuai!`, null)
        }

        return responseFormat(200, `Kategori ${category_name} berhasil dibuat!`, category)
    }catch {
        return responseFormat(500, "Gagal saat membuat kategori budget!", null)
    }
}

export async function PUT(req: Request) {
    try {
        const reqBody = await req.json()
        const { category_id, ...data } = reqBody;

        const existingCategory = await prisma.budgetItemCategory.findFirst({
            where: { 
                category_id: category_id, 
                is_deleted: false 
            }
        })

        if (!existingCategory) {
            return responseFormat(400, `Kategori yang dicari tidak ditemukan!`, null)
        }

        const category = await prisma.budgetItemCategory.update({
            where: { 
                category_id: category_id, 
                is_deleted: false 
            },
            data: { 
                ...data,
            },
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
            return responseFormat(400, "ID Kategori tidak ditemukan!", null)
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

            const deletedBudgetItemCategory = await transactions.budgetItemCategory.update({
                where: { category_id: category_id, budget_id: budget_id },
                data: { 
                    ...data,
                    is_deleted:true,
                }
            })
            return deletedBudgetItemCategory;
        })

        if (categoryDeleted === null) {
            return responseFormat(400, "Kategori budget tidak bisa dihapus, terdapat budget pada kategori!", null)
        }
        return responseFormat(200, "Berhasil menghapus kategori budget!", categoryDeleted)
    } catch {
        return responseFormat(500, "Gagal menghapus kategori budget!", null)
    }
}