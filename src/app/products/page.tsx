import DataTable from "@/components/DataTableComponent/DataTable";
import { ProductModel } from "@/app/Models/ProductModel";
import "./style.css";

export default function Products() {
    const data: ProductModel[] = [
      {
        id: 1,
        dateOfReceipt: "00.00.0000",
        productName: "b",
        providerId: "1",
        providerName: "C",
        batchSize: 10000,
        sampleSize: 0.1,
        ttn: 111111,
        documentQuality: 111111,
        testReport: "все yt гут",
      },
      {
        id: 2,
        dateOfReceipt: "01.01.2024",
        productName: "c",
        providerId: "2",
        providerName: "A",
        batchSize: 5000,
        sampleSize: 0.5,
        ttn: 222222,
        documentQuality: 222222,
        testReport: "все отлично",
      },
      {
        id: 3,
        dateOfReceipt: "01.01.2024",
        productName: "a",
        providerId: "3",
        providerName: "B",
        batchSize: 5000,
        sampleSize: 0.5,
        ttn: 222222,
        documentQuality: 222222,
        testReport: "все отлично",
      },
    ];
    return (
        <div className="products-page">
            <DataTable data={data} tableName="Products" countItemsAll={1}/>
        </div>
    );
}