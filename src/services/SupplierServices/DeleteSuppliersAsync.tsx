import { SupplierModel } from "@/Models/SupplierModels/SupplierModel";

export const DeleteSuppliersAsync = async (data: Set<SupplierModel>) => {
  const supplierArray = Array.from(data);

  if (supplierArray.length > 0) {
    try {
      const ids = supplierArray.map((supplier) => supplier.id);

      const response = await fetch("http://localhost:5004/api/Supplier", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ids),
      });

      if (!response.ok) {
        alert("При удалении возникла ошибка");
        console.error("Error deleting suppliers:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting supplier:", error);
    }
  } else {
    console.log("No products available.");
  }
};
