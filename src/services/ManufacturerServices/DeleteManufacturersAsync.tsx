import { ManufacturerModel } from "@/Models/ManufactureModels/ManufacturerModel";

export const DeleteManufacturersAsync = async (data: Set<ManufacturerModel>) => {
  const productArray = Array.from(data);

  if (productArray.length > 0) {
    try {
      const ids = productArray.map((product) => product.id);

      const response = await fetch("http://localhost:5004/api/Manufacturer", {
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
