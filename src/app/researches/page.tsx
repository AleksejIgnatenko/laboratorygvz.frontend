import DataTable from "@/components/DataTableComponent/DataTable";
import { ProductModel } from "@/Models/UserModels/ProductModel";
import "./style.css";

export default function Researches() {
    const data: ProductModel[] = [
      // {
      //   id: 1,
      //   dateOfReceipt: "00.00.0000",
      //   productName: "b",
      //   providerId: "C",
      //   batchSize: 10000,
      //   sampleSize: 0.1,
      //   ttn: 111111,
      //   documentQuality: 111111,
      //   testReport: "все yt гут",
      //   experements: "1",
      // },
      // {
      //   id: 2,
      //   dateOfReceipt: "01.01.2024",
      //   productName: "c",
      //   providerId: "A",
      //   batchSize: 5000,
      //   sampleSize: 0.5,
      //   ttn: 222222,
      //   documentQuality: 222222,
      //   testReport: "все отлично",
      //   experements: "2",
      // },
      // {
      //   id: 3,
      //   dateOfReceipt: "01.01.2024",
      //   productName: "a",
      //   providerId: "B",
      //   batchSize: 5000,
      //   sampleSize: 0.5,
      //   ttn: 222222,
      //   documentQuality: 222222,
      //   testReport: "все отлично",
      //   experements: "2",
      // },
    ];
    return (
        <div className="researches-page">
            <DataTable data={data} tableName="Researches" countItemsAll={1}/>
        </div>
    );
}