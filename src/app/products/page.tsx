"use client";

import { useEffect, useState, Suspense } from "react";
import DataTable from "@/components/DataTableComponent/DataTable";
import { ProductModel } from "@/Models/ProductModels/ProductModel";
import { useSearchParams } from "next/navigation";
import "./style.css";
import { GetProductsForPageAsync } from "@/services/ProductServices/GetProductsForPageAsync";
import { DeleteProductsAsync } from "@/services/ProductServices/DeleteProductAsync";
import { GetSupplierProductsForPageAsync } from "@/services/SupplierServices/GetSupplierProductsForPageAsync";

export default function Products() {
  const [data, setData] = useState<ProductModel[]>([]);
  const [filteredData, setFilterdData] = useState<ProductModel[]>([]);
  const [countItemsAll, setCount] = useState<number>(0);
  const [supplierId, setSupplierId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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
  };

  const handleGetSupplierProducts = async (numberPage: number) => {
    if (supplierId) {
      const { products, countItemsAll } = await GetSupplierProductsForPageAsync(
        supplierId,
        numberPage
      );
      setData(products);
      setCount(countItemsAll);
    }
  };

  const handleSearch = (searchQuery: string) => {
    setSearchQuery(searchQuery)
    const newFilteredData = data.filter(item =>
      item.productName.toLowerCase().includes(searchQuery.toLowerCase())
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
        const response = await GetSupplierProductsForPageAsync(
          supplierId,
          0
        );
        setData(response.products);
        setCount(response.countItemsAll);
      } else {
        const response = await GetProductsForPageAsync(0);
        setData(response.products);
        //setData(products);
        setCount(response.countItemsAll);
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
          countItemsAll={countItemsAll}
          searchText={searchQuery}
          handleDelete={handleDelete}
          handleGet={supplierId ? handleGetSupplierProducts : handleGet}
          handleSearch={handleSearch}
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