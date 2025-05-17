import { AddVendorServiceDTO, UpdateVendorServiceDTO } from "@/models/dto";
import { VendorWithService } from "@/models/response/vendor-with-service";
import axios from "axios";
import { useCallback, useState } from "react";
import { toast } from "sonner";

const VENDOR_SERVICE_API = process.env.NEXT_PUBLIC_VENDOR_SERVICE_API_URL!;

export default function useVendor(vendor_id:string) {
    const [vendorServices, setVendorServices] = useState<VendorWithService[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchAllVendorServices = useCallback(async () => {
        setLoading(true);
        try {
            const { data: rawVendorServices } = await axios.get(`${VENDOR_SERVICE_API}`, {params: {vendor:vendor_id}});
            
            const validatedVendorServices = rawVendorServices.data.map((vendorService: any) => VendorWithService.parse(vendorService));
            setVendorServices(validatedVendorServices);
        } finally {
            setLoading(false);
        }
    }, [vendor_id]);

    const handleAddVendorService = useCallback(async (data:AddVendorServiceDTO) => {
        setLoading(true);
        try {
            const requestData = {
                ...data
            };
            await axios.post(`${VENDOR_SERVICE_API}`, requestData);
            fetchAllVendorServices();
            toast.success("Berhasil menambahkan vendor service!");
        } catch {
            toast.error("Gagal menambahkan vendor service!")
        } finally {
            setLoading(false);
        }
    }, [fetchAllVendorServices])

    const handleUpdateVendorService = useCallback(async (data:UpdateVendorServiceDTO) => {
        setLoading(true);
        try {
            const requestData = {
                ...data,
            };

            await axios.put(`${VENDOR_SERVICE_API}`, requestData);
            fetchAllVendorServices();
            toast.success("Berhasil mengubah kategori budget.");
        } catch {
            toast.error("Gagal mengubah kategori budget.");
        } finally {
            setLoading(false);
        }
    }, [fetchAllVendorServices])

    const handleDeleteVendorService = useCallback(async (serviceId: string)=> {
        setLoading(true);
        try {
            const requestData = {
                service_id: serviceId,
            };

            await axios.delete(`${VENDOR_SERVICE_API}`, {data:requestData});
            fetchAllVendorServices()
            toast.success("Berhasil menghapus vendor service!");
        } catch {
            toast.error("Gagal menghapus vendor service!")
        } finally {
            setLoading(false);
        }
    }, [fetchAllVendorServices])

    return {
        vendorServices,
        loading,
        fetchAllVendorServices,
        handleAddVendorService,
        handleUpdateVendorService,
        handleDeleteVendorService
    }
}