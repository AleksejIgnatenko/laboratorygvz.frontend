import { SupplierModelOption } from "@/Models/SupplierModels/SupplierModelOption";
import { getCookie } from "../Infrastructure/getCookie";

export const GetSuppliersForOptionsAsync = async (): Promise<SupplierModelOption[]> => {
  try {
    const jwtToken = getCookie("jwtToken");

    const response = await fetch(
      "http://localhost:5004/api/Supplier/getSuppliersForOptions",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwtToken}`,
        },
      }
    );

    if (response.ok) {
      const responseData = await response.json();
      const suppliers: SupplierModelOption[] = responseData;
      return suppliers;
    } else {
      console.error("Failed to fetch suppliers:", response.status);
    }
  } catch (error) {
    console.error("Error fetching:", error);
  }
  return [];
};
