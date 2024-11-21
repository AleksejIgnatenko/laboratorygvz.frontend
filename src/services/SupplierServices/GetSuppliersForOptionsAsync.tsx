import { SupplierModelOption } from "@/Models/SupplierModels/SupplierModelOption";

export const GetSuppliersForOptionsAsync = async (): Promise<SupplierModelOption[]> => {
  try {
    const response = await fetch(
      "http://localhost:5004/api/Supplier/getSuppliersForOptions",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
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
