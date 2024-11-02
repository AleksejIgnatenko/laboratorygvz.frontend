"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import "./style.css";
// import { AddSupplierModel } from "@/Models/SupplierModels/AddSupplierModel";
import { SupplierValidationErrorModel } from "@/Models/SupplierModels/SupplierValidationErrorModel";
import { SupplierModel } from "@/Models/SupplierModels/SupplierModel";
import { UpdateSupplierAsync } from "@/services/SupplierServices/UpdateSupplierAsync";
import { ManufacturerValidationErrorModel } from "@/Models/ManufacturerModels/ManufacturerValidationErrorModel";
import { ManufacturerModel } from "@/Models/ManufacturerModels/ManufacturerModel";
import { UpdateManufacturerAsync } from "@/services/ManufacturerServices/UpdateManufacturerAsync";
import { GetManufacturersAsync } from "@/services/ManufacturerServices/GetManufacturersAsync";
import { UpdateSupplierModel } from "@/Models/SupplierModels/UpdateSupplierModel";
import { GetSupplierManufacturersAsync } from "@/services/SupplierServices/GetSupplierManufacturersAsync";

interface InputConfig {
  name: string;
  placeholder: string;
  isSelect?: boolean;
  isCheckbox?: boolean;
}

interface Option {
  id: string;
  name: string;
  isChecked?: boolean;
}

const inputConfig: Record<string, InputConfig[]> = {
  Manufacturers: [
    { name: "id", placeholder: "" },
    { name: "manufacturerName", placeholder: "Производитель" },
  ],

  Suppliers: [
    { name: "id", placeholder: "" },
    { name: "supplierName", placeholder: "Поставщик" },
    { name: "manufacturer", placeholder: "Производитель", isCheckbox: true },
  ],

  Products: [
    { name: "dateOfReceipt", placeholder: "Дата получения" },
    { name: "productName", placeholder: "Название продукта" },
    { name: "suppliers", placeholder: "Поставщики", isSelect: true },
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
  const searchParams = useSearchParams();
  const [tableName, setTableName] = useState("");
  const [item, setItem] = useState(null);
  const [titleName, setTitleName] = useState("");
  const router = useRouter();

  const inputs =
    tableName && tableName in inputConfig ? inputConfig[tableName] : [];

  const [successMessage, setSuccessMessage] = useState<string>();
  const [errors, setErrors] = useState<string>();

  const [selectedCheckbox, setSelectedCheckbox] = useState<string[]>([]);

  const [manufacturerErrors, setManufacturerErrors] =
    useState<ManufacturerValidationErrorModel>({});

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
        case "Suppliers":
          if (item !== null) {
            const supplierItem = item as SupplierModel;

            const manufacturers = await GetManufacturersAsync();

            const supplierManufacturers = await GetSupplierManufacturersAsync(
              supplierItem.id
            );

            const supplierManufacturerIds = supplierManufacturers.map(
              (manufacturer) => manufacturer.id
            );

            setSelectedCheckbox(supplierManufacturerIds);

            const optionsWithCheckboxState = manufacturers.map(
              (manufacturer) => ({
                id: manufacturer.id,
                name: manufacturer.manufacturerName,
                isChecked: supplierManufacturerIds.includes(manufacturer.id), 
              })
            );

            setOptions(optionsWithCheckboxState);
          }
          break;

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

    const setImagesTitles = async () => {
      switch (tableName) {
        case "Manufacturers":
          setImg("factory");
          setTitleName("Редактирование производителя");
          break;

        case "Suppliers":
          setImg("supplier");
          setTitleName("Редактирование поставщика");
          break;

        case "Products":
          setImg("apple");
          setTitleName("Редактирование продукта");
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
    setImagesTitles();

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

const handleInputCheckboxChange = (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  const { id, checked } = event.target;

  setOptions((prevOptions) =>
    prevOptions.map((option) => {
      if (option.id === id) {
        return { ...option, isChecked: checked };
      }
      return option; 
    })
  );

  if (checked) {
    setSelectedCheckbox((prev) => [...prev, id]);
  } else {
    setSelectedCheckbox((prev) =>
      prev.filter((supplierId) => supplierId !== id)
    );
  }
};

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    switch (tableName) {
      case "Manufacturers":
        if (item !== null) {
          const manufacturerItem = item as ManufacturerModel;

          const updateItem: ManufacturerModel = Object.keys(
            manufacturerItem
          ).reduce(
            (acc, key) => {
              acc[key as keyof ManufacturerModel] =
                formData[key] !== undefined && formData[key] !== ""
                  ? formData[key]
                  : manufacturerItem[key as keyof ManufacturerModel];
              return acc;
            },
            { id: manufacturerItem.id, manufacturerName: "" }
          );

          const result = await UpdateManufacturerAsync(updateItem);
          const [response, statusCode] = result;

          if (statusCode === 200) {
            setSuccessMessage(response);
            setManufacturerErrors({});
            setErrors("");
          } else if (statusCode === 400) {
            setSuccessMessage("");
            setManufacturerErrors(response);
            setErrors("");
          } else if (statusCode === 409) {
            setSuccessMessage("");
            setManufacturerErrors({});
            setErrors(response);
          }
        }
        break;

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
            { id: supplierItem.id, supplierName: "",}
          );

          const updateSupplierModel: UpdateSupplierModel = {
            id: updateItem.id,
            supplierName: updateItem.supplierName,
            manufacturersIds: selectedCheckbox,
          };

          const result = await UpdateSupplierAsync(updateSupplierModel);
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
            <h2 className="form-title">{titleName}</h2>
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
                  ) : input.isCheckbox ? (
                    <div className="checkbox-container">
                      {options.map((option) => (
                        <label key={option.id}>
                          <input
                            type="checkbox"
                            id={option.id}
                            checked={option.isChecked}
                            onChange={handleInputCheckboxChange}
                          />
                          {option.name}
                        </label>
                      ))}
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

                  {tableName === "Manufacturers" &&
                    manufacturerErrors[input.name] &&
                    input.name !== "id" && (
                      <div>
                        <span className="error-message">
                          {manufacturerErrors[input.name]}
                        </span>
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
                Обновить
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
              Назад
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
