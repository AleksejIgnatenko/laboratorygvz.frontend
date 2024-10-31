"use client";

import { useEffect, useState } from "react";
import { ManufacturerModel } from "@/Models/ManufactureModels/ManufacturerModel";
import DataTable from "@/components/DataTableComponent/DataTable";
import { GetManufacturersForPageAsync } from "@/services/ManufacturerServices/GetManufacturersForPageAsync";
import { DeleteManufacturersAsync } from "@/services/ManufacturerServices/DeleteManufacturersAsync";

export default function Manufacturers() {
  const [data, setData] = useState<ManufacturerModel[]>([]);
  const [countItemsAll, setCount] = useState<number>(0);

  const handleDelete = async (
    selectedItems: Set<ManufacturerModel>,
    numberPage: number
  ) => {
    console.log(selectedItems);
    await DeleteManufacturersAsync(selectedItems);
    const { manufacturers, countItemsAll } = await GetManufacturersForPageAsync(
      numberPage
    );
    setData(manufacturers);
    setCount(countItemsAll);
  };

  const handleGet = async (numberPage: number) => {
    const { manufacturers, countItemsAll } = await GetManufacturersForPageAsync(
      numberPage
    );
    setData(manufacturers);
    setCount(countItemsAll);
  };

  const manufacturerss: ManufacturerModel[] = [
    {
      id: "1",
      manufacturerName: "Manufacturer 1",
    },
    {
      id: "2",
      manufacturerName: "Manufacturer 2",
    },
    {
      id: "3",
      manufacturerName: "Manufacturer 3",
    },
  ];

  useEffect(() => {
    const getManufacturers = async () => {
      const { manufacturers, countItemsAll } = await GetManufacturersForPageAsync(0);
      setData(manufacturers);
      setCount(countItemsAll);
    };

    getManufacturers();
  }, []);

  return (
    <div className="getManufacturers-page">
      <DataTable
        data={manufacturerss}
        tableName="Manufacturers"
        countItemsAll={countItemsAll}
        handleDelete={handleDelete}
        handleGet={handleGet}
      />
    </div>
  );
}
