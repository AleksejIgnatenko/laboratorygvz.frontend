"use client";

import { useEffect, useState } from "react";
import { SupplierModel } from "@/Models/SupplierModels/SupplierModel";
import DataTable from "@/components/DataTableComponent/DataTable";
import { GetSuppliersForPageAsync } from "@/services/SupplierServices/GetSuppliersForPageAsync";
import { DeleteSuppliersAsync } from "@/services/SupplierServices/DeleteSuppliersAsync";

export default function Suppliers() {
  const [data, setData] = useState<SupplierModel[]>([]);
  const [countItemsAll, setCount] = useState<number>(0);

  const handleDelete = async (selectedItems: Set<SupplierModel>, numberPage: number) => {
    await DeleteSuppliersAsync(selectedItems);
    const { suppliers, countItemsAll } = await GetSuppliersForPageAsync(numberPage);
    setData(suppliers);
    setCount(countItemsAll);
  };

  // const supplierss: SupplierModel[] = [
  //   {
  //     id: "1",
  //     name: "Supplier 1",
  //     manufacturer: "Manufacturer A"
  //   },
  //   {
  //     id: "2",
  //     name: "Supplier 2",
  //     manufacturer: "Manufacturer B"
  //   },
  //   {
  //     id: "3",
  //     name: "Supplier 3",
  //     manufacturer: "Manufacturer C"
  //   },
  //   // Добавьте другие поставщики по аналогии
  // ];

  useEffect(() => {
    const getSuppliers = async () => {
      const { suppliers, countItemsAll } = await GetSuppliersForPageAsync(0);
      setData(suppliers);
      setCount(countItemsAll);
    };

    getSuppliers();
  }, []);

  return (
    <div className="suppliers-page">
      <DataTable
        data={data}
        tableName="Suppliers"
        countItemsAll={countItemsAll}
        handleDelete={handleDelete}
      />
    </div>
  );
}
