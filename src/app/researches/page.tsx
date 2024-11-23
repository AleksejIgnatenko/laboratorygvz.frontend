"use client";

import { useEffect, useState, Suspense } from "react";
import { ResearchModel } from "@/Models/ResearchModels/ResearchModel";
import DataTable from "@/components/DataTableComponent/DataTable";
import { useSearchParams } from "next/navigation";
import { GetResearchesForPageAsync } from "@/services/ResearchServices.tsx/GetResearchesForPageAsync";
import { DeleteResearchesAsync } from "@/services/ResearchServices.tsx/DeleteResearchesAsync";
import "./style.css";
import { GetProductResearchesForPageAsync } from "@/services/ResearchServices.tsx/GetProductResearchesForPageAsync";
import { ExportResearchesToExcelAsync } from "@/services/ResearchServices.tsx/ExportResearchesToExcelAsync";
import { SearchResearchesAsync } from "@/services/ResearchServices.tsx/SearchResearchesAsync";

export default function Researches() {
  const [data, setData] = useState<ResearchModel[]>([]);
  const [filteredData, setFilterdData] = useState<ResearchModel[]>([]);
  const [countItemsAll, setCount] = useState<number>(0);
  const [countItemsSearch, setCountItemsSearch] = useState<number>(0);
  const [productId, setProductId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [numberPage, setNumberPage] = useState(0);
  const [maxPageNumber, setMaxPageNumber] = useState(0);

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
            const maxPageNumber = Math.max(1, Math.ceil(countItemsAll / 20));
        setMaxPageNumber(maxPageNumber);
    setMaxPageNumber(maxPageNumber);
  };

  const handleGetProductResearches = async (numberPage: number) => {
    if (productId) {
      const { researches, countItemsAll } =
        await GetProductResearchesForPageAsync(productId, numberPage);
      setData(researches);
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

      const { researches, countItemsAll } = await SearchResearchesAsync(
        searchText,
        numberPage
      );

      if (researches.length > 0) {
        setFilterdData(researches);
        setCountItemsSearch(countItemsAll);
        const maxPageNumber = Math.max(1, Math.ceil(countItemsAll / 20));
        setMaxPageNumber(maxPageNumber);
      } else {
        setFilterdData([]);
        setCountItemsSearch(0);

        if (productId) {
          const response = await GetProductResearchesForPageAsync(productId, 0);
          setData(response.researches);
          setCount(response.countItemsAll);
                  const maxPageNumber = Math.max(1, Math.ceil(countItemsAll / 20));
        setMaxPageNumber(maxPageNumber);
          setMaxPageNumber(maxPageNumber);
        } else {
          const response = await GetResearchesForPageAsync(0);
          setData(response.researches);
          //setData(researches);
          setCount(response.countItemsAll);
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

      if (productId) {
        const response = await GetProductResearchesForPageAsync(productId, 0);
        setData(response.researches);
        setCount(response.countItemsAll);
                const maxPageNumber = Math.max(1, Math.ceil(countItemsAll / 20));
        setMaxPageNumber(maxPageNumber);
        setMaxPageNumber(maxPageNumber);
      } else {
        const response = await GetResearchesForPageAsync(0);
        setData(response.researches);
        //setData(researches);
        setCount(response.countItemsAll);
                const maxPageNumber = Math.max(1, Math.ceil(countItemsAll / 20));
        setMaxPageNumber(maxPageNumber);
        setMaxPageNumber(maxPageNumber);
      }
    }
  };

  const decrementValue = () => {
    setNumberPage((prevPage) => {
      const newPage = Math.max(prevPage - 1, 0); // Уменьшаем номер страницы, но не меньше 0

      if (productId) {
        handleGetProductResearches(newPage); // Отправляем новый номер страницы + 1 на сервер
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
          handleGetProductResearches(newPage); // Отправляем новый номер страницы + 1 на сервер
        } else {
          handleGet(newPage);
        }
        return newPage;
      }
      return prevPage; // Обновляем состояние
    });
  };

  const handleExportToExcel = async () => {
    await ExportResearchesToExcelAsync();
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
        const response = await GetProductResearchesForPageAsync(productId, 0);
        setData(response.researches);
        setCount(response.countItemsAll);
                const maxPageNumber = Math.max(1, Math.ceil(countItemsAll / 20));
        setMaxPageNumber(maxPageNumber);
        setMaxPageNumber(maxPageNumber);
      } else {
        const response = await GetResearchesForPageAsync(0);
        setData(response.researches);
        //setData(researches);
        setCount(response.countItemsAll);
                const maxPageNumber = Math.max(1, Math.ceil(countItemsAll / 20));
        setMaxPageNumber(maxPageNumber);
        setMaxPageNumber(maxPageNumber);
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
          countItemsAll={countItemsSearch > 0 ? countItemsSearch : countItemsAll}
          searchText={searchQuery}
          numberPage={numberPage}
          handleDelete={handleDelete}
          //handleGet={productId ? handleGetProductResearches : handleGet}
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
      <div className="get-researches-page">
        <Research />
      </div>
    </Suspense>
  );
}