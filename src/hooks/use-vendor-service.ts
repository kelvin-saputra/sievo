import { VendorServiceSchema } from "@/models/schemas";
import axios from "axios";
import { useCallback, useState } from "react";
import { toast } from "sonner";


const VENDOR_API = process.env.NEXT_PUBLIC_VENDOR_SERVICE_API_URL!;

export default function useVendorService() {
    const [vendorServices, setVendorServices] = useState<VendorServiceSchema[]>([]);

    const fetchAllVendorServices = useCallback(async () => {
        try {
            const { data: rawVendorServices } = await axios.get(`${VENDOR_API}`);

            const validatedVendorServices = rawVendorServices.data.map((vendorService: any) => VendorServiceSchema.parse(vendorService));
            setVendorServices(validatedVendorServices);
        } catch {
            toast.error("Gagal mengambil data vendor services");
        }
    }, []);

    return {
        vendorServices,
        fetchAllVendorServices,
    }
}