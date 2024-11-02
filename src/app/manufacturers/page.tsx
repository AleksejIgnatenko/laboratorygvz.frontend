"use client";

import { useEffect, useState, Suspense } from "react";
import { ManufacturerModel } from "@/Models/ManufacturerModels/ManufacturerModel";
import DataTable from "@/components/DataTableComponent/DataTable";
import { GetManufacturersForPageAsync } from "@/services/ManufacturerServices/GetManufacturersForPageAsync";
import { DeleteManufacturersAsync } from "@/services/ManufacturerServices/DeleteManufacturersAsync";
import { useSearchParams } from "next/navigation";
import { GetSupplierManufacturersForPageAsync } from "@/services/SupplierServices/GetSupplierManufacturersForPageAsync";

export default function Manufacturers() {
  const [data, setData] = useState<ManufacturerModel[]>([]);
  const [countItemsAll, setCount] = useState<number>(0);
  const [supplierId, setSupplierId] = useState<string | null>(null); // Allow null

  const handleDelete = async (
    selectedItems: Set<ManufacturerModel>,
    numberPage: number
  ) => {
    await DeleteManufacturersAsync(selectedItems);
    const { manufacturers, countItemsAll } = await GetManufacturersForPageAsync(
      numberPage
    );
    setData(manufacturers);
    setCount(countItemsAll);
  };

  const handleGet = async (numberPage: number) => {
    const { manufacturers, countItemsAll } = await GetManufacturersForPageAsync(
      numberPage
    );
    setData(manufacturers);
    setCount(countItemsAll);
  };

  // useEffect(() => {
  //   const getManufacturers = async () => {
  //     const response = supplierId
  //       ? await GetManufacturersForPageAsync(0) // Fetch with supplierId
  //       : await GetManufacturersForPageAsync(0); // Fetch all manufacturers

  //     setData(response.manufacturers);
  //     setCount(response.countItemsAll);
  //   };

  //   getManufacturers();
  // }, [supplierId]); // Include supplierId as a dependency

    useEffect(() => {
      const getManufacturers = async () => {
        if (supplierId) {
          const response = await GetSupplierManufacturersForPageAsync(
            supplierId,
            0
          );
          setData(response.manufacturers);
          console.log(response.manufacturers);
          setCount(response.countItemsAll);
        } else {
          // Fetch all manufacturers if supplierId is null
          const response = await GetManufacturersForPageAsync(0);
          setData(response.manufacturers);
          setCount(response.countItemsAll);
        }
      };

      getManufacturers();
    }, [supplierId]); 

  function Manufacturer() {
    const searchParams = useSearchParams();
    const paramSupplierId = searchParams.get("supplierId");
    setSupplierId(paramSupplierId); 

    return (
      <div>
        <DataTable
          data={data}
          tableName="Manufacturers"
          countItemsAll={countItemsAll}
          handleDelete={handleDelete}
          handleGet={handleGet}
        />
      </div>
    );
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="get-manufacturers-page">
        <Manufacturer />
      </div>
    </Suspense>
  );
}
