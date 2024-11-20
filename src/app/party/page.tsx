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

export default function Researches() {
  const [data, setData] = useState<PartyModel[]>([]);
  const [countItemsAll, setCount] = useState<number>(0);

  const [manufacturerId, setManufacturerId] = useState<string | null>(null);
  const [supplierId, setSupplierId] = useState<string | null>(null);
  const [productId, setProductId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

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
      } else if (supplierId) {
        const response = await GetSupplierPartiesForPageAsync(supplierId, 0);
        setData(response.parties);
        setCount(response.countItemsAll);
      } else if (productId) {
        const response = await GetProductPartiesForPageAsync(productId, 0);
        setData(response.parties);
        setCount(response.countItemsAll);
      } else if (userId) {
        const response = await GetUserPartiesForPageAsync(userId, 0);
        setData(response.parties);
        setCount(response.countItemsAll);
      } else {
        const response = await GetPartiesForPageAsync(0);
        setData(response.parties);
        setCount(response.countItemsAll);
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
      <div className="get-parties-page">
        <Party />
      </div>
    </Suspense>
  );
}
