"use client";

import { useEffect, useState } from "react";
import { UserModel } from "@/Models/UserModels/UserModel";
import DataTable from "@/components/DataTableComponent/DataTable";
import { GetUsersForPageAsync } from "@/services/UserServices/GetUsersForPageAsync";
import "./style.css";

export default function Users() {
  // const users: UserModel[] = [
  //   {
  //     id: "1",
  //     role: "admin",
  //     surname: "Иванов",
  //     userName: "Иван",
  //     patronymic: "Иванович",
  //     email: "ivan.ivanov@example.com"
  //   },
  //   {
  //     id: "2",
  //     role: "manager",
  //     surname: "Петров",
  //     userName: "Петр",
  //     patronymic: "Петрович",
  //     email: "petr.petrov@example.com"
  //   },
  //   {
  //     id: "3",
  //     role: "user",
  //     surname: "Сидоров",
  //     userName: "Сидор",
  //     patronymic: "Сидорович",
  //     email: "sidor.sidorov@example.com"
  //   }
  // ];

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
        searchText=""
        tableName="Users"
        countItemsAll={countItemsAll}
      />
    </div>
  );
}
