"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { AddSupplierAsync } from "@/services/SupplierServices/AddSupplierAsync";
import "./style.css";
import { AddSupplierModel } from "@/Models/SupplierModels/AddSupplierModel";
import { SupplierValidationErrorModel } from "@/Models/SupplierModels/SupplierValidationErrorModel";
import { AddManufacturerModel } from "@/Models/ManufacturerModels/AddManufacturerModel";
import { AddManufacturerAsync } from "@/services/ManufacturerServices/AddManufacturerAsync";
import { ManufacturerValidationErrorModel } from "@/Models/ManufacturerModels/ManufacturerValidationErrorModel";
import { GetManufacturersAsync } from "@/services/ManufacturerServices/GetManufacturersAsync";
import { CreateSupplierRequest } from "@/Models/SupplierModels/CreateSupplierRequest";
import { GetSuppliersAsync } from "@/services/SupplierServices/GetSuppliersAsync";
import { AddProductModel } from "@/Models/ProductModels/AddProductModel";
import { CreateProductRequest } from "@/Models/ProductModels/CreateProductRequest";
import { AddProductAsync } from "@/services/ProductServices/AddProductAsync";

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
    { name: "manufacturer", placeholder: "Производитель(и)", isCheckbox: true },
  ],

  Products: [
    { name: "productName", placeholder: "Название продукта" },
    { name: "supplier", placeholder: "Поставщик(и):", isCheckbox: true }
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
  const [titleName, setTitleName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchGetOptions = async () => {
      switch (tableName) {
        case "Suppliers":
          const manufacturers = await GetManufacturersAsync();
          const supplierOptions: Option[] = manufacturers.map(manufacturer => ({
            id: manufacturer.id,
            name: manufacturer.manufacturerName,
          }));
          setOptions(supplierOptions);
          break;

        case "Products":
          const suppliers = await GetSuppliersAsync();
          const productOptions: Option[] = suppliers.map(supplier => ({
            id: supplier.id,
            name: supplier.supplierName,
          }))
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

    const setImagesTitles = async () => {
      switch (tableName) {
        case "Manufacturers":
          setImg("factory");
          setTitleName("Добавление производителя");
          break;

        case "Suppliers":
          setImg("supplier");
          setTitleName("Добавление поставщика");
          break;

        case "Products":
          setImg("apple");
          setTitleName("Добавление продукта");
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
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleInputCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = event.target;

    if (checked) {
      setSelectedCheckbox((prev) => [...prev, id]);
    } else {
      setSelectedCheckbox((prev) => prev.filter((supplierId) => supplierId !== id));
    }
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
        const addSupplierModel = formData as AddSupplierModel;
        const createSupplierRequest: CreateSupplierRequest = {
          supplierName: addSupplierModel.supplierName,
          manufacturersIds: selectedCheckbox,
        };
        const supplierResult = await AddSupplierAsync(createSupplierRequest);
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
        const addProductModel = formData as AddProductModel;
        const createProductRequest: CreateProductRequest = {
          productName: addProductModel.productName,
          suppliersIds: selectedCheckbox,
        };
        const productResult = await AddProductAsync(createProductRequest);
        const [productResponse, productStatusCode] = productResult;
        if (productStatusCode === 200) {
          setSuccessMessage(productResponse);
          setSupplierErrors({});
          setErrors("");
          // setFormData({
          //   Name: "",
          //   Manufacturer: "",
          // });
          // setFormData({});
          // inputConfig.Suppliers.map((input) => [input.name, ""]);
        } else if (productStatusCode === 400) {
          setSuccessMessage("");
          setSupplierErrors(productResponse);
          setErrors("");
        } else if (productStatusCode === 409) {
          setSuccessMessage("");
          setSupplierErrors({});
          setErrors(productResponse);
        }
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
            <h2 className="form-title">{titleName}</h2>
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
                      <div>
                        <h2 className="checkbox-title">{input.placeholder}</h2>
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
                Добавить
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
              Назад
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
