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
import { GetSuppliersAsync } from "@/services/SupplierServices/GetSuppliersAsync";
import { ProductModel } from "@/Models/ProductModels/ProductModel";
import { UpdateProductModel } from "@/Models/ProductModels/UpdateProductModel";
import { UpdateProductAsync } from "@/services/ProductServices/UpdateProductAsync";
import { GetProductSuppliersAsync } from "@/services/ProductServices/GetProductSuppliersAsync";
import { ProductValidationErrorModel } from "@/Models/ProductModels/ProductValidationErrorModel";
import { ResearchValidationErrorModel } from "@/Models/ResearchModels/ResearchValidationErrorModel";
import { ResearchModel } from "@/Models/ResearchModels/ResearchModel";
import { UpdateResearchModel } from "@/Models/ResearchModels/UpdateResearchModel";
import { UpdateResearchAsync } from "@/services/ResearchServices.tsx/UpdateResearchAsync";
import { GetProductsAsync } from "@/services/ProductServices/GetProductsAsync";
import { PartyValidationErrorModel } from "@/Models/PartyModels/PartyValidationErrorModel";
import { PartyModel } from "@/Models/PartyModels/PartyModel";
import { UpdatePartyModel } from "@/Models/PartyModels/UpdatePartyModel";
import { UpdatePartyAsync } from "@/services/PartyServices/UpdatePartyAsync";
import { GetProductForResearchId } from "@/services/ResearchServices.tsx/GetProductForResearchId";
import { RoleEnum } from "@/Enums/RoleEnum";
import { UserModel } from "@/Models/UserModels/UserModel";
import { IsAdminAsync } from "@/services/UserServices/IsAdminAsync ";
import { IsManagerAsync } from "@/services/UserServices/IsManagerAsync ";

interface InputConfig {
  name: string;
  placeholder?: string;
  isSelect?: boolean;
  isCheckbox?: boolean;
}

