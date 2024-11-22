"use client";

import { useEffect, useState, Suspense } from "react";
import { ManufacturerModel } from "@/Models/ManufacturerModels/ManufacturerModel";
import DataTable from "@/components/DataTableComponent/DataTable";
import { GetManufacturersForPageAsync } from "@/services/ManufacturerServices/GetManufacturersForPageAsync";
import { DeleteManufacturersAsync } from "@/services/ManufacturerServices/DeleteManufacturersAsync";
import { useSearchParams } from "next/navigation";
import { GetSupplierManufacturersForPageAsync } from "@/services/SupplierServices/GetSupplierManufacturersForPageAsync";
import { ExportManufacturerToExcelAsync } from "@/services/ManufacturerServices/ExportManufacturerToExcelAsync";

export default function Manufacturers() {
  const [data, setData] = useState<ManufacturerModel[]>([]);
  const [filteredData, setFilterdData] = useState<ManufacturerModel[]>([]);
  const [countItemsAll, setCount] = useState<number>(0);
  const [supplierId, setSupplierId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleGetSupplierManufacturers = async (numberPage: number) => {
    if (supplierId) {
      const { manufacturers, countItemsAll } = await GetSupplierManufacturersForPageAsync(
        supplierId,
        numberPage
      );
      setData(manufacturers);
      setCount(countItemsAll);
    }
  };

  const handleSearch = (searchQuery: string) => {
    setSearchQuery(searchQuery)
    const newFilteredData = data.filter(item =>
      item.manufacturerName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (newFilteredData.length > 0) {
      setFilterdData(newFilteredData);
    } else {
      setFilterdData([]);
      setTimeout(() => {
        alert('В результате поиска совпадения не были найдены.');
      }, 500);
    }
  };

  const handleExportToExcel = async() => {
    await ExportManufacturerToExcelAsync();
  }

  const manufacturers: ManufacturerModel[] = [
    {
      id: "1",
      manufacturerName: "Manufacturer A"
    },
    {
      id: "2",
      manufacturerName: "Manufacturer B"
    },
    {
      id: "3",
      manufacturerName: "Manufacturer C"
    }
  ];

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
        setCount(response.countItemsAll);
      } else {
        const response = await GetManufacturersForPageAsync(0);
        //setData(response.manufacturers);
        setData(manufacturers)
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
          data={filteredData.length > 0 ? filteredData : data}
          tableName="Manufacturers"
          countItemsAll={countItemsAll}
          searchText={searchQuery}
          handleDelete={handleDelete}
          handleGet={supplierId ? handleGetSupplierManufacturers : handleGet}
          handleSearch={handleSearch}
          handleExportToExcel={handleExportToExcel}
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
