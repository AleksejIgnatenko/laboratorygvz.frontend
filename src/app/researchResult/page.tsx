"use client";

import { useEffect, useState, Suspense } from "react";
import DataTable from "@/components/DataTableComponent/DataTable";
import { useSearchParams } from "next/navigation";
import { ResearchResultModel } from "@/Models/ResearchResultModel/ResearchResultModel";
import { GetResearchResultByPartyIdForPageAsync } from "@/services/ResearchResultServices/GetResearchResultByPartyIdForPageAsync";
import { GetResearchResultByResearchIdForPageAsync } from "@/services/ResearchResultServices/GetResearchResultByResearchIdForPageAsync";
import { DeleteResearchResultsAsync } from "@/services/ResearchResultServices/DeleteResearchResultsAsync";
import { ExportResearchResultsToExcelAsync } from "@/services/ResearchResultServices/ExportResearchResultsToExcelAsync";
import { SearchResearchResultssAsync } from "@/services/ResearchResultServices/SearchResearchResultssAsync";

export default function ResearchResult() {
  const [data, setData] = useState<ResearchResultModel[]>([]);
  const [filteredData, setFilterdData] = useState<ResearchResultModel[]>([]);
  const [countItemsAll, setCount] = useState<number>(0);
  const [countItemsSearch, setCountItemsSearch] = useState<number>(0);
  const [partyId, setPartyId] = useState<string | null>(null);
  const [researchId, setResearchId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [numberPage, setNumberPage] = useState(0);
  const [maxPageNumber, setMaxPageNumber] = useState(0);

  const handleDelete = async (
    selectedItems: Set<ResearchResultModel>,
    numberPage: number
  ) => {
    await DeleteResearchResultsAsync(selectedItems);
    if (partyId) {
      const researchResultsResponse =
        await GetResearchResultByPartyIdForPageAsync(partyId, numberPage);
      setData(researchResultsResponse.researchResults);
      setCount(researchResultsResponse.countItemsAll);
    } else if (researchId) {
      const researchResultsResponse =
        await GetResearchResultByResearchIdForPageAsync(researchId, numberPage);
      setData(researchResultsResponse.researchResults);
      setCount(researchResultsResponse.countItemsAll);
    }
  };

  const handleGetResearchResultsByPartyId = async (numberPage: number) => {
    if (partyId) {
      const { researchResults, countItemsAll } =
        await GetResearchResultByPartyIdForPageAsync(partyId, numberPage);
      setData(researchResults);
      setCount(countItemsAll);
              const maxPageNumber = Math.max(1, Math.ceil(countItemsAll / 20));
        setMaxPageNumber(maxPageNumber);
      setMaxPageNumber(maxPageNumber);
    }
  };

  const handleGetResearchResultsByResearchId = async (numberPage: number) => {
    if (researchId) {
      const { researchResults, countItemsAll } =
        await GetResearchResultByPartyIdForPageAsync(researchId, numberPage);
      setData(researchResults);
      setCount(countItemsAll);
              const maxPageNumber = Math.max(1, Math.ceil(countItemsAll / 20));
        setMaxPageNumber(maxPageNumber);
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

      const { researchResults, countItemsAll } =
        await SearchResearchResultssAsync(searchText, numberPage);

      if (researchResults.length > 0) {
        setFilterdData(researchResults);
        setCountItemsSearch(countItemsAll);
        const maxPageNumber = Math.max(1, Math.ceil(countItemsAll / 20));
        setMaxPageNumber(maxPageNumber);
      } else {
        setFilterdData([]);
        setCountItemsSearch(0);

        if (partyId) {
          const researchResultsResponse =
            await GetResearchResultByPartyIdForPageAsync(partyId, 0);
          setData(researchResultsResponse.researchResults);
          setCount(researchResultsResponse.countItemsAll);
          const maxPageNumber = Math.max(1, Math.ceil(countItemsAll / 20));
          setMaxPageNumber(maxPageNumber);
          setMaxPageNumber(maxPageNumber);
        } else if (researchId) {
          const researchResultsResponse =
            await GetResearchResultByResearchIdForPageAsync(researchId, 0);
          setData(researchResultsResponse.researchResults);
          setCount(researchResultsResponse.countItemsAll);
          const maxPageNumber = Math.max(1, Math.ceil(countItemsAll / 20));
          setMaxPageNumber(maxPageNumber);
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

      if (partyId) {
        const researchResultsResponse =
          await GetResearchResultByPartyIdForPageAsync(partyId, 0);
        setData(researchResultsResponse.researchResults);
        setCount(researchResultsResponse.countItemsAll);
        const maxPageNumber = Math.max(1, Math.ceil(countItemsAll / 20));
        setMaxPageNumber(maxPageNumber);
        setMaxPageNumber(maxPageNumber);
      } else if (researchId) {
        const researchResultsResponse =
          await GetResearchResultByResearchIdForPageAsync(researchId, 0);
        setData(researchResultsResponse.researchResults);
        setCount(researchResultsResponse.countItemsAll);
        const maxPageNumber = Math.max(1, Math.ceil(countItemsAll / 20));
        setMaxPageNumber(maxPageNumber);
        setMaxPageNumber(maxPageNumber);
      }
    }
  };

  const handleExportToExcel = async () => {
    await ExportResearchResultsToExcelAsync();
  };

  const decrementValue = () => {
    setNumberPage((prevPage) => {
      const newPage = Math.max(prevPage - 1, 0); // Уменьшаем номер страницы, но не меньше 0

      if (newPage <= maxPageNumber) {
        if (partyId) {
          handleGetResearchResultsByPartyId(newPage); // Отправляем новый номер страницы + 1 на сервер
        } else if (researchId) {
          handleGetResearchResultsByResearchId(newPage);
        }
        return newPage;
      }
      return prevPage; // Обновляем состояние
    });
  };

  const incrementValue = () => {
    setNumberPage((prevPage) => {
      const newPage = prevPage + 1; // Увеличиваем номер страницы

      if (newPage <= maxPageNumber) {
        if (partyId) {
          handleGetResearchResultsByPartyId(newPage); // Отправляем новый номер страницы + 1 на сервер
        } else if (researchId) {
          handleGetResearchResultsByResearchId(newPage);
        }
        return newPage;
      }
      return prevPage; // Обновляем состояние
    });
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
        const researchResultsResponse =
          await GetResearchResultByPartyIdForPageAsync(partyId, 0);
        setData(researchResultsResponse.researchResults);
        setCount(researchResultsResponse.countItemsAll);
                const maxPageNumber = Math.max(1, Math.ceil(countItemsAll / 20));
        setMaxPageNumber(maxPageNumber);
        setMaxPageNumber(maxPageNumber);
      } else if (researchId) {
        const researchResultsResponse =
          await GetResearchResultByResearchIdForPageAsync(researchId, 0);
        setData(researchResultsResponse.researchResults);
        setCount(researchResultsResponse.countItemsAll);
                const maxPageNumber = Math.max(1, Math.ceil(countItemsAll / 20));
        setMaxPageNumber(maxPageNumber);
        setMaxPageNumber(maxPageNumber);
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
          countItemsAll={countItemsSearch > 0 ? countItemsSearch : countItemsAll}
          searchText={searchQuery}
          numberPage={numberPage}
          handleDelete={handleDelete}
          // handleGet={
          //   partyId
          //     ? handleGetResearchResultsByPartyId
          //     : paramResearchId
          //     ? handleGetResearchResultsByResearchId
          //     : undefined
          // }
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
      <div className="get-researchResult-page">
        <ResearchResult />
      </div>
    </Suspense>
  );
}
