import React from "react";
import "./DataTable.css";

export interface Product {
  id: number;
  dateOfReceipt: string;
  name: string;
  providerId: string;
  batchSize: number;
  sampleSize: number;
  ttn: number;
  documentQuality: number;
  testReport: string;
  experements: string;
}

export interface Provider {
  id: number;
  name: string;
}

interface DataTableProps<T extends object> {
  data: T[];
}

const DataTable = <T extends object>({ data }: DataTableProps<T>) => {
  if (!data || data.length === 0) {
    return <p>No data available</p>;
  }

  const columns: (keyof T)[] = Object.keys(data[0]) as (keyof T)[];

  return (
    <div className="data-table flex flex-column">
      <main className="flex flex-column gap-1 grow">
        <section className="flex gap-2 items-center justify-between">
          <div id="bulkActions" className="bulk-actions hidden items-center">
            <i className="icon">
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

            <small id="labelItemsSelected">0 items selected</small>

            <i className="icon">
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

          <h1 id="title" className="leading-none data-table-title">
            Contacts
          </h1>

          <div className="flex gap-1 items-center action-buttons">
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

            <button className="addButton icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="#fdfdfe"
                viewBox="0 0 256 256"
              >
                <path d="M228,128a12,12,0,0,1-12,12H140v76a12,12,0,0,1-24,0V140H40a12,12,0,0,1,0-24h76V40a12,12,0,0,1,24,0v76h76A12,12,0,0,1,228,128Z"></path>
              </svg>
            </button>
          </div>
        </section>

        <section className="flex flex-column gap-2">
          <table>
            <thead>
              <tr className="no-hover">
                <th></th>
                {columns.map((column) => (
                  <th key={String(column)}>
                    <span>{String(column)}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>
                    <input className="input checkbox" type="checkbox" />
                  </td>
                  {columns.map((column) => (
                    <td key={String(column)}>{String(item[column])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* <section className="flex items-center justify-between">
            <small className="muted">1-10 / 123 items</small>

            <div className="flex gap-2 items-center">
              <div className="flex gap-05 items-center">
                <input
                  className="input number small"
                  readOnly
                  type="number"
                  value="1"
                />
                <small className="muted">/</small>
                <small className="muted">13 pages</small>
              </div>

              <div className="flex gap-05 items-center">
                <button className="button icon link">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="#247783"
                    viewBox="0 0 256 256"
                  >
                    <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path>
                  </svg>
                </button>

                <button className="button icon link">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="#247783"
                    viewBox="0 0 256 256"
                  >
                    <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </section> */}
        </section>
      </main>
    </div>
  );
};

export default DataTable;
