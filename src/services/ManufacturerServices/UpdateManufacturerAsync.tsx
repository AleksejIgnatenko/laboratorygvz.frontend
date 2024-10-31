import { ManufacturerErrorMapper } from "@/Mappers/ManufacturerMapper/ManufacturerErrorMapper";
import { ManufacturerModel } from "@/Models/ManufacturerModels/ManufacturerModel";

export const UpdateManufacturerAsync = async (manufacturer: ManufacturerModel) => {
  try {
    const response = await fetch(
      `http://localhost:5002/api/Manufacturer/${manufacturer.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(manufacturer),
      }
    );

    if (response.ok) {
      return ["Производитель обновлен", 200];
    } else if (response.status === 400) {
      const errors = await response.json();

      const mappedErrors = ManufacturerErrorMapper(errors.error);

      return [mappedErrors, 400];
    } else if (response.status === 409) {
      const errors = await response.json();
      console.log(errors.error);
      return [errors.error, 409];
    }
  } catch (error) {
    console.error("Error adding supplier:", error);
  }
  return ["Не получилось добавить поставщика", null];
};