interface Option {
  id: string;
  name: string;
  isSelected?: boolean;
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
    { name: "id", placeholder: "" },
    { name: "productName", placeholder: "Название продукта" },
    { name: "supplier", placeholder: "Поставщик(и):", isCheckbox: true },
  ],
  Researches: [
    { name: "id", placeholder: "" },
    { name: "researchName", placeholder: "Название исследования" },
    { name: "ProductId", isSelect: true },
  ],
  Parties: [
    { name: "id", placeholder: "" },
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
  Users: [
    { name: "id", placeholder: "" },
    { name: "surname", placeholder: "Фамилия" },
    { name: "userName", placeholder: "Имя" },
    { name: "patronymic", placeholder: "Отчество" },
    { name: "role", placeholder: "Роль", isSelect: true },
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
          if (item !== null) {
            const productItem = item as ProductModel;

            const suppliers = await GetSuppliersAsync();

            const productSuppliers = await GetProductSuppliersAsync(
              productItem.id
            );

            const productSupplierIds = productSuppliers.map(
              (supplier) => supplier.id
            );

            setSelectedCheckbox(productSupplierIds);

            const optionsWithCheckboxState = suppliers.map((supplier) => ({
              id: supplier.id,
              name: supplier.supplierName,
              isChecked: productSupplierIds.includes(supplier.id),
            }));

            setOptions(optionsWithCheckboxState);
          }
          break;

        case "Researches":
          if (item !== null) {
            const researchItem = item as ResearchModel;
            const products = await GetProductsAsync();
            const product = await GetProductForResearchId(researchItem.id);

            if (product) {
              const productIndex = products.findIndex(
                (p) => p.id === product.id
              );

              if (productIndex !== -1) {
                const removedProduct = products.splice(productIndex, 1)[0];
                products.unshift(removedProduct);
              }
              setSelectedItem(product.id);
            }

            const researchOptions: Option[] = products.map((product) => ({
              id: product.id,
              name: product.productName,
            }));

            const optionsWithCheckboxState = researchOptions.map((option) => ({
              id: option.id,
              name: option.name,
              isSelected: product && option.id === product.id ? true : false,
            }));

            setOptions(optionsWithCheckboxState);
          }
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

          setProductPartyOptions(getProductOptions);
          setSupplierPartyOptions(getSupplierOptions);
          setManufacturerPartyOptions(getManufacturerOptions);
          break;

        case "Users":
          if (item !== null) {
            const userItem = item as UserModel;

            let roleOptions: Option[] = [];

            const isManager = await IsManagerAsync();
            if (isManager) {
              roleOptions = [
                { id: "1", name: RoleEnum.User },
                { id: "2", name: RoleEnum.Worker },
              ];
            } else {
              const isAdmin = await IsAdminAsync();
              if (isAdmin) {
                roleOptions = [
                  { id: "1", name: RoleEnum.User },
                  { id: "2", name: RoleEnum.Worker },
                  { id: "3", name: RoleEnum.Manager },
                ];
              } else {
                router.push('/');
              }
            }

            const userRole = userItem.role;

            const selectedRole = roleOptions.find(
              (role) => role.name === userRole
            );

            const rolesWithCheckboxState = roleOptions.map((role) => ({
              id: role.id,
              name: role.name,
              isSelected:
                selectedRole && selectedRole.id === role.id ? true : false,
            }));

            if (selectedRole) {
              setSelectedItem(selectedRole.id);
            } else {
              setSelectedItem("");
            }

            setOptions(rolesWithCheckboxState);
          }
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
          setTitleName("Редактирование исследования");
          break;

        case "Parties":
          setImg("batch-picking");
          setTitleName("Редактирование партии");
          break;

        case "Users":
          setImg("experiment");
          setTitleName("Редактирование пользователя");
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
            { id: supplierItem.id, supplierName: "" }
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
        if (item !== null) {
          const productItem = item as ProductModel;
          const updateItem: ProductModel = Object.keys(productItem).reduce(
            (acc, key) => {
              acc[key as keyof ProductModel] =
                formData[key] !== undefined && formData[key] !== ""
                  ? formData[key]
                  : productItem[key as keyof ProductModel];
              return acc;
            },
            { id: productItem.id, productName: "" }
          );

          const updateProductModel: UpdateProductModel = {
            id: updateItem.id,
            productName: updateItem.productName,
            suppliersIds: selectedCheckbox,
          };

          const result = await UpdateProductAsync(updateProductModel);
          const [response, statusCode] = result;

          if (statusCode === 200) {
            setSuccessMessage(response);
            setProductErrors({});
            setErrors("");
          } else if (statusCode === 400) {
            setSuccessMessage("");
            setProductErrors(response);
            setErrors("");
          } else if (statusCode === 409) {
            setSuccessMessage("");
            setProductErrors({});
            setErrors(response);
          }
        }
        break;

      case "Researches":
        if (item !== null) {
          const researchItem = item as ResearchModel;
          const updateItem: ResearchModel = Object.keys(researchItem).reduce(
            (acc, key) => {
              acc[key as keyof ResearchModel] =
                formData[key] !== undefined && formData[key] !== ""
                  ? formData[key]
                  : researchItem[key as keyof ResearchModel];
              return acc;
            },
            { id: researchItem.id, researchName: "", productName: "" }
          );

          const updateProductModel: UpdateResearchModel = {
            id: updateItem.id,
            researchName: updateItem.researchName,
            productId: selectedItem,
          };

          const result = await UpdateResearchAsync(updateProductModel);
          const [response, statusCode] = result;

          if (statusCode === 200) {
            setSuccessMessage(response);
            setResearchErrors({});
            setErrors("");
          } else if (statusCode === 400) {
            setSuccessMessage("");
            setResearchErrors(response);
            setErrors("");
          } else if (statusCode === 409) {
            setSuccessMessage("");
            setResearchErrors({});
            setErrors(response);
          }
        }
        break;

      case "Parties":
        if (item !== null) {
          const partyItem = item as PartyModel;
          const updateItem: PartyModel = Object.keys(
            partyItem
          ).reduce<PartyModel>(
            (acc, key) => {
              acc[key as keyof PartyModel] =
                formData[key] !== undefined && formData[key] !== ""
                  ? formData[key]
                  : partyItem[key as keyof PartyModel];
              return acc;
            },
            {
              id: partyItem.id,
              batchNumber: "",
              dateOfReceipt: "",
              productName: "",
              supplierName: "",
              manufacturerName: "",
              batchSize: "",
              sampleSize: "",
              ttn: "",
              documentOnQualityAndSafety: "",
              testReport: "",
              dateOfManufacture: "",
              expirationDate: "",
              packaging: "",
              marking: "",
              result: "",
              userName: "",
              note: "",
            }
          );

          const updatePartyModel: UpdatePartyModel = {
            id: updateItem.id,
            batchNumber: updateItem.batchNumber,
            dateOfReceipt: updateItem.dateOfReceipt,
            productId: selectedProductPartyItem,
            supplierId: selectedSupplierPartyItem,
            manufacturerId: selectedManufacturerPartyItem,
            batchSize: updateItem.batchSize,
            sampleSize: updateItem.sampleSize,
            ttn: updateItem.ttn,
            documentOnQualityAndSafety: updateItem.documentOnQualityAndSafety,
            testReport: updateItem.testReport,
            dateOfManufacture: updateItem.dateOfManufacture,
            expirationDate: updateItem.expirationDate,
            packaging: updateItem.packaging,
            marking: updateItem.marking,
            result: updateItem.result,
            note: updateItem.note,
          };

          const result = await UpdatePartyAsync(updatePartyModel);
          const [response, statusCode] = result;

          if (statusCode === 200) {
            setSuccessMessage(response);
            setPartyErrors({});
            setErrors("");
          } else if (statusCode === 400) {
            setSuccessMessage("");
            setPartyErrors(response);
            setErrors("");
          } else if (statusCode === 409) {
            setSuccessMessage("");
            setPartyErrors({});
            setErrors(response);
          }
        }
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
                        value={selectedItem}
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
