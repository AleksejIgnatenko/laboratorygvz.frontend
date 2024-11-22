"use client";

import { useEffect, useState, Suspense } from "react";
import DataTable from "@/components/DataTableComponent/DataTable";
import { useSearchParams } from "next/navigation";
import { ResearchResultModel } from "@/Models/ResearchResultModel/ResearchResultModel";
import { GetResearchResultByPartyIdForPageAsync } from "@/services/ResearchResultServices/GetResearchResultByPartyIdForPageAsync";
import { GetResearchResultByResearchIdForPageAsync } from "@/services/ResearchResultServices/GetResearchResultByResearchIdForPageAsync";
import { DeleteResearchResultsAsync } from "@/services/ResearchResultServices/DeleteResearchResultsAsync";

export default function ResearchResult() {
  const [data, setData] = useState<ResearchResultModel[]>([]);
  const [filteredData, setFilterdData] = useState<ResearchResultModel[]>([]);
  const [countItemsAll, setCount] = useState<number>(0);
  const [partyId, setPartyId] = useState<string | null>(null);
  const [researchId, setResearchId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

    const handleDelete = async (
      selectedItems: Set<ResearchResultModel>,
      numberPage: number
    ) => {
      await DeleteResearchResultsAsync(selectedItems);
      if(partyId) {
        const researchResultsResponse = await GetResearchResultByPartyIdForPageAsync(
          partyId,
          numberPage
        );
        setData(researchResultsResponse.researchResults);
        setCount(researchResultsResponse.countItemsAll);
      } else if (researchId) {
        const researchResultsResponse = await GetResearchResultByResearchIdForPageAsync(
          researchId,
          numberPage
        );
        setData(researchResultsResponse.researchResults);
        setCount(researchResultsResponse.countItemsAll);
      }
    };

  const handleGetResearchResultsByPartyId = async (numberPage: number) => {
    if(partyId) {
    const { researchResults, countItemsAll } = await GetResearchResultByPartyIdForPageAsync(partyId, numberPage);
    setData(researchResults);
    setCount(countItemsAll);
    }
  };

  const handleGetResearchResultsByResearchId = async (numberPage: number) => {
    if(researchId) {
    const { researchResults, countItemsAll } = await GetResearchResultByPartyIdForPageAsync(researchId, numberPage);
    setData(researchResults);
    setCount(countItemsAll);
    }
  };

  const handleSearch = (searchQuery: string) => {
    setSearchQuery(searchQuery)
    const newFilteredData = data.filter(item =>
      item.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.researchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.result.toLowerCase().includes(searchQuery.toLowerCase()) 
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

    // const researchResults: ResearchResultModel[] = [
  //   {
  //     id: "1",
  //     researchName: "Исследование 1",
  //     batchNumber: "Batch001",
  //     result: "Результат 1"
  //   },
  //   {
  //     id: "2",
  //     researchName: "Исследование 2",
  //     batchNumber: "Batch002",
  //     result: ""
  //   },
  //   {
  //     id: "3",
  //     researchName: "Исследование 3",
  //     batchNumber: "Batch003",
  //     result: "Результат 3"
  //   }
  // ];

  useEffect(() => {
    const ResearchResult = async () => {
      if (partyId) {
        const researchResultsResponse = await GetResearchResultByPartyIdForPageAsync(
          partyId,
          0
        );
        setData(researchResultsResponse.researchResults);
        setCount(researchResultsResponse.countItemsAll);
      } else if (researchId) {
        const researchResultsResponse = await GetResearchResultByResearchIdForPageAsync(
          researchId,
          0
        );
        setData(researchResultsResponse.researchResults);
        setCount(researchResultsResponse.countItemsAll);
      }
    };

    ResearchResult();
  }, [partyId, researchId]);

  function ResearchResult() {
    const searchParams = useSearchParams();
    const paramPartyId = searchParams.get("partyId");
    if (paramPartyId) {
      setPartyId(paramPartyId);
    }

    const paramResearchId = searchParams.get("researchId");
    if (paramResearchId) {
      setResearchId(paramResearchId);
    }

    return (
      <div>
        <DataTable
          data={filteredData.length > 0 ? filteredData : data}
          tableName="ResearchResults"
          countItemsAll={countItemsAll}
          searchText={searchQuery}
          handleDelete={handleDelete}
          handleGet={
            partyId
              ? handleGetResearchResultsByPartyId
              : paramResearchId
              ? handleGetResearchResultsByResearchId
              : undefined
          }
          handleSearch={handleSearch}
        />
      </div>
    );
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="get-researchResult-page">
        <ResearchResult />
      </div>
    </Suspense>
  );
}
