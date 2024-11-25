"use client";

import { useEffect, useState, Suspense } from "react";
import DataTable from "@/components/DataTableComponent/DataTable";
import { DeletePartiesAsync } from "@/services/PartyServices/DeletePartiesAsync";
import { PartyModel } from "@/Models/PartyModels/PartyModel";
import { useSearchParams } from "next/navigation";
import { GetPartiesForPageAsync } from "@/services/PartyServices/GetPartiesForPageAsync";
import { GetManufacturerPartiesForPageAsync } from "@/services/ManufacturerServices/GetManufacturerPartiesForPageAsync";
import { GetSupplierPartiesForPageAsync } from "@/services/SupplierServices/GetSupplierPartiesForPageAsync";
import { GetProductPartiesForPageAsync } from "@/services/ProductServices/GetProductPartiesForPageAsync";
import { GetUserPartiesForPageAsync } from "@/services/UserServices/GetUserPartiesForPageAsync";
import { ExportPartiesToExcelAsync } from "@/services/PartyServices/ExportPartiesToExcelAsync";
import { SearchPartiesAsync } from "@/services/PartyServices/SearchPartiesAsync";

export default function Researches() {
  const [data, setData] = useState<PartyModel[]>([]);
  const [filteredData, setFilterdData] = useState<PartyModel[]>([]);
  const [countItemsAll, setCount] = useState<number>(0);
  const [countItemsSearch, setCountItemsSearch] = useState<number>(0);
  const [manufacturerId, setManufacturerId] = useState<string | null>(null);
  const [supplierId, setSupplierId] = useState<string | null>(null);
  const [productId, setProductId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [numberPage, setNumberPage] = useState(0);
  const [maxPageNumber, setMaxPageNumber] = useState(0);

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
    const maxPageNumber = Math.max(1, Math.ceil(countItemsAll / 20));
    setMaxPageNumber(maxPageNumber);
  };

  const handleGetPartiesByManufacturerId = async (numberPage: number) => {
    if (manufacturerId) {
      const { parties, countItemsAll } =
        await GetManufacturerPartiesForPageAsync(manufacturerId, numberPage);
      setData(parties);
      setCount(countItemsAll);
      const maxPageNumber = Math.max(1, Math.ceil(countItemsAll / 20));
      setMaxPageNumber(maxPageNumber);
    }
  };

  const handleGetPartiesBySupplierId = async (numberPage: number) => {
    if (supplierId) {
      const { parties, countItemsAll } = await GetSupplierPartiesForPageAsync(
        supplierId,
        numberPage
      );
      setData(parties);
      setCount(countItemsAll);
      const maxPageNumber = Math.max(1, Math.ceil(countItemsAll / 20));
      setMaxPageNumber(maxPageNumber);
    }
  };

  const handleGetPartiesByProductId = async (numberPage: number) => {
    if (productId) {
      const { parties, countItemsAll } = await GetProductPartiesForPageAsync(
        productId,
        numberPage
      );
      setData(parties);
      setCount(countItemsAll);
      const maxPageNumber = Math.max(1, Math.ceil(countItemsAll / 20));
      setMaxPageNumber(maxPageNumber);
    }
  };

  const handleGetPartiesByUserId = async (numberPage: number) => {
    if (userId) {
      const { parties, countItemsAll } = await GetUserPartiesForPageAsync(
        userId,
        numberPage
      );
      setData(parties);
      setCount(countItemsAll);
      const maxPageNumber = Math.max(1, Math.ceil(countItemsAll / 20));
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

    const { parties, countItemsAll } = await SearchPartiesAsync(
      searchText,
      numberPage
    );

    if (parties.length > 0) {
      setFilterdData(parties);
      setCountItemsSearch(countItemsAll);
      const maxPageNumber = Math.max(1, Math.ceil(countItemsAll / 20));
      setMaxPageNumber(maxPageNumber);
    } else {
      setFilterdData([]);
      setCountItemsSearch(0);

      if (manufacturerId) {
        const response = await GetManufacturerPartiesForPageAsync(
          manufacturerId,
          0
        );
        setData(response.parties);
        setCount(response.countItemsAll);
        const maxPageNumber = Math.max(1, Math.ceil(countItemsAll / 20));
        setMaxPageNumber(maxPageNumber);
      } else if (supplierId) {
        const response = await GetSupplierPartiesForPageAsync(supplierId, 0);
        setData(response.parties);
        setCount(response.countItemsAll);
        const maxPageNumber = Math.max(1, Math.ceil(countItemsAll / 20));
        setMaxPageNumber(maxPageNumber);
      } else if (productId) {
        const response = await GetProductPartiesForPageAsync(productId, 0);
        setData(response.parties);
        setCount(response.countItemsAll);
        const maxPageNumber = Math.max(1, Math.ceil(countItemsAll / 20));
        setMaxPageNumber(maxPageNumber);
      } else if (userId) {
        const response = await GetUserPartiesForPageAsync(userId, 0);
        setData(response.parties);
        setCount(response.countItemsAll);
        const maxPageNumber = Math.max(1, Math.ceil(countItemsAll / 20));
        setMaxPageNumber(maxPageNumber);
      } else {
        const response = await GetPartiesForPageAsync(0);
        setData(response.parties);
        //setData(parties);
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

      if (manufacturerId) {
        const response = await GetManufacturerPartiesForPageAsync(
          manufacturerId,
          0
        );
        setData(response.parties);
        setCount(response.countItemsAll);
        const maxPageNumber = Math.max(1, Math.ceil(countItemsAll / 20));
        setMaxPageNumber(maxPageNumber);
      } else if (supplierId) {
        const response = await GetSupplierPartiesForPageAsync(supplierId, 0);
        setData(response.parties);
        setCount(response.countItemsAll);
        const maxPageNumber = Math.max(1, Math.ceil(countItemsAll / 20));
        setMaxPageNumber(maxPageNumber);
      } else if (productId) {
        const response = await GetProductPartiesForPageAsync(productId, 0);
        setData(response.parties);
        setCount(response.countItemsAll);
        const maxPageNumber = Math.max(1, Math.ceil(countItemsAll / 20));
        setMaxPageNumber(maxPageNumber);
      } else if (userId) {
        const response = await GetUserPartiesForPageAsync(userId, 0);
        setData(response.parties);
        setCount(response.countItemsAll);
        const maxPageNumber = Math.max(1, Math.ceil(countItemsAll / 20));
        setMaxPageNumber(maxPageNumber);
      } else {
        const response = await GetPartiesForPageAsync(0);
        setData(response.parties);
        //setData(parties);
        setCount(response.countItemsAll);
        const maxPageNumber = Math.max(1, Math.ceil(countItemsAll / 20));
        setMaxPageNumber(maxPageNumber);
      }
    }
  };

  const handleExportToExcel = async () => {
    await ExportPartiesToExcelAsync();
  };

  const decrementValue = () => {
    setNumberPage((prevPage) => {
      const newPage = Math.max(prevPage - 1, 0); // Уменьшаем номер страницы, но не меньше 0

      if (manufacturerId) {
        handleGetPartiesByManufacturerId(newPage); // Отправляем новый номер страницы + 1 на сервер
      } else if (supplierId) {
        handleGetPartiesBySupplierId(newPage);
      } else if (productId) {
        handleGetPartiesByProductId(newPage);
      } else if (userId) {
        handleGetPartiesByUserId(newPage);
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

      if (newPage < maxPageNumber) {
        if (manufacturerId) {
          handleGetPartiesByManufacturerId(newPage); // Отправляем новый номер страницы + 1 на сервер
        } else if (supplierId) {
          handleGetPartiesBySupplierId(newPage);
        } else if (productId) {
          handleGetPartiesByProductId(newPage);
        } else if (userId) {
          handleGetPartiesByUserId(newPage);
        } else if (searchQuery !== "") {
          handleSearch(searchQuery, newPage);
        } else {
          handleGet(newPage);
        }
      }
      return newPage; // Обновляем состояние
    });
  };

  // const parties: PartyModel[] = [
  //   {
  //     id: "1",
  //     batchNumber: "BN001",
  //     dateOfReceipt: "01.11.2024",
  //     productName: "Product A",
  //     supplierName: "Supplier A",
  //     manufacturerName: "Manufacturer A",
  //     batchSize: "100",
  //     sampleSize: "10",
  //     ttn: "TTN001",
  //     documentOnQualityAndSafety: "Doc001",
  //     testReport: "Report001",
  //     dateOfManufacture: "01.10.2024",
  //     expirationDate: "01.10.2025",
  //     packaging: "Box",
  //     marking: "Mark001",
  //     result: "Passed",
  //     responsible: "John Doe",
  //     note: "First batch"
  //   },
  //   {
  //     id: "2",
  //     batchNumber: "BN002",
  //     dateOfReceipt: "05.11.2024",
  //     productName: "Product B",
  //     supplierName: "Supplier B",
  //     manufacturerName: "Manufacturer B",
  //     batchSize: "200",
  //     sampleSize: "20",
  //     ttn: "TTN002",
  //     documentOnQualityAndSafety: "Doc002",
  //     testReport: "Report002",
  //     dateOfManufacture: "05.10.2024",
  //     expirationDate: "05.10.2025",
  //     packaging: "Bag",
  //     marking: "Mark002",
  //     result: "Passed",
  //     responsible: "Jane Smith",
  //     note: "Second batch"
  //   },
  //   {
  //     id: "3",
  //     batchNumber: "BN003",
  //     dateOfReceipt: "10.10.2025",
  //     productName: "Product C",
  //     supplierName: "Supplier C",
  //     manufacturerName: "Manufacturer C",
  //     batchSize: "150",
  //     sampleSize: "15",
  //     ttn: "TTN003",
  //     documentOnQualityAndSafety: "Doc003",
  //     testReport: "Report003",
  //     dateOfManufacture: "10.10.2025",
  //     expirationDate: "10.10.2025",
  //     packaging: "Container",
  //     marking: "Mark003",
  //     result: "Pending",
  //     responsible: "Alice Johnson",
  //     note: "Third batch"
  //   }
  // ];

  useEffect(() => {
    const getParties = async () => {
      if (manufacturerId) {
        const response = await GetManufacturerPartiesForPageAsync(
          manufacturerId,
          0
        );
        setData(response.parties);
        setCount(response.countItemsAll);
        const maxPageNumber = Math.max(1, Math.ceil(countItemsAll / 20));
        setMaxPageNumber(maxPageNumber);
      } else if (supplierId) {
        const response = await GetSupplierPartiesForPageAsync(supplierId, 0);
        setData(response.parties);
        setCount(response.countItemsAll);
        const maxPageNumber = Math.max(1, Math.ceil(countItemsAll / 20));
        setMaxPageNumber(maxPageNumber);
      } else if (productId) {
        const response = await GetProductPartiesForPageAsync(productId, 0);
        setData(response.parties);
        setCount(response.countItemsAll);
        const maxPageNumber = Math.max(1, Math.ceil(countItemsAll / 20));
        setMaxPageNumber(maxPageNumber);
      } else if (userId) {
        const response = await GetUserPartiesForPageAsync(userId, 0);
        setData(response.parties);
        setCount(response.countItemsAll);
        const maxPageNumber = Math.max(1, Math.ceil(countItemsAll / 20));
        setMaxPageNumber(maxPageNumber);
      } else {
        const response = await GetPartiesForPageAsync(0);
        setData(response.parties);
        //setData(parties);
        setCount(response.countItemsAll);
        const maxPageNumber = Math.max(1, Math.ceil(countItemsAll / 20));
        setMaxPageNumber(maxPageNumber);
      }
    };

    getParties();
  }, [manufacturerId, supplierId, productId, userId]);

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

    const paramUserId = searchParams.get("userId");
    if (paramUserId) {
      setUserId(paramUserId);
    }

    return (
      <div>
        <DataTable
          data={filteredData.length > 0 ? filteredData : data}
          tableName="Parties"
          searchText={searchQuery}
          countItemsAll={countItemsSearch > 0 ? countItemsSearch : countItemsAll}
          numberPage={numberPage}
          handleDelete={handleDelete}
          // handleGet={manufacturerId ? handleGetPartiesByManufacturerId
          //   : supplierId ? handleGetPartiesBySupplierId
          //   : productId ? handleGetPartiesByProductId
          //   : userId ? handleGetPartiesByUserId
          //   : handleGet
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
      <div className="get-parties-page">
        <Party />
      </div>
    </Suspense>
  );
}
