"use client";

import { useEffect, useState, Suspense } from "react";
import DataTable from "@/components/DataTableComponent/DataTable";
import { DeletePartiesAsync } from "@/services/PartyServices/DeletePartiesAsync";
import { useSearchParams } from "next/navigation";
import { GetPartiesForPageAsync } from "@/services/PartyServices/GetPartiesForPageAsync";
import { GetProductPartiesForPageAsync } from "@/services/ProductServices/GetProductPartiesForPageAsync";
import { ResearchModel } from "@/Models/ResearchModels/ResearchModel";
import { GetProductResearchesForPageAsync } from "@/services/ResearchServices.tsx/GetProductResearchesForPageAsync";

export default function PartyResearch() {
  const [data, setData] = useState<ResearchModel[]>([]);
  const [countItemsAll, setCount] = useState<number>(0);

  const [productId, setProductId] = useState<string | null>(null);

//   const handleDelete = async (
//     selectedItems: Set<ResearchModel>,
//     numberPage: number
//   ) => {
//     await DeletePartiesAsync(selectedItems);
//     const { parties, countItemsAll } = await GetPartiesForPageAsync(numberPage);
//     setData(parties);
//     setCount(countItemsAll);
//   };

//   const handleGet = async (numberPage: number) => {
//     const { parties, countItemsAll } = await GetPartiesForPageAsync(numberPage);
//     setData(parties);
//     setCount(countItemsAll);
//   };

  useEffect(() => {
    const PartyResearch = async () => {
      if (productId) {
        const researchResponse = await GetProductResearchesForPageAsync(
          productId,
          0
        );
        setData(researchResponse.researches);
        setCount(researchResponse.countItemsAll);
      }
    };

    PartyResearch();
  }, [productId]);

  function PartyResearch() {
    const searchParams = useSearchParams();
    const paramProductId = searchParams.get("productId");
    if (paramProductId) {
      setProductId(paramProductId);
    }

    return (
      <div>
        <DataTable
          data={data}
          tableName="Parties"
          countItemsAll={countItemsAll}
        //   handleDelete={handleDelete}
        //   handleGet={handleGet}
        />
      </div>
    );
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="get-party-page">
        <PartyResearch />
      </div>
    </Suspense>
  );
}
