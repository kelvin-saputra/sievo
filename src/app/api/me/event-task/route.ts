import { getUserDataServer } from "@/lib/userData";
import { EventStatusEnum, TaskStatusEnum } from "@/models/enums";
import { responseFormat } from "@/utils/api";
import { prisma } from "@/utils/prisma";
import { NextRequest } from "next/server";

export async function GET(req:NextRequest) {
    try {
        const userData = await getUserDataServer(req);

        if (!userData) {
            return responseFormat(401, "User unauthorized!", null);
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                id: userData.id
            }
        })

        if (!existingUser) {
            return responseFormat(404, "Pengguna tidak ditemukan!", null);
        }
        let userHomepage;
        if (existingUser.role === "ADMIN" || existingUser.role === "EXECUTIVE") {
            userHomepage = await prisma.user.findFirst({
                where: {
                    id: userData.id
                },
                include: {
                    _count: {
                        select: {
                            task: {
                                where: {
                                    status: {
                                        in: [
                                            TaskStatusEnum.Enum.ON_PROGRESS, TaskStatusEnum.enum.PENDING
                                        ]
                                    }
                                }
                            },
                            event: {
                                where: {
                                    manager_id: existingUser.id
                                }
                            }
                        }
                    },
                    event: {
                        where: {
                            status: {
                                not: EventStatusEnum.Enum.DONE
                            }
                        }
                    }
                }
            })
            const allContact = await prisma.contact.count({
                where: {
                    is_deleted: false,
                }
            })

            const userEvent = await prisma.event.findMany({
                where: {
                    status: {
                        not: EventStatusEnum.Enum.DONE
                    }
                },
            })
            if (userHomepage) {
                const result = {
                    ...userHomepage,
                    event: userEvent,
                    contact: allContact
                };
                userHomepage = result;
            }
        } else {
            userHomepage = await prisma.user.findFirst({
                where: {
                    id: userData.id
                },
                include: {
                    _count: {
                        select: {
                            task: {
                                where: {
                                    status: {
                                        in: [
                                            TaskStatusEnum.Enum.ON_PROGRESS, TaskStatusEnum.enum.PENDING
                                        ]
                                    }
                                }
                            },
                            event: {
                                where: {
                                    manager_id: existingUser.id
                                }
                            }
                        }
                    },
                    event: {
                        where: {
                            status: {
                                not: EventStatusEnum.Enum.DONE
                            }
                        }
                    }
                }
            })

        }

        if(!userHomepage) {
            return responseFormat(404, "Pengguna tidak ditemukan!", null);
        }
        return responseFormat(200, "Pengguna berhasil didapatkan!", userHomepage);
    } catch {
        return responseFormat(500, "Terjadi kesalahan saat mengambil data", null);
    }

    
}