import { SupplierErrorMapper } from "@/Mappers/SupplierMappers/SupplierErrorMapper";
import { SupplierModel } from "@/Models/SupplierModels/SupplierModel";

export const UpdateSupplierAsync = async (supplier: SupplierModel) => {
  try {
    console.log(supplier);
    const response = await fetch(
      `http://localhost:5004/api/Supplier/${supplier.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
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
      console.log(errors.error);
      return [errors.error, 409];
    }
  } catch (error) {
    console.error("Error adding supplier:", error);
  }
  return ["Не получилось добавить поставщика", null];
};
