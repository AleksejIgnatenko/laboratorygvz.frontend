"use client";

import { useEffect, useState, Suspense } from "react";
import { ManufacturerModel } from "@/Models/ManufacturerModels/ManufacturerModel";
import DataTable from "@/components/DataTableComponent/DataTable";
import { GetManufacturersForPageAsync } from "@/services/ManufacturerServices/GetManufacturersForPageAsync";
import { DeleteManufacturersAsync } from "@/services/ManufacturerServices/DeleteManufacturersAsync";
import { useSearchParams } from "next/navigation";
import { GetSupplierManufacturersForPageAsync } from "@/services/SupplierServices/GetSupplierManufacturersForPageAsync";
import { ExportManufacturersToExcelAsync } from "@/services/ManufacturerServices/ExportManufacturersToExcelAsync";
import { SearchManufacturersAsync } from "@/services/ManufacturerServices/SearchManufacturersAsync";

export default function Manufacturers() {
  const [data, setData] = useState<ManufacturerModel[]>([]);
  const [filteredData, setFilterdData] = useState<ManufacturerModel[]>([]);
  const [countItemsAll, setCountItemsAll] = useState<number>(0);
  const [countItemsSearch, setCountItemsSearch] = useState<number>(0);
  const [supplierId, setSupplierId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [numberPage, setNumberPage] = useState(0);
  const [maxPageNumber, setMaxPageNumber] = useState(0);

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
    const maxPageNumber = Math.max(1, Math.ceil(countItemsAll / 20));
    setMaxPageNumber(maxPageNumber);
  };

  const handleGetSupplierManufacturers = async (numberPage: number) => {
    if (supplierId) {
      const { manufacturers, countItemsAll } = await GetSupplierManufacturersForPageAsync(
        supplierId,
        numberPage
      );
      setData(manufacturers);
      setCountItemsAll(countItemsAll);
      const maxPageNumber = Math.max(1, Math.ceil(countItemsAll / 20));
      setMaxPageNumber(maxPageNumber);
    }
  };

  const handleSearch = async (searchText: string, numberPage: number) => {
    if (searchText !== "") {
      if (searchQuery === "") {
        numberPage = 0;
        setNumberPage(numberPage);
      }
      setSearchQuery(searchText);

      const { manufacturers, countItemsAll } = await SearchManufacturersAsync(
        searchText,
        numberPage
      );

      if (manufacturers.length > 0) {
        setFilterdData(manufacturers);
        setCountItemsSearch(countItemsAll);
        const maxPageNumber = Math.max(1, Math.ceil(countItemsAll / 20));
        setMaxPageNumber(maxPageNumber);
      } else {
        setFilterdData([]);
        setCountItemsSearch(0);
        if (supplierId) {
          const response = await GetSupplierManufacturersForPageAsync(
            supplierId,
            0
          );
          setData(response.manufacturers);
          setCountItemsAll(response.countItemsAll);
          const maxPageNumber = Math.max(1, Math.ceil(response.countItemsAll / 20));
          setMaxPageNumber(maxPageNumber);
        } else {
          const response = await GetManufacturersForPageAsync(0);
          setData(response.manufacturers);
          //setData(manufacturers)
          setCountItemsAll(response.countItemsAll);
          const maxPageNumber = Math.max(1, Math.ceil(response.countItemsAll / 20));
          setMaxPageNumber(maxPageNumber);
        }
        setTimeout(() => {
          alert("В результате поиска совпадения не были найдены.");
        }, 500);
      }
    } else {
      setSearchQuery(searchText);

      setFilterdData([]);
      setCountItemsSearch(0);
      if (supplierId) {
        const response = await GetSupplierManufacturersForPageAsync(
          supplierId,
          0
        );
        setData(response.manufacturers);
        setCountItemsAll(response.countItemsAll);
        const maxPageNumber = Math.max(1, Math.ceil(response.countItemsAll / 20));
        setMaxPageNumber(maxPageNumber);
      } else {
        const response = await GetManufacturersForPageAsync(0);
        setData(response.manufacturers);
        //setData(manufacturers)
        setCountItemsAll(response.countItemsAll);
        const maxPageNumber = Math.max(1, Math.ceil(response.countItemsAll / 20));
        setMaxPageNumber(maxPageNumber);
      }
    }
  };

  const handleExportToExcel = async () => {
    await ExportManufacturersToExcelAsync();
  };

  const decrementValue = () => {
    setNumberPage((prevPage) => {
      const newPage = Math.max(prevPage - 1, 0); // Уменьшаем номер страницы, но не меньше 0

      if (supplierId) {
        handleGetSupplierManufacturers(newPage); // Отправляем новый номер страницы + 1 на сервер
      } else if (searchQuery !== "") {
        handleSearch(searchQuery, newPage);
      } else {
        handleGet(newPage);
      }
      return newPage; // Обновляем состояние
    });
  };

  const incrementValue = () => {
    setNumberPage((prevPage) => {
      const newPage = prevPage + 1; // Увеличиваем номер страницы

      if (newPage < maxPageNumber) {
        if (supplierId) {
          handleGetSupplierManufacturers(newPage); // Отправляем новый номер страницы + 1 на сервер
        } else if(searchQuery !== '') {
          handleSearch(searchQuery, newPage);
        } else {
          handleGet(newPage);
        }
        return newPage; // Обновляем состояние
      }
      return prevPage;
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
        const maxPageNumber = Math.max(1, Math.ceil(response.countItemsAll / 20));
        setMaxPageNumber(maxPageNumber);
      } else {
        const response = await GetManufacturersForPageAsync(0);
        setData(response.manufacturers);
        //setData(manufacturers)
        setCountItemsAll(response.countItemsAll);
        const maxPageNumber = Math.max(1, Math.ceil(response.countItemsAll / 20));
        setMaxPageNumber(maxPageNumber);
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
          maxPageNumber={maxPageNumber}
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
