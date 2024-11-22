"use client";

import { useEffect, useState, Suspense } from "react";
import { SupplierModel } from "@/Models/SupplierModels/SupplierModel";
import DataTable from "@/components/DataTableComponent/DataTable";
import { useSearchParams } from "next/navigation";
import { GetSuppliersForPageAsync } from "@/services/SupplierServices/GetSuppliersForPageAsync";
import { DeleteSuppliersAsync } from "@/services/SupplierServices/DeleteSuppliersAsync";
import { GetProductSuppliersForPageAsync } from "@/services/ProductServices/GetProductSuppliersForPageAsync";

export default function Suppliers() {
  const [data, setData] = useState<SupplierModel[]>([]);
  const [filteredData, setFilterdData] = useState<SupplierModel[]>([]);
  const [countItemsAll, setCount] = useState<number>(0);
  const [productId, setProductId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const numberPage = 0;

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
  };

  const handleGetProductSuppliers = async (numberPage: number) => {
    if (productId) {
      const {suppliers, countItemsAll} = await GetProductSuppliersForPageAsync(
        productId,
        numberPage
      );
      setData(suppliers);
      setCount(countItemsAll);
    }
  };

  const handleSearch = (searchQuery: string) => {
    setSearchQuery(searchQuery)
    const newFilteredData = data.filter(item =>
      item.supplierName.toLowerCase().includes(searchQuery.toLowerCase())
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
        const response = await GetProductSuppliersForPageAsync(
          productId,
          0
        );
        setData(response.suppliers);
        setCount(response.countItemsAll);
      } else {
        const response = await GetSuppliersForPageAsync(0);
        setData(response.suppliers);
        //setData(suppliers);
        setCount(response.countItemsAll);
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
          countItemsAll={countItemsAll}
          searchText={searchQuery}
          numberPage={numberPage}
          handleDelete={handleDelete}
          //handleGet={productId ? handleGetProductSuppliers : handleGet}
          handleSearch={handleSearch}
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
