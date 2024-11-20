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
import { AddResearchModel } from "@/Models/ResearchModels/AddResearchModel";
import { CreateResearchRequest } from "@/Models/ResearchModels/CreateResearchRequest";
import { GetProductsAsync } from "@/services/ProductServices/GetProductsAsync";
import { AddResearchAsync } from "@/services/ResearchServices.tsx/AddResearchAsync";
import { ProductValidationErrorModel } from "@/Models/ProductModels/ProductValidationErrorModel";
import { ResearchValidationErrorModel } from "@/Models/ResearchModels/ResearchValidationErrorModel";
import { AddPartyModel } from "@/Models/PartyModels/AddPartyModel";
import { CreatePartyRequest } from "@/Models/PartyModels/CreatePartyRequest";
import { PartyValidationErrorModel } from "@/Models/PartyModels/PartyValidationErrorModel";
import { AddPartyAsync } from "@/services/PartyServices/AddPartyAsync";

interface InputConfig {
  name: string;
  placeholder?: string;
  isSelect?: boolean;
  isCheckbox?: boolean;
}

interface Option {
  id: string;
  name: string;
}

const inputConfig: Record<string, InputConfig[]> = {
  Manufacturers: [{ name: "manufacturerName", placeholder: "Производитель" }],

  Suppliers: [
    { name: "supplierName", placeholder: "Поставщик" },
    { name: "manufacturer", placeholder: "Производитель(и)", isCheckbox: true },
  ],

  Products: [
    { name: "productName", placeholder: "Название продукта" },
    { name: "supplier", placeholder: "Поставщик(и):", isCheckbox: true },
  ],
  Researches: [
    { name: "researchName", placeholder: "Название исследования" },
    { name: "ProductId", isSelect: true },
  ],
  Parties: [
    { name: "batchNumber", placeholder: "Номер партии" },
    { name: "dateOfReceipt", placeholder: "Дата поступления" },
    { name: "productId", isSelect: true },
    { name: "supplierId", isSelect: true },
    { name: "manufacturerId", isSelect: true },
    { name: "batchSize", placeholder: "Объем партии" },
    { name: "sampleSize", placeholder: "Объем выборки" },
    { name: "ttn", placeholder: "ТТН" },
    {
      name: "documentOnQualityAndSafety",
      placeholder: "Документ по качеству и безопасности",
    },
    { name: "testReport", placeholder: "Протокол испытаний" },
    { name: "dateOfManufacture", placeholder: "Дата изготовления" },
    { name: "expirationDate", placeholder: "Срок годности" },
    { name: "packaging", placeholder: "Упаковка" },
    { name: "marking", placeholder: "Маркировка" },
    { name: "result", placeholder: "Результат" },
    { name: "note", placeholder: "Примечание" },
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

  const [dateOfReceiptValue, setDateOfReceiptValue] = useState("");
  const [dateOfManufactureValue, setDateOfManufactureValue] = useState("");
  const [expirationDateValue, setExpirationDateValue] = useState("");

  const [selectedItem, setSelectedItem] = useState<string>("");
  const [selectedCheckbox, setSelectedCheckbox] = useState<string[]>([]);

  const [manufacturerErrors, setManufacturerErrors] =
    useState<ManufacturerValidationErrorModel>({});
  const [supplierErrors, setSupplierErrors] =
    useState<SupplierValidationErrorModel>({});
  const [productErrors, setProductErrors] =
    useState<ProductValidationErrorModel>({});
  const [researchErrors, setResearchErrors] =
    useState<ResearchValidationErrorModel>({});
  const [partyErrors, setPartyErrors] = useState<PartyValidationErrorModel>({});

  const [options, setOptions] = useState<Option[]>([]);

  const [productPartyOptions, setProductPartyOptions] = useState<Option[]>([]);
  const [supplierPartyOptions, setSupplierPartyOptions] = useState<Option[]>(
    []
  );
  const [manufacturerPartyOptions, setManufacturerPartyOptions] = useState<
    Option[]
  >([]);

  const [selectedProductPartyItem, setSelectedProductPartyItem] =
    useState<string>("");
  const [selectedSupplierPartyItem, setSelectedSupplierPartyItem] =
    useState<string>("");
  const [selectedManufacturerPartyItem, setSelectedManufacturerPartyItem] =
    useState<string>("");

  const [formData, setFormData] = useState({});
  const [image, setImg] = useState<string>();
  const [titleName, setTitleName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchGetOptions = async () => {
      switch (tableName) {
        case "Suppliers":
          const manufacturers = await GetManufacturersAsync();
          const supplierOptions: Option[] = manufacturers.map(
            (manufacturer) => ({
              id: manufacturer.id,
              name: manufacturer.manufacturerName,
            })
          );
          setOptions(supplierOptions);
          break;

        case "Products":
          const suppliers = await GetSuppliersAsync();
          const productOptions: Option[] = suppliers.map((supplier) => ({
            id: supplier.id,
            name: supplier.supplierName,
          }));
          setOptions(productOptions);
          break;

        case "Researches":
          const products = await GetProductsAsync();
          const researchOptions: Option[] = products.map((product) => ({
            id: product.id,
            name: product.productName,
          }));
          if (researchOptions.length > 0) {
            setSelectedItem(researchOptions[0].id);
          }

          setOptions(researchOptions);
          break;

        case "Parties":
          const partiesProductsOptions = await GetProductsAsync();
          const partiesSuppliersOptions = await GetSuppliersAsync();
          const partiesManufacturersOptions = await GetManufacturersAsync();

          const getProductOptions: Option[] = partiesProductsOptions.map(
            (product) => ({
              id: product.id,
              name: product.productName,
            })
          );

          const getSupplierOptions: Option[] = partiesSuppliersOptions.map(
            (supplier) => ({
              id: supplier.id,
              name: supplier.supplierName,
            })
          );

          const getManufacturerOptions: Option[] =
            partiesManufacturersOptions.map((manufacturer) => ({
              id: manufacturer.id,
              name: manufacturer.manufacturerName,
            }));

          if (getProductOptions.length > 0) {
            setSelectedProductPartyItem(getProductOptions[0].id);
          }
          if (getSupplierOptions.length > 0) {
            setSelectedSupplierPartyItem(getSupplierOptions[0].id);
          }
          if (getManufacturerOptions.length > 0) {
            setSelectedManufacturerPartyItem(getManufacturerOptions[0].id);
          }

          const today = new Date();
          const formattedDate = today.toISOString().split("T")[0];
          setDateOfReceiptValue(formattedDate);
          setDateOfManufactureValue(formattedDate);
          setExpirationDateValue(formattedDate);

          setProductPartyOptions(getProductOptions);
          setSupplierPartyOptions(getSupplierOptions);
          setManufacturerPartyOptions(getManufacturerOptions);
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
          setTitleName("Добавление исследования");
          break;

        case "Parties":
          setImg("batch-picking");
          setTitleName("Добавление партии");
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

  const handleDateChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const newDate = event.target.value;
    const inputName = event.target.name;

    // Set state based on the input name
    if (inputName === "dateOfReceipt") {
      setDateOfReceiptValue(newDate);
    } else if (inputName === "dateOfManufacture") {
      setDateOfManufactureValue(newDate);
    } else if (inputName === "expirationDate") {
      setExpirationDateValue(newDate);
    }
  };

  const handleSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    name: string
  ) => {
    const { value } = event.target;
    if (name === "productId") {
      setSelectedProductPartyItem(value);
    } else if (name === "supplierId") {
      setSelectedSupplierPartyItem(value);
    } else if (name === "manufacturerId") {
      setSelectedManufacturerPartyItem(value);
    } else {
      setSelectedItem(value);
    }
  };

  const handleInputCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { id, checked } = event.target;

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
        const result = await AddManufacturerAsync(
          formData as AddManufacturerModel
        );
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
        const addProductModel = formData as AddProductModel;
        const createProductRequest: CreateProductRequest = {
          productName: addProductModel.productName,
          suppliersIds: selectedCheckbox,
        };
        const productResult = await AddProductAsync(createProductRequest);
        const [productResponse, productStatusCode] = productResult;
        if (productStatusCode === 200) {
          setSuccessMessage(productResponse);
          setProductErrors({});
          setErrors("");
        } else if (productStatusCode === 400) {
          setSuccessMessage("");
          setProductErrors(productResponse);
          setErrors("");
        } else if (productStatusCode === 409) {
          setSuccessMessage("");
          setProductErrors({});
          setErrors(productResponse);
        }
        break;

      case "Researches":
        const addResearchModel = formData as AddResearchModel;
        const createResearchRequest: CreateResearchRequest = {
          researchName: addResearchModel.researchName,
          productId: selectedItem,
        };
        const researchResult = await AddResearchAsync(createResearchRequest);
        const [researchResponse, researchStatusCode] = researchResult;
        if (researchStatusCode === 200) {
          setSuccessMessage(researchResponse);
          setResearchErrors({});
          setErrors("");
        } else if (researchStatusCode === 400) {
          setSuccessMessage("");
          setResearchErrors(researchResponse);
          setErrors("");
        } else if (researchStatusCode === 409) {
          setSuccessMessage("");
          setResearchErrors({});
          setErrors(researchResponse);
        }
        break;

      case "Parties":
        const addPartyModel = formData as AddPartyModel;

        let isFieldValidType = true;

        if (typeof addPartyModel.batchNumber !== "number") {
          alert('Неверные данные в поле "Номер партии"');
          isFieldValidType = false;
        }
        if (isFieldValidType) {
          const createPartyRequest: CreatePartyRequest = {
            batchNumber: addPartyModel.batchNumber,
            dateOfReceipt: dateOfReceiptValue,
            productId: selectedProductPartyItem,
            supplierId: selectedSupplierPartyItem,
            manufacturerId: selectedManufacturerPartyItem,
            batchSize: addPartyModel.batchSize,
            sampleSize: addPartyModel.sampleSize,
            ttn: addPartyModel.ttn,
            documentOnQualityAndSafety: addPartyModel.documentOnQualityAndSafety,
            testReport: addPartyModel.testReport,
            dateOfManufacture: dateOfManufactureValue,
            expirationDate: expirationDateValue,
            packaging: addPartyModel.packaging,
            marking: addPartyModel.marking,
            result: addPartyModel.result,
            note: addPartyModel.note,
          };

          const partyResult = await AddPartyAsync(createPartyRequest);
          const [partyResponse, partyStatusCode] = partyResult;
          if (partyStatusCode === 200) {
            setSuccessMessage(partyResponse);
            setPartyErrors({});
            setErrors("");
          } else if (partyStatusCode === 400) {
            setSuccessMessage("");
            setPartyErrors(partyResponse);
            setErrors("");
          } else if (partyStatusCode === 409) {
            setSuccessMessage("");
            setPartyErrors({});
            setErrors(partyResponse);
          }
        }
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
                        // name={input.name}
                        id={input.name}
                        // value={selectedItem}
                        onChange={(e) => handleSelectChange(e, input.name)}
                        required
                      >
                        <option value="" disabled>
                          {input.placeholder}
                        </option>
                        {(() => {
                          let opt = [];
                          if (input.name === "productId") {
                            opt = productPartyOptions;
                          } else if (input.name === "supplierId") {
                            opt = supplierPartyOptions;
                          } else if (input.name === "manufacturerId") {
                            opt = manufacturerPartyOptions;
                          } else {
                            opt = options;
                          }
                          return opt.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.name}
                            </option>
                          ));
                        })()}
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
                  ) : input.name === "dateOfReceipt" ? (
                    <div>
                      <input
                        type="date"
                        name="dateOfReceipt"
                        id="dateOfReceipt"
                        placeholder="Дата поступления"
                        value={dateOfReceiptValue}
                        onChange={handleDateChange}
                        required
                      />
                    </div>
                  ) : input.name === "dateOfManufacture" ? (
                    <div>
                      <input
                        type="date"
                        name="dateOfManufacture"
                        id="dateOfManufacture"
                        placeholder="Дата изготовления"
                        value={dateOfManufactureValue}
                        onChange={handleDateChange}
                        // required
                      />
                    </div>
                  ) : input.name === "expirationDate" ? (
                    <div>
                      <input
                        type="date"
                        name="expirationDate"
                        id="expirationDate"
                        placeholder="Срок годности"
                        value={expirationDateValue}
                        onChange={handleDateChange}
                        // required
                      />
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

                  {tableName === "Manufacturers" &&
                    manufacturerErrors[input.name] && (
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

                  {tableName === "Products" &&
                    productErrors[input.name] &&
                    input.name !== "id" && (
                      <div>
                        <span className="error-message">
                          {productErrors[input.name]}
                        </span>
                      </div>
                    )}

                  {tableName === "Researches" &&
                    researchErrors[input.name] &&
                    input.name !== "id" && (
                      <div>
                        <span className="error-message">
                          {researchErrors[input.name]}
                        </span>
                      </div>
                    )}

                  {tableName === "Parties" &&
                    partyErrors[input.name] &&
                    input.name !== "id" && (
                      <div>
                        <span className="error-message">
                          {partyErrors[input.name]}
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
