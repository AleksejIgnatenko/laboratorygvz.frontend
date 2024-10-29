"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import "./style.css";
// import { AddSupplierModel } from "@/Models/SupplierModels/AddSupplierModel";
import { SupplierValidationErrorModel } from "@/Models/SupplierModels/SupplierValidationErrorModel";
import { SupplierModel } from "@/Models/SupplierModels/SupplierModel";
import { UpdateSupplierAsync } from "@/services/SupplierServices/UpdateSupplierAsync";

interface InputConfig {
  name: string;
  placeholder: string;
  isSelect?: boolean; // Make isSelect optional
}

interface Option {
  id: string;
  name: string;
}

const inputConfig: Record<string, InputConfig[]> = {
  Suppliers: [
    { name: "id", placeholder: "" },
    { name: "supplierName", placeholder: "Поставщик" },
    { name: "manufacturer", placeholder: "Производитель" },
  ],
  Products: [
    { name: "dateOfReceipt", placeholder: "Дата получения" },
    { name: "productName", placeholder: "Название продукта" },
    { name: "supplierId", placeholder: "Поставщик", isSelect: true },
    { name: "batchSize", placeholder: "Размер партии" },
    { name: "sampleSize", placeholder: "Размер выборки" },
    { name: "ttn", placeholder: "ТТН" },
    {
      name: "documentOnQualityAndSafety",
      placeholder: "Документ по качеству и безопасности",
    },
    { name: "testReport", placeholder: "Протокол испытаний" },
  ],
  Researches: [
    { name: "researchName", placeholder: "Название исследования" },
    { name: "ProductId", placeholder: "Название продукта", isSelect: true },
  ],
  Experiments: [
    { name: "experimentName", placeholder: "Да" },
    { name: "result", placeholder: "Результат" },
    { name: "researchId", placeholder: "Исследование", isSelect: true },
  ],
};

function UpdatePageContent() {
  const searchParams = useSearchParams(); // Use useSearchParams to get query params
  const [tableName, setTableName] = useState("");
  const [item, setItem] = useState(null);
  const router = useRouter();

  const inputs =
    tableName && tableName in inputConfig ? inputConfig[tableName] : [];

  const [successMessage, setSuccessMessage] = useState<string>();
  const [errors, setErrors] = useState<string>();

  const [supplierErrors, setSupplierErrors] =
    useState<SupplierValidationErrorModel>({});

  const [options, setOptions] = useState<Option[]>([]);
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [image, setImg] = useState<string>();

  useEffect(() => {
    const tableNameParam = searchParams.get("tableName");
    const itemString = searchParams.get("item");

    setTableName(tableNameParam || "");
    const parsedItem = itemString ? JSON.parse(itemString) : null;
    setItem(parsedItem);
  }, [searchParams]);

  useEffect(() => {
    const fetchGetOptions = async () => {
      switch (tableName) {
        case "Products":
          const productOptions: Option[] = [
            { id: "1", name: "Provider A" },
            { id: "2", name: "Provider B" },
            { id: "3", name: "Provider C" },
            { id: "4", name: "Provider D" },
            { id: "5", name: "Provider E" },
          ];
          setOptions(productOptions);
          // Call method to fetch providers
          break;

        case "Researches":
          const researchOptions: Option[] = [
            { id: "1", name: "Product A" },
            { id: "2", name: "Product B" },
            { id: "3", name: "Product C" },
            { id: "4", name: "Product D" },
            { id: "5", name: "Product E" },
          ];
          setOptions(researchOptions);
          // Call method to fetch products
          break;

        case "Experiments":
          break;

        default:
          console.log("Unknown table name");
          break;
      }
    };

    const setImages = async () => {
      switch (tableName) {
        case "Suppliers":
          setImg("supplier");
          break;

        case "Products":
          setImg("apple");
          break;

        case "Researches":
          setImg("research");
          break;

        case "Experiments":
          setImg("experiment");
          break;

        default:
          setImg("apple");
          break;
      }
    };

    // const handleKeyDown = (event: KeyboardEvent) => {
    //   // Alt + A
    //   if (
    //     (event.altKey && event.key.toLowerCase() === "a") ||
    //     event.key.toLowerCase() === "ф"
    //   ) {
    //     router.push(`/addPage?tableName=${tableName}`);
    //   }
    //   // Alt + B
    //   if (
    //     (event.altKey && event.key.toLowerCase() === "b") ||
    //     event.key.toLowerCase() === "и"
    //   ) {
    //     router.back();
    //   }
    // };

    // window.addEventListener("keydown", handleKeyDown);

    fetchGetOptions();
    setImages();

    // return () => {
    //   window.removeEventListener("keydown", handleKeyDown);
    // };
  }, [tableName]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value })); // Обновляем состояние
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    switch (tableName) {
      case "Suppliers":
        if (item !== null) {
          const supplierItem = item as SupplierModel;

          const updateItem: SupplierModel = Object.keys(supplierItem).reduce(
            (acc, key) => {
              acc[key as keyof SupplierModel] =
                formData[key] !== undefined && formData[key] !== ""
                  ? formData[key]
                  : supplierItem[key as keyof SupplierModel];
              return acc;
            },
            { id: supplierItem.id, supplierName: "", manufacturer: "" }
          );

          const result = await UpdateSupplierAsync(updateItem);
          const [response, statusCode] = result;

          if (statusCode === 200) {
            setSuccessMessage(response);
            setSupplierErrors({});
            setErrors("");
          } else if (statusCode === 400) {
            setSuccessMessage("");
            setSupplierErrors(response);
            setErrors("");
          } else if (statusCode === 409) {
            setSuccessMessage("");
            setSupplierErrors({});
            setErrors(response);
          }
        }
        break;

      case "Products":
        // Добавьте логику для обработки продуктов
        break;

      case "Researches":
        // Добавьте логику для исследований
        break;

      case "Experiments":
        // Добавьте логику для экспериментов
        break;

      default:
        break;
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="page-update">
      <div className="update-container">
        <div className="update-content">
          <form className="update-form" onSubmit={handleSubmit}>
            <h2 className="form-title">Update {tableName}</h2>
            <div className="update-form-container" id="update-form-container">
              {inputs.map((input, index) => (
                <div className="form-group" key={index}>
                  {input.name === "id" ? null : input.isSelect ? (
                    <div className="select-container">
                      <select
                        name={input.name}
                        id={input.name}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="" disabled>
                          {input.placeholder}
                        </option>
                        {options.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="text"
                        name={input.name}
                        id={input.name}
                        placeholder={
                          item ? item[input.name] : input.placeholder
                        }
                        onChange={handleInputChange}
                        // required
                      />
                    </div>
                  )}

                  {tableName === "Suppliers" &&
                    supplierErrors[input.name] &&
                    input.name !== "id" && (
                      <div>
                        <span className="error-message">
                          {supplierErrors[input.name]}
                        </span>
                      </div>
                    )}
                </div>
              ))}
            </div>
            <div className="form-group form-button">
              <button
                type="submit"
                name="signup"
                id="signup"
                className="form-submit"
              >
                Update
              </button>
            </div>
            <span className="success-message">{successMessage}</span>
            <span className="error-message">{errors}</span>
          </form>
          <div className="update-image">
            <img
              src={`/images/${image}.png`}
              className="dynamic-img"
              alt="Dynamic Image"
            />
            <button onClick={handleGoBack} className="back-button">
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UpdatePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UpdatePageContent />
    </Suspense>
  );
}
