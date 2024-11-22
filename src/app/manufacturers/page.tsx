"use client";

import { useEffect, useState, Suspense } from "react";
import { ManufacturerModel } from "@/Models/ManufacturerModels/ManufacturerModel";
import DataTable from "@/components/DataTableComponent/DataTable";
import { GetManufacturersForPageAsync } from "@/services/ManufacturerServices/GetManufacturersForPageAsync";
import { DeleteManufacturersAsync } from "@/services/ManufacturerServices/DeleteManufacturersAsync";
import { useSearchParams } from "next/navigation";
import { GetSupplierManufacturersForPageAsync } from "@/services/SupplierServices/GetSupplierManufacturersForPageAsync";
import { ExportManufacturerToExcelAsync } from "@/services/ManufacturerServices/ExportManufacturerToExcelAsync";
import { SearchManufacturersAsync } from "@/services/ManufacturerServices/SearchManufacturersAsync";

export default function Manufacturers() {
  const [data, setData] = useState<ManufacturerModel[]>([]);
  const [filteredData, setFilterdData] = useState<ManufacturerModel[]>([]);
  const [countItemsAll, setCountItemsAll] = useState<number>(0);
  const [countItemsSearch, setCountItemsSearch] = useState<number>(0);
  const [supplierId, setSupplierId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [numberPage, setNumberPage] = useState(0);

  const handleDelete = async (
    selectedItems: Set<ManufacturerModel>,
    numberPage: number
  ) => {
    await DeleteManufacturersAsync(selectedItems);
    const { manufacturers, countItemsAll } = await GetManufacturersForPageAsync(
      numberPage
    );
    setData(manufacturers);
    setCountItemsAll(countItemsAll);
  };

  const handleGet = async (numberPage: number) => {
    const { manufacturers, countItemsAll } = await GetManufacturersForPageAsync(
      numberPage
    );
    setData(manufacturers);
    setCountItemsAll(countItemsAll);
  };

  const handleGetSupplierManufacturers = async (numberPage: number) => {
    if (supplierId) {
      const { manufacturers, countItemsAll } = await GetSupplierManufacturersForPageAsync(
        supplierId,
        numberPage
      );
      setData(manufacturers);
      setCountItemsAll(countItemsAll);
    }
  };

  const handleSearch = async (searchQuery: string, numberPage: number) => {
    setSearchQuery(searchQuery);

    const { manufacturers, countItemsAll} = await SearchManufacturersAsync(
      searchQuery,
      numberPage
    );

    if (manufacturers.length > 0) {
      setFilterdData(manufacturers);
      setCountItemsSearch(countItemsAll);
    } else {
      setFilterdData([]);
      setCountItemsSearch(0);
      setTimeout(() => {
        alert("В результате поиска совпадения не были найдены.");
      }, 500);
    }
  };

  const handleExportToExcel = async () => {
    await ExportManufacturerToExcelAsync();
  };

  const decrementValue = () => {
    setNumberPage((prevPage) => {
      const newPage = Math.max(prevPage - 1, 0); // Уменьшаем номер страницы, но не меньше 0
      console.log(newPage);

      if (supplierId) {
        handleGetSupplierManufacturers(newPage); // Отправляем новый номер страницы + 1 на сервер
      } else {
        handleGet(newPage);
      }
      return newPage; // Обновляем состояние
    });
  };

  const incrementValue = () => {
    setNumberPage((prevPage) => {
      const newPage = prevPage + 1; // Увеличиваем номер страницы
      console.log(newPage);

      if (supplierId) {
        handleGetSupplierManufacturers(newPage); // Отправляем новый номер страницы + 1 на сервер
      } else {
        handleGet(newPage);
      }
      return newPage; // Обновляем состояние
    });
  };

  // const manufacturers: ManufacturerModel[] = [
  //   {
  //     id: "1",
  //     manufacturerName: "Manufacturer A"
  //   },
  //   {
  //     id: "2",
  //     manufacturerName: "Manufacturer B"
  //   },
  //   {
  //     id: "3",
  //     manufacturerName: "Manufacturer C"
  //   }
  // ];

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
        setCountItemsAll(response.countItemsAll);
      } else {
        const response = await GetManufacturersForPageAsync(0);
        setData(response.manufacturers);
        //setData(manufacturers)
        setCountItemsAll(response.countItemsAll);
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
          countItemsAll={countItemsSearch > 0 ? countItemsSearch : countItemsAll}
          searchText={searchQuery}
          numberPage={numberPage}
          handleDelete={handleDelete}
          handleSearch={handleSearch}
          handleExportToExcel={handleExportToExcel}
          handleDecrementValue={decrementValue}
          handleIncrementValue={incrementValue}
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
