import { SupplierModel } from "@/Models/SupplierModels/SupplierModel";

export const DeleteSuppliersAsync = async (data: Set<SupplierModel>) => {
  const productArray = Array.from(data);

  if (productArray.length > 0) {

    try {
      const ids = productArray.map((product) => product.id);
      
      const response = await fetch("http://localhost:5004/api/Supplier", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ids),
      });

      if (response.ok) {
        alert("Удалени произошло успешно");
      } else {
        console.error("Error deleting suppliers:", response.statusText);
      }
    } catch (error) {
        console.error("Error deleting supplier:", error);
    }
  } else {
    console.log("No products available.");
  }
};
