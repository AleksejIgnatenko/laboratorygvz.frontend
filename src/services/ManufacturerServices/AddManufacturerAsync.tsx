import { ManufacturerErrorMapper } from "@/Mappers/ManufacturerMapper/ManufacturerErrorMapper";
import { AddManufacturerModel } from "@/Models/ManufacturerModels/AddManufacturerModel";

export const AddManufacturerAsync = async (manufacturer: AddManufacturerModel) => {
  try {
    const response = await fetch("http://localhost:5002/api/Manufacturer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(manufacturer),
    });

    if (response.ok) {
      return [`${manufacturer.manufacturerName} добавлен`, 200];
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
    console.error("Error adding manufacturer:", error);
  }
  return ["Не получилось добавить производителя", null];
};
