"use client";

import { useEffect, useState, Suspense } from "react";
import DataTable from "@/components/DataTableComponent/DataTable";
import { ProductModel } from "@/Models/ProductModels/ProductModel";
import { useSearchParams } from "next/navigation";
import "./style.css";
import { GetProductsForPageAsync } from "@/services/ProductServices/GetProductsForPageAsync";
import { DeleteProductsAsync } from "@/services/ProductServices/DeleteProductAsync";
import { GetSupplierProductsForPageAsync } from "@/services/SupplierServices/GetSupplierProductsForPageAsync";
import { ExportProductsToExcelAsync } from "@/services/ProductServices/ExportProductsToExcelAsync";
import { SearchProductsAsync } from "@/services/ProductServices/SearchProductsAsync";

export default function Products() {
  const [data, setData] = useState<ProductModel[]>([]);
  const [filteredData, setFilterdData] = useState<ProductModel[]>([]);
  const [countItemsAll, setCount] = useState<number>(0);
  const [countItemsSearch, setCountItemsSearch] = useState<number>(0);
  const [supplierId, setSupplierId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [numberPage, setNumberPage] = useState(0);
  const [maxPageNumber, setMaxPageNumber] = useState(0);

  const handleDelete = async (
    selectedItems: Set<ProductModel>,
    numberPage: number
  ) => {
    await DeleteProductsAsync(selectedItems);
    const { products, countItemsAll } = await GetProductsForPageAsync(
      numberPage
    );
    setData(products);
    setCount(countItemsAll);
  };

  const handleGet = async (numberPage: number) => {
    const { products, countItemsAll } = await GetProductsForPageAsync(
      numberPage
    );
    setData(products);
    setCount(countItemsAll);
    const maxPageNumber = Math.max(1, Math.ceil(countItemsAll / 20));
    setMaxPageNumber(maxPageNumber);
  };

  const handleGetSupplierProducts = async (numberPage: number) => {
    if (supplierId) {
      const { products, countItemsAll } = await GetSupplierProductsForPageAsync(
        supplierId,
        numberPage
      );
      setData(products);
      setCount(countItemsAll);
      const maxPageNumber = Math.max(1, Math.ceil(countItemsAll / 20));
      setMaxPageNumber(maxPageNumber);
    }
  };

  const decrementValue = () => {
    setNumberPage((prevPage) => {
      const newPage = Math.max(prevPage - 1, 0); // Уменьшаем номер страницы, но не меньше 0

      if (supplierId) {
        handleGetSupplierProducts(newPage); // Отправляем новый номер страницы + 1 на сервер
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
        if (supplierId) {
          handleGetSupplierProducts(newPage); // Отправляем новый номер страницы + 1 на сервер
        } else {
          handleGet(newPage);
        }
        return newPage;
      }
      return prevPage; // Обновляем состояние
    });
  };

  const handleSearch = async (searchText: string, numberPage: number) => {
    if (searchText !== "") {
      if (searchQuery === "") {
        numberPage = 0;
        setNumberPage(numberPage);
      }
      setSearchQuery(searchText);

      const { products, countItemsAll } = await SearchProductsAsync(
        searchText,
        numberPage
      );

      if (products.length > 0) {
        setFilterdData(products);
        setCountItemsSearch(countItemsAll);
        const maxPageNumber = Math.max(1, Math.ceil(countItemsAll / 20));
        setMaxPageNumber(maxPageNumber);
      } else {
        setFilterdData([]);

        setCountItemsSearch(0);
        if (supplierId) {
          const response = await GetSupplierProductsForPageAsync(supplierId, 0);
          setData(response.products);
          setCount(response.countItemsAll);
          const maxPageNumber = Math.max(1, Math.ceil(countItemsAll / 20));
          setMaxPageNumber(maxPageNumber);
        } else {
          const response = await GetProductsForPageAsync(0);
          setData(response.products);
          //setData(products);
          setCount(response.countItemsAll);
          const maxPageNumber = Math.max(1, Math.ceil(countItemsAll / 20));
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
        const response = await GetSupplierProductsForPageAsync(supplierId, 0);
        setData(response.products);
        setCount(response.countItemsAll);
        const maxPageNumber = Math.max(1, Math.ceil(countItemsAll / 20));
        setMaxPageNumber(maxPageNumber);
      } else {
        const response = await GetProductsForPageAsync(0);
        setData(response.products);
        //setData(products);
        setCount(response.countItemsAll);
        const maxPageNumber = Math.max(1, Math.ceil(countItemsAll / 20));
        setMaxPageNumber(maxPageNumber);
      }
    }
  };

  const handleExportToExcel = async () => {
    await ExportProductsToExcelAsync();
  };

  // const products: ProductModel[] = [
  //   {
  //     id: "1",
  //     productName: "b",
  //   },
  //   {
  //     id: "2",
  //     productName: "c",

  //   },
  //   {
  //     id: "3",
  //     productName: "a",
  //   },
  // ];

  useEffect(() => {
    const getProducts = async () => {
      if (supplierId) {
        const response = await GetSupplierProductsForPageAsync(supplierId, 0);
        setData(response.products);
        setCount(response.countItemsAll);
        const maxPageNumber = Math.max(1, Math.ceil(countItemsAll / 20));
        setMaxPageNumber(maxPageNumber);
      } else {
        const response = await GetProductsForPageAsync(0);
        setData(response.products);
        //setData(products);
        setCount(response.countItemsAll);
        const maxPageNumber = Math.max(1, Math.ceil(countItemsAll / 20));
        setMaxPageNumber(maxPageNumber);
      }
    };

    getProducts();
  }, [supplierId]);

  function Product() {
    const searchParams = useSearchParams();
    const paramSupplierId = searchParams.get("supplierId");
    setSupplierId(paramSupplierId);

    return (
      <div>
        <DataTable
          data={filteredData.length > 0 ? filteredData : data}
          tableName="Products"
          countItemsAll={
            countItemsSearch > 0 ? countItemsSearch : countItemsAll
          }
          searchText={searchQuery}
          numberPage={numberPage}
          handleDelete={handleDelete}
          // handleGet={supplierId ? handleGetSupplierProducts : handleGet}
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
      <div className="get-products-page">
        <Product />
      </div>
    </Suspense>
  );
}