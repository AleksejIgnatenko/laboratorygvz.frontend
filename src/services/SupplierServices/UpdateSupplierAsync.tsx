import { SupplierErrorMapper } from "@/Mappers/SupplierMappers/SupplierErrorMapper";
import { UpdateSupplierModel } from "@/Models/SupplierModels/UpdateSupplierModel";
import { getCookie } from "../Infrastructure/getCookie";

export const UpdateSupplierAsync = async (supplier: UpdateSupplierModel) => {
  try {
    const jwtToken = getCookie("jwtToken");

    const response = await fetch(
      `http://localhost:5004/api/Supplier/${supplier.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(supplier),
      }
    );

    if (response.ok) {
      return ["Поставщик обновлен", 200];
    } else if (response.status === 400) {
      const errors = await response.json();

      const mappedErrors = SupplierErrorMapper(errors.error);

      return [mappedErrors, 400];
    } else if (response.status === 409) {
      const errors = await response.json();
      return [errors.error, 409];
    }
  } catch (error) {
    console.error("Error update supplier:", error);
  }
  return ["Не получилось обновить поставщика", null];
};
