"use client";

import { useEffect, useState } from "react";
import { SupplierModel } from "@/Models/SupplierModels/SupplierModel";
import DataTable from "@/components/DataTableComponent/DataTable";
import { GetSuppliersForPageAsync } from "@/services/SupplierServices/GetSuppliersForPageAsync";

export default function Suppliers() {
  const [data, setData] = useState<SupplierModel[]>([]);
  const [countItemsAll, setCount] = useState<number>(0);

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
      />
    </div>
  );
}
