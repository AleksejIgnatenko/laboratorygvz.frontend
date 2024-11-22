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
  const [filteredData, setFilterdData] = useState<ResearchModel[]>([]);
  const [countItemsAll, setCount] = useState<number>(0);
  const [productId, setProductId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleSearch = (searchQuery: string) => {
    setSearchQuery(searchQuery)
    const newFilteredData = data.filter(item =>
      item.researchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

  // const researches: ResearchModel[] = [
  //   {
  //     id: "1",
  //     researchName: "Исследование рынка",
  //     productName: "Продукт A",
  //   },
  //   {
  //     id: "2",
  //     researchName: "Анализ потребительских предпочтений",
  //     productName: "Продукт B",
  //   },
  //   {
  //     id: "3",
  //     researchName: "Исследование конкурентоспособности",
  //     productName: "Продукт C",
  //   },
  // ];

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
        //setData(researches);
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
          data={filteredData.length > 0 ? filteredData : data}
          tableName="Researches"
          countItemsAll={countItemsAll}
          searchText={searchQuery}
          handleDelete={handleDelete}
          handleGet={productId ? handleGetProductResearches : handleGet}
          handleSearch={handleSearch}
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