"use client";

import { useEffect, useState } from "react";
import { UserModel } from "@/Models/UserModels/UserModel";
import DataTable from "@/components/DataTableComponent/DataTable";
import { GetUsersForPageAsync } from "@/services/UserServices/GetUsersForPageAsync";
import "./style.css";

export default function Users() {
  const [data, setData] = useState<UserModel[]>([]);
  const [filteredData, setFilterdData] = useState<UserModel[]>([]);
  const [countItemsAll, setCount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const numberPage = 0;

  const handleGet = async (numberPage: number) => {
    const { users, countItemsAll } = await GetUsersForPageAsync(numberPage);
      setData(users);
      setCount(countItemsAll);
  };

  const handleSearch = (searchQuery: string) => {
    setSearchQuery(searchQuery)
    const newFilteredData = data.filter(item =>
      item.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.surname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.patronymic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) 
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
        data={filteredData.length > 0 ? filteredData : data}
        searchText={searchQuery}
        tableName="Users"
        countItemsAll={countItemsAll}
        numberPage={numberPage}
        //handleGet={handleGet}
        handleSearch={handleSearch}
      />
    </div>
  );
}
