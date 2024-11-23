"use client";

import { useEffect, useState } from "react";
import { UserModel } from "@/Models/UserModels/UserModel";
import DataTable from "@/components/DataTableComponent/DataTable";
import { GetUsersForPageAsync } from "@/services/UserServices/GetUsersForPageAsync";
import "./style.css";
import { SearchUsersAsync } from "@/services/UserServices/SearchUsersAsync";
import { ExportUsersToExcelAsync } from "@/services/UserServices/ExportUsersToExcelAsync";

export default function Users() {
  const [data, setData] = useState<UserModel[]>([]);
  const [filteredData, setFilterdData] = useState<UserModel[]>([]);
  const [countItemsAll, setCount] = useState<number>(0);
  const [countItemsSearch, setCountItemsSearch] = useState<number>(0); 
  const [searchQuery, setSearchQuery] = useState('');
  const [numberPage, setNumberPage] = useState(0);
  const [maxPageNumber, setMaxPageNumber] = useState(0);

  const handleGet = async (numberPage: number) => {
    const { users, countItemsAll } = await GetUsersForPageAsync(numberPage);
      setData(users);
      setCount(countItemsAll);
      const maxPageNumber = Math.max(1, Math.ceil(countItemsAll / 20));
      setMaxPageNumber(maxPageNumber);
  };

  const handleSearch = async (searchText: string, numberPage: number) => {
    if (searchText !== "") {
      if (searchQuery === "") {
        numberPage = 0;
        setNumberPage(numberPage);
      }
      setSearchQuery(searchText);

      const { users, countItemsAll } = await SearchUsersAsync(
        searchText,
        numberPage
      );

      if (users.length > 0) {
        setFilterdData(users);
        setCountItemsSearch(countItemsAll);
        const maxPageNumber = Math.max(1, Math.ceil(countItemsAll / 20));
        setMaxPageNumber(maxPageNumber);
      } else {
        setFilterdData([]);
        setCountItemsSearch(0);

        const { users, countItemsAll } = await GetUsersForPageAsync(0);
        setData(users);
        setCount(countItemsAll);
        const maxPageNumber = Math.max(1, Math.ceil(countItemsAll / 20));
        setMaxPageNumber(maxPageNumber);

        setTimeout(() => {
          alert("В результате поиска совпадения не были найдены.");
        }, 500);
      }
    } else {
      setSearchQuery(searchText);
      setFilterdData([]);
      setCountItemsSearch(0);

      const { users, countItemsAll } = await GetUsersForPageAsync(0);
      setData(users);
      setCount(countItemsAll);
      const maxPageNumber = Math.max(1, Math.ceil(countItemsAll / 20));
      setMaxPageNumber(maxPageNumber);
    }
  };

  const handleExportToExcel = async () => {
    await ExportUsersToExcelAsync();
  };

  const decrementValue = () => {
    setNumberPage((prevPage) => {
      const newPage = Math.max(prevPage - 1, 0); // Уменьшаем номер страницы, но не меньше 0
      handleGet(newPage);
      return newPage; // Обновляем состояние
    });
  };

  const incrementValue = () => {
    setNumberPage((prevPage) => {
      const newPage = prevPage + 1; // Увеличиваем номер страницы

      if (newPage <= maxPageNumber) {
        handleGet(newPage);
        return newPage; // Обновляем состояние
      }
      return prevPage;
    });
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
      const maxPageNumber = Math.max(1, Math.ceil(countItemsAll / 20));
      setMaxPageNumber(maxPageNumber);
    };

    getUsers();
  }, []);

  return (
    <div className="users-page">
      <DataTable
        data={filteredData.length > 0 ? filteredData : data}
        searchText={searchQuery}
        tableName="Users"
        countItemsAll={countItemsSearch > 0 ? countItemsSearch : countItemsAll}
        numberPage={numberPage}
        //handleGet={handleGet}
        handleSearch={handleSearch}
        handleExportToExcel={handleExportToExcel}
        handleDecrementValue={decrementValue}
        handleIncrementValue={incrementValue}
        maxPageNumber={maxPageNumber}
      />
    </div>
  );
}
