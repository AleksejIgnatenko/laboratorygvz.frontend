"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { AddSupplierAsync } from "@/services/SupplierServices/AddSupplierAsync";
import "./style.css";
import { AddSupplierModel } from "@/Models/SupplierModels/AddSupplierModel";
import { SupplierValidationErrorModel } from "@/Models/SupplierModels/SupplierValidationErrorModel";
import { AddManufacturerModel } from "@/Models/ManufactureModels/AddManufacturerModel";
import { AddManufacturerAsync } from "@/services/ManufacturerServices/AddManufacturerAsync";
import { ManufacturerValidationErrorModel } from "@/Models/ManufactureModels/ManufacturerValidationErrorModel";

interface InputConfig {
  name: string;
  placeholder: string;
  isSelect?: boolean;
  isCheckbox?: boolean;
}

interface Option {
  id: string;
  name: string;
}

const inputConfig: Record<string, InputConfig[]> = {
  Manufacturers: [
    { name: "manufacturerName", placeholder: "Производитель" },
  ],

  Suppliers: [
    { name: "supplierName", placeholder: "Поставщик" },
    { name: "manufacturer", placeholder: "Производитель", isCheckbox: true },
  ],

  Products: [
    { name: "dateOfReceipt", placeholder: "Дата получения", },
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

function AddPageContent() {
  const searchParams = useSearchParams();
  const tableName = searchParams.get("tableName");
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
  const [formData, setFormData] = useState({});
  const [image, setImg] = useState<string>();
  const router = useRouter();

  useEffect(() => {
    const fetchGetOptions = async () => {
      switch (tableName) {
        case "Suppliers":
          const supplierOptions: Option[] = [
            { id: "1", name: "Manufacturer A" },
            { id: "2", name: "Manufacturer B" },
            { id: "3", name: "Manufacturer C" },
            { id: "4", name: "Manufacturer D" },
            { id: "5", name: "Manufacturer E" },
            { id: "6", name: "Manufacturer F" },
            { id: "7", name: "Manufacturer G" }
          ];
          setOptions(supplierOptions);
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
          break;
      }
    };

    const setImages = async () => {
      switch (tableName) {
        case "Manufacturers":
          setImg("factory");
          break;

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
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleInputCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = event.target;

    if (checked) {
      setSelectedCheckbox((prev) => [...prev, id]);
    } else {
      setSelectedCheckbox((prev) => prev.filter((supplierId) => supplierId !== id));
    }

    console.log(id);
  };


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    switch (tableName) {
      case "Manufacturers":
        const result = await AddManufacturerAsync(formData as AddManufacturerModel);
        const [response, statusCode] = result;
        if (statusCode === 200) {
          setSuccessMessage(response);
          setManufacturerErrors({});
          setErrors("");
          // setFormData({
          //   Name: "",
          //   Manufacturer: "",
          // });
          // setFormData({});
          // inputConfig.Suppliers.map((input) => [input.name, ""]);
        } else if (statusCode === 400) {
          setSuccessMessage("");
          setManufacturerErrors(response);
          setErrors("");
        } else if (statusCode === 409) {
          setSuccessMessage("");
          setManufacturerErrors({});
          setErrors(response);
        }
        break;

      case "Suppliers":
        console.log(formData);
        const supplierResult = await AddSupplierAsync(formData as AddSupplierModel);
        const [supplierResponse, supplierStatusCode] = supplierResult;
        if (supplierStatusCode === 200) {
          setSuccessMessage(supplierResponse);
          setSupplierErrors({});
          setErrors("");
          // setFormData({
          //   Name: "",
          //   Manufacturer: "",
          // });
          // setFormData({});
          // inputConfig.Suppliers.map((input) => [input.name, ""]);
        } else if (supplierStatusCode === 400) {
          setSuccessMessage("");
          setSupplierErrors(supplierResponse);
          setErrors("");
        } else if (supplierStatusCode === 409) {
          setSuccessMessage("");
          setSupplierErrors({});
          setErrors(supplierResponse);
        }
        break;

      case "Products":
        break;

      case "Researches":
        break;

      case "Experiments":
        break;

      default:
        break;
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="page-add">
      <div className="add-container">
        <div className="add-content">
          <form className="add-form" onSubmit={handleSubmit}>
            <h2 className="form-title">Add {tableName}</h2>
            <div className="add-form-container" id="add-form-container">
              {inputs.map((input, index) => (
                <div className="form-group" key={index}>
                  {input.isSelect ? (
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
                        placeholder={input.placeholder}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  )}

                  {tableName === "Manufacturers" && manufacturerErrors[input.name] && (
                    <div>
                      <span className="error-message">
                        {manufacturerErrors[input.name]}
                      </span>
                    </div>
                  )}
                  {tableName === "Suppliers" && supplierErrors[input.name] && (
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
                Add
              </button>
            </div>
            <span className="success-message">{successMessage}</span>
            <span className="error-message">{errors}</span>
          </form>
          <div className="add-image">
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

export default function AddPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddPageContent />
    </Suspense>
  );
}
