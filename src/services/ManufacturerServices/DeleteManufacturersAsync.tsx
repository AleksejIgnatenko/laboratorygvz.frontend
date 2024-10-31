import { ManufacturerModel } from "@/Models/ManufacturerModels/ManufacturerModel";

export const DeleteManufacturersAsync = async (data: Set<ManufacturerModel>) => {
  const manufacturerArray = Array.from(data);

  if (manufacturerArray.length > 0) {
    try {
      const ids = manufacturerArray.map((manufacturer) => manufacturer.id);

      const response = await fetch("http://localhost:5002/api/Manufacturer", {
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
