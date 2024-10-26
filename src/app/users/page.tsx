"use client";

import { useEffect, useState } from "react";
import { UserModel } from "@/Models/UserModels/UserModel";
import DataTable from "@/components/DataTableComponent/DataTable";
import { GetUsersForPageAsync } from "@/services/UserServices/GetUsersForPageAsync";
import "./style.css";

export default function Users() {
  const [data, setData] = useState<UserModel[]>([]);
  const [countItemsAll, setCount] = useState<number>(0);

  useEffect(() => {
    const getUsers = async () => {
      const { users, countItemsAll } = await GetUsersForPageAsync(0);
      setData(users);
      setCount(countItemsAll);
    };

    getUsers();
  }, []);

  return (
    <div className="users-page">
      <DataTable
        data={data}
        tableName="Users"
        countItemsAll={countItemsAll}
      />
    </div>
  );
}
