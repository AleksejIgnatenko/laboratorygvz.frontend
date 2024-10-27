import { AddSupplierModel } from "@/Models/SupplierModels/AddSupplierModel";

export const AddSupplierAsync = async (supplier: AddSupplierModel) => {
  try {
    const response = await fetch("http://localhost:5004/api/Supplier", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(supplier),
    });

    if (response.ok) {
      return ["Поставщик добавлен", 200];
    } else if (response.status === 400) {
      const errors = await response.json();
      return [errors.error, 400];
    } else if (response.status === 409) {
      const errors = await response.json();
      return [errors.error, 409];
    }
  } catch (error) {
    console.error("Error adding supplier:", error);
  }
  return ["Не получилось добавить поставщика", null];
};
