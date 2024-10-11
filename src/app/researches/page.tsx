import { useEffect } from "react";
import DataTable from "@/components/DataTableComponent/DataTable";
import { Product } from "@/components/DataTableComponent/DataTable";
import "./style.css";

export default function Researches() {
    const data: Product[] = [
        {
            id: 12,
            dateOfReceipt: '00.00.0000',
            name: 'Сахар',
            providerId: 'Поставщик',
            batchSize: 10000,
            sampleSize: 0.1,
            ttn: 111111,
            documentQuality: 111111,
            testReport: 'все yt гут',
            experements: '1',
        },
        {
            id: 13,
            dateOfReceipt: '01.01.2024',
            name: 'Соль',
            providerId: 'Новый Поставщик',
            batchSize: 5000,
            sampleSize: 0.5,
            ttn: 222222,
            documentQuality: 222222,
            testReport: 'все отлично',
            experements: '2',
        },
    ];
    return (
        <div className="researches-page">
            <DataTable data={data} />
        </div>
    );
}