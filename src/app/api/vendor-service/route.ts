import { prisma } from "@/utils/prisma";
import { responseFormat } from "@/utils/api";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const vendor = searchParams.get("vendor");
        let vendorServices;
        if (!vendor) {
            vendorServices = await prisma.vendor.findMany({
                where: { 
                    is_deleted: false 
                },
                include: {
                    vendor_service: {
                       where: {
                        is_deleted: false
                       } 
                    }, 
                    contact: true,
                }
            });
        } else {
            vendorServices = await prisma.vendor.findMany({
                where: { 
                    is_deleted: false,
                    vendor_id: vendor,
                },
                include: {
                    vendor_service: {
                        where: {
                            is_deleted: true,
                        },
                    },
                    contact: true,
                }
            });
        }
        
        return responseFormat(200, "Berhasil mengambil layanan vendor pada database", vendorServices);
    } catch {
        return responseFormat(500, "Terjadi kesalahan saat mengambil layanan vendor", null);
    }
}

export async function POST(req: NextRequest) {
    try {
        const reqBody = await req.json();
        const {...data} = reqBody;
        
        const existingServices = await prisma.vendorService.findFirst({
            where: {
                vendor_id: data.vendor_id,
                service_name: data.service_name,
            }
        })

        if (existingServices) {
            return responseFormat(400, "Vendor service saat ini sudah terdaftar!", null);
        }
             
        const newVendorService = await prisma.vendorService.create({
            data: {
                ...data
            }
        })

        if (!newVendorService) {
            return responseFormat(400, "Data vendor service baru tidak valid!", null);
        }
        return responseFormat(201, "Vendor service berhasil dibuat!", newVendorService);
    } catch {
        return responseFormat(500, "Terjadi kesalahan saat membuat vendor service!", null)
    }
}

export async function PUT(req: NextRequest){
    try {
        const reqBody = await req.json();
        const {service_id, ...data} = reqBody
        console.log(service_id)
        if (!service_id) {
            return responseFormat(400, "Vendor Service tidak ditemukan!", null)
        }

        const updatedVendorService = await prisma.vendorService.update({
            where : {
                service_id: service_id,
            },
            data: {
                ...data,
            }
        })

        if (!updatedVendorService) {
            return responseFormat(400, "Data update inventory tidak sesuai!", null);
        }

        return responseFormat(200, "Berhasil update data vendor service!", updatedVendorService);
    } catch {
        return responseFormat(500, "Terjadi kesalahan saat melakukan update vendor service!", null);
    }
}

export async function DELETE(req:NextRequest) {
    const { service_id } = await req.json();
    try {
        const deletedVendorService = await prisma.vendorService.update({
            where: {
                service_id: service_id,
            },
            data: {
                is_deleted: true,
            }
        })

        if (!deletedVendorService) {
            return responseFormat(404, "Vendor service tidak ditemukan!", null);
        }

        return responseFormat(200, "Vendor service berhasil dihapus!", null);
    } catch {
        return responseFormat(500, "Terjadi kesalahan saat menghapus vendor service!", null);
    }
}