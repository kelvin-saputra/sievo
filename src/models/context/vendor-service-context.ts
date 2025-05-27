import { createContext } from "react";
import { VendorWithService } from "../response/vendor-with-service";
import { AddVendorServiceDTO, UpdateVendorServiceDTO } from "../dto";


interface VendorServiceContextType {  
    loading: boolean;
    vendorServices: VendorWithService[];

    fetchAllVendorServices: () => Promise<void>;
    handleAddVendorService: (data: AddVendorServiceDTO) => Promise<void>;
    handleUpdateVendorService: (data: UpdateVendorServiceDTO) => Promise<void>;
    handleDeleteVendorService: (vendorId: string) => Promise<void>
}
  
  const VendorServiceContext = createContext<VendorServiceContextType | null>(null);
  
  export default VendorServiceContext;