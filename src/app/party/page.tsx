"use client";

import { useEffect, useState, Suspense } from "react";
import DataTable from "@/components/DataTableComponent/DataTable";
import { DeletePartiesAsync } from "@/services/PartyServices/DeletePartiesAsync";
import { PartyModel } from "@/Models/PartyModels/PartyModel";
import { GetPartiesForPageAsync } from "@/services/PartyServices/GetPartiesForPageAsync";

export default function Researches() {
  const [data, setData] = useState<PartyModel[]>([]);
  const [countItemsAll, setCount] = useState<number>(0);

  const handleDelete = async (
    selectedItems: Set<PartyModel>,
    numberPage: number
  ) => {
    await DeletePartiesAsync(selectedItems);
    const { parties, countItemsAll } = await GetPartiesForPageAsync(
      numberPage
    );
    setData(parties);
    setCount(countItemsAll);
  };

  const handleGet = async (numberPage: number) => {
    const { parties, countItemsAll } = await GetPartiesForPageAsync(
      numberPage
    );
    setData(parties);
    setCount(countItemsAll);
  };

  useEffect(() => {
    const getParties = async () => {
        const response = await GetPartiesForPageAsync(0);
        setData(response.parties);
        setCount(response.countItemsAll);
    };

    getParties();
  }, []); 

  function Party() {
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