"use client";

import { useEffect, useState, Suspense } from "react";
import { ResearchModel } from "@/Models/ResearchModels/ResearchModel";
import DataTable from "@/components/DataTableComponent/DataTable";
import { useSearchParams } from "next/navigation";
import { GetResearchesForPageAsync } from "@/services/ResearchServices.tsx/GetResearchesForPageAsync";
import { DeleteResearchesAsync } from "@/services/ResearchServices.tsx/DeleteResearchesAsync";
import "./style.css";
import { GetProductResearchesForPageAsync } from "@/services/ResearchServices.tsx/GetProductResearchesForPageAsync";

export default function Researches() {
  const [data, setData] = useState<ResearchModel[]>([]);
  const [countItemsAll, setCount] = useState<number>(0);
  const [productId, setProductId] = useState<string | null>(null);

  const handleDelete = async (
    selectedItems: Set<ResearchModel>,
    numberPage: number
  ) => {
    await DeleteResearchesAsync(selectedItems);
    const { researches, countItemsAll } = await GetResearchesForPageAsync(
      numberPage
    );
    setData(researches);
    setCount(countItemsAll);
  };

  const handleGet = async (numberPage: number) => {
    const { researches, countItemsAll } = await GetResearchesForPageAsync(
      numberPage
    );
    setData(researches);
    setCount(countItemsAll);
  };

  const handleGetProductResearches = async (numberPage: number) => {
    if (productId) {
      const { researches, countItemsAll } = await GetProductResearchesForPageAsync(
        productId,
        numberPage
      );
      setData(researches);
      setCount(countItemsAll);
    }
  };

  useEffect(() => {
    const getResearches = async () => {
      if (productId) {
        const response = await GetProductResearchesForPageAsync(
          productId,
          0
        );
        setData(response.researches);
        setCount(response.countItemsAll);
      } else {
        const response = await GetResearchesForPageAsync(0);
        setData(response.researches);
        setCount(response.countItemsAll);
      }
    };

    getResearches();
  }, [productId]); 

  function Research() {
    const searchParams = useSearchParams();
    const paramSupplierId = searchParams.get("productId");
    setProductId(paramSupplierId); 

    return (
      <div>
        <DataTable
          data={data}
          tableName="Researches"
          countItemsAll={countItemsAll}
          searchText=""
          handleDelete={handleDelete}
          handleGet={productId ? handleGetProductResearches : handleGet}
        />
      </div>
    );
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="get-researches-page">
        <Research />
      </div>
    </Suspense>
  );
}