"use client";

import { useEffect, useState } from "react";
import { SupplierModel } from "@/Models/SupplierModels/SupplierModel";
import DataTable from "@/components/DataTableComponent/DataTable";
import { GetSuppliersForPageAsync } from "@/services/SupplierServices/GetSuppliersForPageAsync";
import { DeleteSuppliersAsync } from "@/services/SupplierServices/DeleteSuppliersAsync";

export default function Suppliers() {
  const [data, setData] = useState<SupplierModel[]>([]);
  const [countItemsAll, setCount] = useState<number>(0);

  const handleDelete = async (
    selectedItems: Set<SupplierModel>,
    numberPage: number
  ) => {
    console.log(selectedItems);
    await DeleteSuppliersAsync(selectedItems);
    const { suppliers, countItemsAll } = await GetSuppliersForPageAsync(
      numberPage
    );
    setData(suppliers);
    setCount(countItemsAll);
  };

  const handleGet = async (numberPage: number) => {
    const { suppliers, countItemsAll } = await GetSuppliersForPageAsync(
      numberPage
    );
    setData(suppliers);
    setCount(countItemsAll);
  };

  const supplierss: SupplierModel[] = [
    {
      id: "1",
      supplierName: "Supplier 1"
    },
    {
      id: "2",
      supplierName: "Supplier 2",
    },
    {
      id: "3",
      supplierName: "Supplier 3",
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
        data={supplierss}
        tableName="Suppliers"
        countItemsAll={countItemsAll}
        handleDelete={handleDelete}
        handleGet={handleGet}
      />
    </div>
  );
}
