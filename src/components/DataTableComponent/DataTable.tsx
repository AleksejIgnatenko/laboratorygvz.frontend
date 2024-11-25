"use client";

import React, { useState, useEffect } from "react";
import "./DataTable.css";
import { DataFieldsEnum } from "../../Enums/DataFieldsEnum";
// import { DeleteSuppliersAsync } from "@/services/SupplierServices/DeleteSuppliersAsync";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProductModel } from "@/Models/ProductModels/ProductModel";
import { SupplierModel } from "@/Models/SupplierModels/SupplierModel";
import { IsManagerAsync } from "@/services/UserServices/IsManagerAsync ";
import { IsAdminAsync } from "@/services/UserServices/IsAdminAsync ";
import { UserModel } from "@/Models/UserModels/UserModel";
import { RoleEnum } from "@/Enums/RoleEnum";
import { ManufacturerModel } from "@/Models/ManufacturerModels/ManufacturerModel";
import { PartyModel } from "@/Models/PartyModels/PartyModel";
import { ResearchModel } from "@/Models/ResearchModels/ResearchModel";
import { CreationOfAQualityAndSafetyCertificateAsync } from "@/services/PartyServices/CreationOfAQualityAndSafetyCertificateAsync";
// import { GetSuppliersForPageAsync } from "@/services/SupplierServices/GetSuppliersForPageAsync";

interface DataTableProps<T extends object> {
  data: T[];
  tableName: string;
  countItemsAll: number;
  searchText: string;
  numberPage: number;
  maxPageNumber?: number; //сделать обязательным
  handleDelete?: (selectedItems: Set<T>, numberPage: number) => void;
  handleSearch?: (searchQuery: string, numberPage: number) => void;
  handleExportToExcel?: () => void; //сделать обязательным
  handleDecrementValue?: () => void; //сделать обязательным
  handleIncrementValue?: () => void; //сделать обязательным
}

type Order = 'asc' | 'desc';

interface SortConfig<T> {
  key: keyof T | undefined;
  direction: Order | undefined;
}

