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
    // await DeleteSuppliersAsync(selectedItems);
    // const { suppliers, countItemsAll } = await GetSuppliersForPageAsync(numberPage);
    // setData(suppliers);
    // setCount(countItemsAll);
    console.log(selectedItems)
  };

  const suppliers: SupplierModel[] = [
    {
      id: 1,
      Name: "Supplier 1",
      Manufacturer: "Manufacturer A"
    },
    {
      id: 2,
      Name: "Supplier 2",
      Manufacturer: "Manufacturer B"
    },
    {
      id: 3,
      Name: "Supplier 3",
      Manufacturer: "Manufacturer C"
    },
    // Добавьте другие поставщики по аналогии
  ];

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
        data={suppliers}
        tableName="Suppliers"
        countItemsAll={countItemsAll}
        handleDelete={handleDelete}
      />
    </div>
  );
}
