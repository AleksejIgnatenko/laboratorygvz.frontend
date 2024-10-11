import React from 'react';
import "./DataTable.css"
import 'bootstrap/dist/css/bootstrap.min.css'; // Импортируем Bootstrap

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
    experements: string
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
        <div className="container">
            <div className="main-sub row align-items-center ">
            </div>
            <div className="table-container mt-5">
                <div className="mb-2">
                    <h2>Your form tasks</h2>
                    <small className="text-secondary">View all form tasks assigned to your group.</small>
                </div>
                <table id="mytable" className="table align-middle mb-10 bg-white">
                    <thead className="bg-light">
                        <tr className="header-row">
                            {columns.map((col) => (
                                <th key={String(col)}>{String(col)}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index}>
                                {columns.map((col) => (
                                    <td key={String(col)}>
                                        <div className="d-flex align-items-center">
                                            <p className="fw-bold mb-2">{String(item[col])}</p>
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DataTable;