const DataTable = <T extends object>({ data, tableName, countItemsAll, searchText, numberPage, maxPageNumber, handleDelete, handleSearch, handleExportToExcel, handleDecrementValue, handleIncrementValue }: DataTableProps<T>) => {
  const [sortConfig, setSortConfig] = useState<SortConfig<T>>({
    key: undefined,
    direction: undefined,
  });

  const router = useRouter();

  const [selectedCount, setSelectedCount] = useState(0);
  const [selectedItems, setSelectedItems] = useState<Set<T>>(new Set());
  const [titleName, setTitleName] = useState("");
  const [searchQuery, setSearchQuery] = useState('');
  const [isManager, setIsManager] = useState(false);
  // const router = useRouter();

  useEffect(() => {
    const setTitles = async () => {
      switch (tableName) {
        case "Manufacturers":
          setTitleName("Производители");
          setSearchQuery(searchText);
          break;

        case "Suppliers":
          setTitleName("Поставщики");
          setSearchQuery(searchText);
          break;

        case "Products":
          setTitleName("Продукты");
          setSearchQuery(searchText);
          break;

        case "Researches":
          setTitleName("Исследования");
          setSearchQuery(searchText);
          break;

        case "ResearchResults":
          setTitleName("Результаты исследований");
          setSearchQuery(searchText);
          break;

        case "Parties":
          setTitleName("Партии");
          setSearchQuery(searchText);
          break;

        case "Users":
          setTitleName("Пользователи");
          setSearchQuery(searchText);
          const userIsManager = await IsManagerAsync();
          if (userIsManager) {
            setIsManager(userIsManager);
          } else {
            const userIsAdmin = await IsAdminAsync();
            if (!userIsAdmin) {
              router.push("/");
            }
          }
          break;

        case "Experiments":
          break;

        default:
          break;
      }
    };

    setTitles();

  }, [tableName]);

  if (!data || data.length === 0) {
    return (
      <div className="no-data-containet">
        <h1 id="title" className="leading-none no-data-table-title">
          {titleName}
        </h1>
        <p className="no-data-message">Нет доступных данных</p>
        <Link className="addLink icon" href={`/addPage?tableName=${tableName}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="#fdfdfe"
            viewBox="0 0 256 256"
          >
            <path d="M228,128a12,12,0,0,1-12,12H140v76a12,12,0,0,1-24,0V140H40a12,12,0,0,1,0-24h76V40a12,12,0,0,1,24,0v76h76A12,12,0,0,1,228,128Z"></path>
          </svg>
        </Link>
      </div>
    );
  }

  // const itemsPerPage = 20;
  // let numberPage = 0;
  const columns: (keyof T)[] = Object.keys(data[0]) as (keyof T)[];

  const sortedData = () => {
    const sortableItems = [...data];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key as keyof T] < b[sortConfig.key as keyof T]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key as keyof T] > b[sortConfig.key as keyof T]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  };

  const requestSort = (key: keyof T) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const decrementValue = () => {
    if(handleDecrementValue) {
    handleDecrementValue();
    }
  };

  const incrementValue = () => {
   if(handleIncrementValue) {
    handleIncrementValue();
   }
  };

  const onDeleteClick = () => {
    if (handleDelete) {
      handleDelete(selectedItems, numberPage);
      setSelectedItems(new Set());
      setSelectedCount(0);
    }
  }

  const handleCheckboxChange = (item: T) => {
    const newSelectedItems = new Set(selectedItems);
    if (newSelectedItems.has(item)) {
      newSelectedItems.delete(item);
    } else {
      newSelectedItems.add(item);
    }
    setSelectedCount(newSelectedItems.size);
    setSelectedItems(newSelectedItems);
  };

  const handleDeselectAll = () => {
    setSelectedItems(new Set());
    setSelectedCount(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
  };

  const handleSearchByTableChange = () => {
    const inputElement = document.getElementById('search-input') as HTMLInputElement;
    if (inputElement) {
      const query = inputElement.value;
      if (handleSearch) {
        handleSearch(query,numberPage);
      }
    }
  };

  const handleExportToExcelClick = async () => {
    if (handleExportToExcel) {
      await handleExportToExcel();
    }
  };

const handleCreationOfAQualityAndSafetyCertificateAsync = async (partyId: string) => {
    await CreationOfAQualityAndSafetyCertificateAsync(partyId);
};


  // const handleDelete = async () => {
  //   switch (tableName) {
  //     case "Suppliers":
  //       DeleteSuppliersAsync(selectedItems as Set<SupplierModel>);
  //       const { suppliers, countItemsAll } = await GetSuppliersForPageAsync(numberPage);
  //       console.log(countItemsAll);
  //       data = suppliers as T[];
  //       break;

  //     case "Products":
  //       DeleteProductAsync(selectedItems as Set<ProductModel>);
  //       break;

  //     case "Researches":
  //       break;

  //     case "Experiments":
  //       break;

  //     default:
  //       break;
  //   }
  // };

  return (
    <div className="data-table flex flex-column">
      <main className="flex flex-column gap-1 grow">
        <section className="flex gap-2 items-center justify-between">
          <div className="header-container">
            <h1 id="title" className="leading-none data-table-title">
              {titleName}
            </h1>
            <div
              id="bulkActions"
              className={`bulk-actions ${
                selectedCount > 0 ? "" : "hidden"
              } items-center`}
            >
              <i className="icon" onClick={onDeleteClick}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                >
                  <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path>
                </svg>
              </i>

              <small id="labelItemsSelected">
                {selectedCount} элемент(а)(ов)
              </small>

              <i className="icon" onClick={handleDeselectAll}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                >
                  <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
                </svg>
              </i>
            </div>
          </div>

          <div className="flex gap-1 items-center action-buttons">
            <img
              className="img-style"
              src="/images/excel.png"
              alt="Экспорт в Excel"
              onClick={handleExportToExcelClick}
            />
            <input
              id="search-input"
              className="search-input"
              type="search"
              placeholder="Поиск..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button
              className="button icon link"
              onClick={handleSearchByTableChange}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
              </svg>
            </button>

            <button className="button icon link">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M32,80a8,8,0,0,1,8-8H72a8,8,0,0,1,0,16H40A8,8,0,0,1,32,80Zm184,88H176V152a8,8,0,0,0-16,0v48a8,8,0,0,0,16,0V184h40a8,8,0,0,0,0-16Zm-80,0H40a8,8,0,0,0,0,16h96a8,8,0,0,0,0-16Zm-32-56a8,8,0,0,0,8-8V88H216a8,8,0,0,0,0-16H112V56a8,8,0,0,0-16,0v48A8,8,0,0,0,104,112Z"></path>
              </svg>
            </button>

            {tableName !== "Users" && tableName !== "ResearchResults" && (
              <Link
                className="addLink icon"
                href={`/addPage?tableName=${tableName}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="#fdfdfe"
                  viewBox="0 0 256 256"
                >
                  <path d="M228,128a12,12,0,0,1-12,12H140v76a12,12,0,0,1-24,0V140H40a12,12,0,0,1,0-24h76V40a12,12,0,0,1,24,0v76h76A12,12,0,0,1,228,128Z"></path>
                </svg>
              </Link>
            )}
          </div>
        </section>

        <section className="flex flex-column gap-2">
          <table>
            <thead>
              <tr className="no-hover">
                {tableName !== "Users" && <th></th>}
                {columns.map(
                  (column) =>
                    column !== "id" && (
                      <th
                        key={String(column)}
                        onClick={() => requestSort(column)}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="column-header">
                          <span>
                            {
                              DataFieldsEnum[
                                column as keyof typeof DataFieldsEnum
                              ]
                            }
                          </span>
                          {sortConfig.key === column && (
                            <img
                              className="sort-chevron"
                              src={
                                sortConfig.direction === "asc"
                                  ? "/images/up-chevron.png"
                                  : "/images/down-chevron.png"
                              }
                              alt="Sort direction"
                            />
                          )}
                        </div>
                      </th>
                    )
                )}
                {tableName === "Manufacturers" && (
                  <>
                    <th>
                      <span>Партии</span>
                    </th>
                  </>
                )}
                {tableName === "Suppliers" && (
                  <>
                    <th>
                      <span>Производители</span>
                    </th>
                    <th>
                      <span>Продукты</span>
                    </th>
                    <th>
                      <span>Партии</span>
                    </th>
                  </>
                )}
                {tableName === "Products" && (
                  <>
                    <th>
                      <span>Поставщики</span>
                    </th>
                    <th>
                      <span>Исследования</span>
                    </th>
                    <th>
                      <span>Партии</span>
                    </th>
                  </>
                )}
                {tableName === "Researches" && (
                  <>
                    <th>
                      <span>Результаты исследований</span>
                    </th>
                  </>
                )}
                {tableName === "Parties" && (
                  <>
                    <th>
                      <span>Результаты исследований</span>
                    </th>
                  </>
                )}
                {tableName === "Users" && (
                  <>
                    <th>
                      <span>Партии</span>
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {sortedData().map((item, index) => (
                <tr key={index}>
                  {tableName !== "Users" && (
                    <td>
                      <input
                        className="input checkbox"
                        type="checkbox"
                        onChange={() => handleCheckboxChange(item)}
                        checked={selectedItems.has(item)}
                      />
                    </td>
                  )}
                  {columns.map(
                    (column) =>
                      column !== "id" && (
                        <td key={String(column)}>{String(item[column])}</td>
                      )
                  )}
                  {tableName === "Manufacturers" && (
                    <>
                      <td>
                        <Link
                          href={`/party?manufacturerId=${
                            (item as ManufacturerModel).id
                          }`}
                          className="data-table-link-style"
                        >
                          Список партий
                        </Link>
                      </td>
                    </>
                  )}
                  {tableName === "Suppliers" && (
                    <>
                      <td>
                        <Link
                          href={`/manufacturers?supplierId=${
                            (item as SupplierModel).id
                          }`}
                          className="data-table-link-style"
                        >
                          Список производителей
                        </Link>
                      </td>
                      <td>
                        <Link
                          href={`/products?supplierId=${
                            (item as SupplierModel).id
                          }`}
                          className="data-table-link-style"
                        >
                          Список продуктов
                        </Link>
                      </td>
                      <td>
                        <Link
                          href={`/party?supplierId=${
                            (item as SupplierModel).id
                          }`}
                          className="data-table-link-style"
                        >
                          Список партий
                        </Link>
                      </td>
                    </>
                  )}
                  {tableName === "Products" && (
                    <>
                      <td>
                        <Link
                          href={`/suppliers?productId=${
                            (item as ProductModel).id
                          }`}
                          className="data-table-link-style"
                        >
                          Список поставщиков
                        </Link>
                      </td>
                      <td>
                        <Link
                          href={`/researches?productId=${
                            (item as ProductModel).id
                          }`}
                          className="data-table-link-style"
                        >
                          Список исследований
                        </Link>
                      </td>
                      <td>
                        <Link
                          href={`/party?productId=${(item as ProductModel).id}`}
                          className="data-table-link-style"
                        >
                          Список партий
                        </Link>
                      </td>
                    </>
                  )}
                  {tableName === "Researches" && (
                    <>
                      <td>
                        <Link
                          href={`/researchResult?researchId=${
                            (item as ResearchModel).id
                          }`}
                          className="data-table-link-style"
                        >
                          Результаты исследования
                        </Link>
                      </td>
                    </>
                  )}
                  {tableName === "Parties" && (
                    <>
                      <td>
                        <Link
                          href={`/researchResult?partyId=${
                            (item as PartyModel).id
                          }`}
                          className="data-table-link-style"
                        >
                          Исследования партии
                        </Link>
                      </td>
                    </>
                  )}
                  {tableName === "Users" && (
                    <>
                      <td>
                        <Link
                          href={`/party?userId=${(item as UserModel).id}`}
                          className="data-table-link-style"
                        >
                          Список партий
                        </Link>
                      </td>
                    </>
                  )}
                  <td>
                    {tableName === "Users" &&
                      (item as UserModel).role !== RoleEnum.Admin &&
                      !(
                        (item as UserModel).role === RoleEnum.Manager &&
                        isManager
                      ) && (
                        <img
                          className="img-style"
                          src="/images/pencil.png"
                          onClick={() => {
                            const queryString = new URLSearchParams({
                              tableName: tableName,
                              item: JSON.stringify(item),
                            }).toString();
                            router.push(`/updatePage?${queryString}`);
                          }}
                        />
                      )}
                    {tableName === "Parties" && (
                      <>
                        <img
                          className="img-style"
                          src="/images/pencil.png"
                          onClick={() => {
                            const queryString = new URLSearchParams({
                              tableName: tableName,
                              item: JSON.stringify(item),
                            }).toString();
                            router.push(`/updatePage?${queryString}`);
                          }}
                        />
                        <img
                          className="img-style"
                          src="/images/word.png"
                          onClick={() => handleCreationOfAQualityAndSafetyCertificateAsync((item as PartyModel).id)}
                        />
                      </>
                    )}
                    {tableName !== "Users" && tableName !== "Parties" && (
                      <img
                        className="img-style"
                        src="/images/pencil.png"
                        onClick={() => {
                          const queryString = new URLSearchParams({
                            tableName: tableName,
                            item: JSON.stringify(item),
                          }).toString();
                          router.push(`/updatePage?${queryString}`);
                        }}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <section className="flex items-center justify-between margin-bottom-30">
            <small className="muted pagination-info">
              1-20 / {countItemsAll} элемент(а)(ов)
            </small>

            <div className="flex gap-2 items-center">
              <div className="flex gap-05 items-center">
                <input
                  className="input number small"
                  type="number"
                  // readOnly
                  id="inputPageNumber"
                  min={1}
                  max={maxPageNumber}
                  value={numberPage + 1}
                />
                <small className="muted">/</small>
                <small className="muted">{maxPageNumber}</small>
              </div>

              <div className="flex gap-05 items-center">
                <button
                  className="prevPageTable button icon link"
                  onClick={decrementValue}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 256 256"
                    className="icon-svg"
                  >
                    <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path>
                  </svg>
                </button>

                <button
                  className="nextPageTable button icon link"
                  onClick={incrementValue}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 256 256"
                    className="icon-svg"
                  >
                    <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
};

export default DataTable;