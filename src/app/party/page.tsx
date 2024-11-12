"use client";

import { useEffect, useState, Suspense } from "react";
import DataTable from "@/components/DataTableComponent/DataTable";
import { DeletePartiesAsync } from "@/services/PartyServices/DeletePartiesAsync";
import { PartyModel } from "@/Models/PartyModels/PartyModel";
import { useSearchParams } from "next/navigation";
import { GetPartiesForPageAsync } from "@/services/PartyServices/GetPartiesForPageAsync";
import { GetManufacturerPartiesForPageAsync } from "@/services/ManufacturerServices/GetManufacturerPartiesForPageAsync";
import { GetSupplierPartiesForPageAsync } from "@/services/SupplierServices/GetSupplierPartiesForPageAsync";

export default function Researches() {
  const [data, setData] = useState<PartyModel[]>([]);
  const [countItemsAll, setCount] = useState<number>(0);

  const [manufacturerId, setManufacturerId] = useState<string | null>(null);
  const [supplierId, setSupplierId] = useState<string | null>(null);
  const [productId, setProductId] = useState<string | null>(null);

  const handleDelete = async (
    selectedItems: Set<PartyModel>,
    numberPage: number
  ) => {
    await DeletePartiesAsync(selectedItems);
    const { parties, countItemsAll } = await GetPartiesForPageAsync(numberPage);
    setData(parties);
    setCount(countItemsAll);
  };

  const handleGet = async (numberPage: number) => {
    const { parties, countItemsAll } = await GetPartiesForPageAsync(numberPage);
    setData(parties);
    setCount(countItemsAll);
  };

  useEffect(() => {
    const getParties = async () => {
      if (manufacturerId) {
        const response = await GetManufacturerPartiesForPageAsync(
          manufacturerId,
          0
        );
        setData(response.parties);
        setCount(response.countItemsAll);
      } else if (supplierId) {
        const response = await GetSupplierPartiesForPageAsync(
          supplierId,
          0
        );
        setData(response.parties);
        setCount(response.countItemsAll);
      } else if (productId) {
        console.log(productId);
      } else {
        const response = await GetPartiesForPageAsync(0);
        setData(response.parties);
        setCount(response.countItemsAll);
      }
    };

    getParties();
  }, [manufacturerId, supplierId, productId]);

  function Party() {
    const searchParams = useSearchParams();
    const paramSupplierId = searchParams.get("supplierId");
    if (paramSupplierId) {
      setSupplierId(paramSupplierId);
    }

    const paramProductId = searchParams.get("productId");
    if (paramProductId) {
      setProductId(paramProductId);
    }

    const paramManufacturerId = searchParams.get("manufacturerId");
    if (paramManufacturerId) {
      setManufacturerId(paramManufacturerId);
    }

    return (
      <div>
        <DataTable
          data={data}
          tableName="Parties"
          countItemsAll={countItemsAll}
          handleDelete={handleDelete}
          handleGet={handleGet}
        />
      </div>
    );
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="get-party-page">
        <Party />
      </div>
    </Suspense>
  );
}
