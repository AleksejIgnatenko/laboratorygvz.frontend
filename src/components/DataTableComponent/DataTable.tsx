"use client";

import React, { useState } from "react";
import "./DataTable.css";
import { DataFieldsEnum } from "../../Enums/DataFieldsEnum";
import { DeleteProductAsync } from "@/services/ProductServices/DeleteProductAsync";
// import { DeleteSuppliersAsync } from "@/services/SupplierServices/DeleteSuppliersAsync";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProductModel } from "@/Models/UserModels/ProductModel";
// import { GetSuppliersForPageAsync } from "@/services/SupplierServices/GetSuppliersForPageAsync";
// import { useRouter } from "next/navigation";

interface DataTableProps<T extends object> {
  data: T[];
  tableName: string;
  countItemsAll: number;
  handleDelete?: (
    selectedItems: Set<T>,
    numberPage: number
  ) => void;
  handleGet?: (
    numberPage: number
  ) => void;
}

type Order = 'asc' | 'desc';

interface SortConfig<T> {
  key: keyof T | undefined;
  direction: Order | undefined;
}

const DataTable = <T extends object>({ data, tableName, countItemsAll, handleDelete, handleGet }: DataTableProps<T>) => {
  const [sortConfig, setSortConfig] = useState<SortConfig<T>>({
    key: undefined,
    direction: undefined,
  });

  const router = useRouter();
  
  const [selectedCount, setSelectedCount] = useState(0);
  const [selectedItems, setSelectedItems] = useState<Set<T>>(new Set());
  // const router = useRouter();

  // useEffect(() => {
  //   const handleKeyDown = (event: KeyboardEvent) => {
  //     // Alt + A
  //     if (event.altKey && (event.key.toLowerCase() === 'a') || event.key.toLowerCase() === 'ф') {
  //       router.push(`/addPage?tableName=${tableName}`);
  //     }
  //   };
  //   window.addEventListener('keydown', handleKeyDown);

  //   return () => {
  //     window.removeEventListener('keydown', handleKeyDown);
  //   };
  // }, []);

  if (!data || data.length === 0) {
    return (
      <div className="no-data-containet">
        <h1 id="title" className="leading-none no-data-table-title">
              {tableName}
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

  const itemsPerPage = 20;
  let numberPage = 0;
  const maxPageNumber = Math.ceil(countItemsAll / itemsPerPage);
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
  const inputPageNumber = document.getElementById(
    "inputPageNumber"
  ) as HTMLInputElement;
  inputPageNumber.stepDown();
  numberPage = parseInt(inputPageNumber.value, 10) -1;

  if (handleGet) {
    handleGet(numberPage);
  }
};

const incrementValue = () => {
  const inputPageNumber = document.getElementById(
    "inputPageNumber"
  ) as HTMLInputElement;
  inputPageNumber.stepUp();
  numberPage = parseInt(inputPageNumber.value, 10) -1;

  if (handleGet) {
    handleGet(numberPage);
  }
};

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

  const onDeleteClick = () => {
      switch (tableName) {
      case "Manufacturers":
        if (handleDelete){
          handleDelete(selectedItems, numberPage);
          setSelectedItems(new Set());
          setSelectedCount(0);
        }
        break;
      
        case "Suppliers":
        if (handleDelete){
          handleDelete(selectedItems, numberPage);
          setSelectedItems(new Set());
          setSelectedCount(0);
        }
        break;

      case "Products":
        DeleteProductAsync(selectedItems as Set<ProductModel>);
        break;

      case "Researches":
        break;

      case "Experiments":
        break;

      default:
        break;
    }
  };

  return (
    <div className="data-table flex flex-column">
      <main className="flex flex-column gap-1 grow">
        <section className="flex gap-2 items-center justify-between">
          <div className="header-container">
            <h1 id="title" className="leading-none data-table-title">
              {tableName}
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
                {selectedCount} item{selectedCount !== 1 ? "s" : ""} selected
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
            <input
              className="search-input"
              type="search"
              placeholder="Search..."
            />
            <button className="button icon link">
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

            {tableName !== "Users" && (
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
                <th></th>
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
              </tr>
            </thead>
            <tbody>
              {sortedData().map((item, index) => (
                <tr key={index}>
                  <td>
                    <input
                      className="input checkbox"
                      type="checkbox"
                      onChange={() => handleCheckboxChange(item)}
                      checked={selectedItems.has(item)}
                    />
                  </td>
                  {columns.map(
                    (column) =>
                      column !== "id" && (
                        <td key={String(column)}>{String(item[column])}</td>
                      )
                  )}
                  <td>
                    <img
                      className="edit-img"
                      src="/images/pencil.png"
                      onClick={() => {
                        const queryString = new URLSearchParams({
                          tableName: tableName,
                          item: JSON.stringify(item), 
                        }).toString();
                        router.push(`/updatePage?${queryString}`);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <section className="flex items-center justify-between margin-bottom-30">
            <small className="muted pagination-info">
              1-20 / {countItemsAll} item(s)
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
                  defaultValue={1}
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