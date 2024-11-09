import { ManufacturerErrorMapper } from "@/Mappers/ManufacturerMapper/ManufacturerErrorMapper";
import { ManufacturerModel } from "@/Models/ManufacturerModels/ManufacturerModel";
import { getCookie } from "../Infrastructure/getCookie";

export const UpdateManufacturerAsync = async (manufacturer: ManufacturerModel) => {
  try {

    const jwtToken = getCookie("jwtToken");

    const response = await fetch(
      `http://localhost:5002/api/Manufacturer/${manufacturer.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwtToken}`,
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
      return [errors.error, 409];
    }
  } catch (error) {
    console.error("Error update manufacturer:", error);
  }
  return ["Не получилось обновить производитлея", null];
};
