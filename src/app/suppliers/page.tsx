"use client";

import { useEffect, useState, Suspense } from "react";
import { SupplierModel } from "@/Models/SupplierModels/SupplierModel";
import DataTable from "@/components/DataTableComponent/DataTable";
import { useSearchParams } from "next/navigation";
import { GetSuppliersForPageAsync } from "@/services/SupplierServices/GetSuppliersForPageAsync";
import { DeleteSuppliersAsync } from "@/services/SupplierServices/DeleteSuppliersAsync";
import { GetProductSuppliersForPageAsync } from "@/services/ProductServices/GetProductSuppliersForPageAsync";
import { ExportSuppliersToExcelAsync } from "@/services/SupplierServices/ExportSuppliersToExcelAsync";
import { SearchSuppliersAsync } from "@/services/SupplierServices/SearchSuppliersAsync";

export default function Suppliers() {
  const [data, setData] = useState<SupplierModel[]>([]);
  const [filteredData, setFilterdData] = useState<SupplierModel[]>([]);
  const [countItemsAll, setCount] = useState<number>(0);
  const [countItemsSearch, setCountItemsSearch] = useState<number>(0);
  const [productId, setProductId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [numberPage, setNumberPage] = useState(0);
  const [maxPageNumber, setMaxPageNumber] = useState(0);

  const handleDelete = async (
    selectedItems: Set<SupplierModel>,
    numberPage: number
  ) => {
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
    const maxPageNumber = Math.max(1, Math.ceil(countItemsAll / 20));
    setMaxPageNumber(maxPageNumber);
  };

  const handleGetProductSuppliers = async (numberPage: number) => {
    if (productId) {
      const { suppliers, countItemsAll } =
        await GetProductSuppliersForPageAsync(productId, numberPage);
      setData(suppliers);
      setCount(countItemsAll);
      const maxPageNumber = Math.max(1, Math.ceil(countItemsAll / 20));
      setMaxPageNumber(maxPageNumber);
    }
  };

  const handleExportToExcel = async () => {
    await ExportSuppliersToExcelAsync();
  };

  const handleSearch = async (searchText: string, numberPage: number) => {
    if (searchText !== "") {
      if (searchQuery === "") {
        numberPage = 0;
        setNumberPage(numberPage);
      }
      setSearchQuery(searchText);

      const { suppliers, countItemsAll } = await SearchSuppliersAsync(
        searchText,
        numberPage
      );

      if (suppliers.length > 0) {
        setFilterdData(suppliers);
        setCountItemsSearch(countItemsAll);
      } else {
        setFilterdData([]);
        setCountItemsSearch(0);

        if (productId) {
          const response = await GetProductSuppliersForPageAsync(productId, 0);
          setData(response.suppliers);
          setCount(response.countItemsAll);
          const maxPageNumber = Math.max(1, Math.ceil(response.countItemsAll / 20));
          setMaxPageNumber(maxPageNumber);
        } else {
          const response = await GetSuppliersForPageAsync(0);
          setData(response.suppliers);
          //setData(suppliers);
          setCount(response.countItemsAll);
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

      if (productId) {
        const response = await GetProductSuppliersForPageAsync(productId, 0);
        setData(response.suppliers);
        setCount(response.countItemsAll);
        const maxPageNumber = Math.max(1, Math.ceil(response.countItemsAll / 20));
        setMaxPageNumber(maxPageNumber);
      } else {
        const response = await GetSuppliersForPageAsync(0);
        setData(response.suppliers);
        //setData(suppliers);
        setCount(response.countItemsAll);
        const maxPageNumber = Math.max(1, Math.ceil(response.countItemsAll / 20));
        setMaxPageNumber(maxPageNumber);
      }
    }
  };

  const decrementValue = () => {
    setNumberPage((prevPage) => {
      const newPage = Math.max(prevPage - 1, 0); // Уменьшаем номер страницы, но не меньше 0

      if (productId) {
        handleGetProductSuppliers(newPage); // Отправляем новый номер страницы + 1 на сервер
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

      if (newPage <= maxPageNumber) {
        if (productId) {
          handleGetProductSuppliers(newPage); // Отправляем новый номер страницы + 1 на сервер
        } else if (searchQuery !== "") {
          handleSearch(searchQuery, newPage);
        } else {
          handleGet(newPage);
        }
        return newPage;
      }
      return prevPage; // Обновляем состояние
    });
  };

  // const suppliers: SupplierModel[] = [
  //   {
  //     id: "1",
  //     supplierName: "Supplier 1"
  //   },
  //   {
  //     id: "2",
  //     supplierName: "Supplier a",
  //   },
  //   {
  //     id: "3",
  //     supplierName: "Supplier 3",
  //   },
  // ];

  useEffect(() => {
    const getSuppliers = async () => {
      if (productId) {
        const response = await GetProductSuppliersForPageAsync(productId, 0);
        setData(response.suppliers);
        setCount(response.countItemsAll);
        const maxPageNumber = Math.max(1, Math.ceil(response.countItemsAll / 20));
        setMaxPageNumber(maxPageNumber);
      } else {
        const response = await GetSuppliersForPageAsync(0);
        setData(response.suppliers);
        //setData(suppliers);
        setCount(response.countItemsAll);
        const maxPageNumber = Math.max(1, Math.ceil(response.countItemsAll / 20));
        console.log(maxPageNumber);
        setMaxPageNumber(maxPageNumber);
      }
    };

    getSuppliers();
  }, [productId]);

  function Supplier() {
    const searchParams = useSearchParams();
    const paramProductId = searchParams.get("productId");
    setProductId(paramProductId);

    return (
      <div>
        <DataTable
          data={filteredData.length > 0 ? filteredData : data}
          tableName="Suppliers"
          countItemsAll={countItemsSearch > 0 ? countItemsSearch : countItemsAll}
          searchText={searchQuery}
          numberPage={numberPage}
          handleDelete={handleDelete}
          //handleGet={productId ? handleGetProductSuppliers : handleGet}
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
      <div className="get-suppliers-page">
        <Supplier />
      </div>
    </Suspense>
  );
}
