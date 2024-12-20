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
import {
  PartyModel,
  CanBeConvertedToNumberWithAnyDigits,
  CanBeConvertedToNumberWithoutLeadingZero,
  CanBeConvertedToFloat,
} from "@/Models/PartyModels/PartyModel";
import { UpdatePartyModel } from "@/Models/PartyModels/UpdatePartyModel";
import { UpdatePartyAsync } from "@/services/PartyServices/UpdatePartyAsync";
import { GetProductForResearchId } from "@/services/ResearchServices.tsx/GetProductForResearchId";
import { RoleEnum } from "@/Enums/RoleEnum";
import { UserModel } from "@/Models/UserModels/UserModel";
import { IsAdminAsync } from "@/services/UserServices/IsAdminAsync ";
import { IsManagerAsync } from "@/services/UserServices/IsManagerAsync ";
import { UpdateUserAsync } from "@/services/UserServices/UpdateUserAsync";
import { UpdateUserModel } from "@/Models/UserModels/UpdateUserModel";
import { ResearchResultModel } from "@/Models/ResearchResultModel/ResearchResultModel";
import { UpdateResearchResultAsync } from "@/services/ResearchResultServices/UpdateResearchResultAsync";
import { ProductModelOption } from "@/Models/ProductModels/ProductModelOption";
import { SupplierModelOption } from "@/Models/SupplierModels/SupplierModelOption";
import { GetProductsForOptionsAsync } from "@/services/ProductServices/GetProductsForOptionsAsync";
import { GetSuppliersForOptionsAsync } from "@/services/SupplierServices/GetSuppliersForOptionsAsync";

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
    { name: "unitsOfMeasurement", placeholder: "Единицы измерения" },
    { name: "supplier", placeholder: "Поставщик(и):", isCheckbox: true },
  ],
  Researches: [
    { name: "id", placeholder: "" },
    { name: "researchName", placeholder: "Название исследования" },
    { name: "ProductId", isSelect: true },
  ],
  ResearchResults: [{ name: "id" }],
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

  const [selectedProductPartyItem, setSelectedProductPartyItem] =
    useState<string>("");
  const [selectedSupplierPartyItem, setSelectedSupplierPartyItem] =
    useState<string>("");
  const [selectedManufacturerPartyItem, setSelectedManufacturerPartyItem] =
    useState<string>("");

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

  const [productOptions, setProductOptions] = useState<ProductModelOption[]>(
    []
  );
  const [supplierOptions, setSupplierOptions] = useState<SupplierModelOption[]>(
    []
  );
  const [manufacturerOptions, setManufacturerOptions] = useState<
    ManufacturerModel[]
  >([]);

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

        case "ResearchResults":
          if (item !== null) {
            const researchResultItem = item as ResearchResultModel;

            // Удаляем элемент с именем "result" из ResearchResults
            inputConfig.ResearchResults = inputConfig.ResearchResults.filter(
              (input) => input.name !== "result"
            );

            // Создаем новый объект resultInput
            const resultInput: InputConfig = {
              name: "result",
              placeholder: researchResultItem.result
                ? researchResultItem.result
                : researchResultItem.researchName,
            };

            // Добавляем новый объект resultInput в массив
            inputConfig.ResearchResults.push(resultInput);
          }
          break;

        case "Parties":
          if (item !== null) {
            const partyItem = item as PartyModel;
            const partiesProductsOptions = await GetProductsForOptionsAsync();
            if (partiesProductsOptions.length > 0) {
              const selectedProduct = partiesProductsOptions.find(
                (p) => p.productName === partyItem.productName
              );

              if (selectedProduct) {
                const productOptions: Option[] = partiesProductsOptions.map(
                  (product) => ({
                    id: product.id,
                    name: product.productName,
                  })
                );

                if (productOptions.length > 0) {
                  const selectedProductOption = selectedProduct.id;
                  setSelectedProductPartyItem(selectedProductOption);
                  setProductOptions(partiesProductsOptions);
                  setProductPartyOptions(productOptions);

                  const partiesSuppliersOptions =
                    await GetSuppliersForOptionsAsync();

                  if (partiesSuppliersOptions.length > 0) {
                    const selectedSupplier = partiesSuppliersOptions.find(
                      (s) => s.supplierName === partyItem.supplierName
                    );

                    if (selectedSupplier) {
                      const productSuppliers = partiesSuppliersOptions.filter(
                        (supplier) =>
                          selectedProduct.suppliersIds.includes(supplier.id)
                      );

                      const getSupplierOptions: Option[] = productSuppliers.map(
                        (supplier) => ({
                          id: supplier.id,
                          name: supplier.supplierName,
                        })
                      );

                      const selectedSupplierOption = selectedSupplier.id;
                      setSelectedSupplierPartyItem(selectedSupplierOption);
                      setSupplierOptions(partiesSuppliersOptions);
                      setSupplierPartyOptions(getSupplierOptions);

                      const partiesManufacturersOptions =
                        await GetManufacturersAsync();

                      if (partiesManufacturersOptions.length > 0) {
                        const selectedManufacturer =
                          partiesManufacturersOptions.find(
                            (m) => m.manufacturerName === partyItem.manufacturerName
                          );
                        if (selectedManufacturer) {
                          const supplierManufacturers =
                            partiesManufacturersOptions.filter((manufacturer) =>
                              selectedSupplier.manufacturersIds.includes(
                                manufacturer.id
                              )
                            );

                          const getManufacturerOptions: Option[] =
                            supplierManufacturers.map((manufacturer) => ({
                              id: manufacturer.id,
                              name: manufacturer.manufacturerName,
                            }));

                          const selectedManufacturerOption =
                            selectedManufacturer.id;
                          setSelectedManufacturerPartyItem(
                            selectedManufacturerOption
                          );
                          setManufacturerOptions(partiesManufacturersOptions);
                          setManufacturerPartyOptions(getManufacturerOptions);
                        }
                      }
                    }
                  }
                }
              }
            }
            setDateOfReceiptValue(partyItem.dateOfReceipt);
            setDateOfManufactureValue(partyItem.dateOfManufacture);
            setExpirationDateValue(partyItem.expirationDate);
          }
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
                router.push("/");
              }
            }

            const userRole = userItem.role;

            const selectedRole = roleOptions.find(
              (role) => role.name === userRole
            );

            const rolesWithSelectedState = roleOptions.map((role) => ({
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

            setOptions(rolesWithSelectedState);
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

        case "ResearchResults":
          if (item !== null) {
            const researchResultItem = item as ResearchResultModel;
            setTitleName(
              `Результат исследования партии №${researchResultItem.batchNumber}`
            );
          } else {
            setTitleName(`Результат исследования №`);
          }
          setImg("research");

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
      const selectedProduct = productOptions.find((p) => p.id === value);

      if (selectedProduct) {
        const productSuppliers = supplierOptions.filter((supplier) =>
          selectedProduct.suppliersIds.includes(supplier.id)
        );
        const selectedSupplier = productSuppliers[0];

        const getSupplierOptions: Option[] = productSuppliers.map(
          (supplier) => ({
            id: supplier.id,
            name: supplier.supplierName,
          })
        );

        const selectedSupplierOption = getSupplierOptions[0].id;
        setSelectedSupplierPartyItem(selectedSupplierOption);
        setSupplierPartyOptions(getSupplierOptions);

        if (selectedSupplier) {
          const supplierManufacturers = manufacturerOptions.filter(
            (manufacturer) =>
              selectedSupplier.manufacturersIds.includes(manufacturer.id)
          );

          const getManufacturerOptions: Option[] = supplierManufacturers.map(
            (manufacturer) => ({
              id: manufacturer.id,
              name: manufacturer.manufacturerName,
            })
          );

          const selectedManufacturerOption = getManufacturerOptions[0].id;
          setSelectedManufacturerPartyItem(selectedManufacturerOption);
          setManufacturerPartyOptions(getManufacturerOptions);
        }
      }
    } else if (name === "supplierId") {
      setSelectedSupplierPartyItem(value);
      const selectedSupplier = supplierOptions.find((s) => s.id === value);

      if (selectedSupplier) {
        const supplierManufacturers = manufacturerOptions.filter(
          (manufacturer) =>
            selectedSupplier.manufacturersIds.includes(manufacturer.id)
        );

        const getManufacturerOptions: Option[] = supplierManufacturers.map(
          (manufacturer) => ({
            id: manufacturer.id,
            name: manufacturer.manufacturerName,
          })
        );

        const selectedManufacturerOption = getManufacturerOptions[0].id;
        setSelectedManufacturerPartyItem(selectedManufacturerOption);
        setManufacturerPartyOptions(getManufacturerOptions);
      }
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
            { id: productItem.id, productName: "", unitsOfMeasurement: "" }
          );

          const updateProductModel: UpdateProductModel = {
            id: updateItem.id,
            productName: updateItem.productName,
            unitsOfMeasurement: updateItem.unitsOfMeasurement,
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

          const updateResearchModel: UpdateResearchModel = {
            id: updateItem.id,
            researchName: updateItem.researchName,
            productId: selectedItem,
          };

          const result = await UpdateResearchAsync(updateResearchModel);
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

      case "ResearchResults":
        if (item !== null) {
          const researchResultsItem = item as ResearchResultModel;
          const updateItem: ResearchResultModel = Object.keys(
            researchResultsItem
          ).reduce(
            (acc, key) => {
              acc[key as keyof ResearchResultModel] =
                formData[key] !== undefined && formData[key] !== ""
                  ? formData[key]
                  : researchResultsItem[key as keyof ResearchResultModel];
              return acc;
            },
            {
              id: researchResultsItem.id,
              researchName: researchResultsItem.researchName,
              batchNumber: researchResultsItem.batchNumber,
              result: "",
            }
          );

          const updateResearchResultModel: ResearchResultModel = {
            id: updateItem.id,
            researchName: updateItem.researchName,
            batchNumber: updateItem.batchNumber,
            result: updateItem.result,
          };

          const result = await UpdateResearchResultAsync(
            updateResearchResultModel
          );
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
              responsible: "",
              note: "",
            }
          );

          let isFieldValidType = true;
          const partyTypeFieldErrors: PartyValidationErrorModel = {
            ...partyErrors,
          };

          if (
            !CanBeConvertedToNumberWithoutLeadingZero(
              updateItem.batchNumber.toString()
            )
          ) {
            partyTypeFieldErrors.batchNumber =
              "Неверные формат данных! должны быть только цифры и не может начинаться с 0.";
            setPartyErrors(partyTypeFieldErrors);
            isFieldValidType = false;
          } else {
            partyTypeFieldErrors.batchNumber = "";
            setPartyErrors(partyTypeFieldErrors);
          }

          if (!CanBeConvertedToFloat(updateItem.batchSize.toString())) {
            partyTypeFieldErrors.batchSize =
              "Неверные формат данных! должны быть только цифры.";
            setPartyErrors(partyTypeFieldErrors);
            isFieldValidType = false;
          } else {
            partyTypeFieldErrors.batchSize = "";
            setPartyErrors(partyTypeFieldErrors);
          }

          if (!CanBeConvertedToFloat(updateItem.sampleSize.toString())) {
            partyTypeFieldErrors.sampleSize =
              "Неверные формат данных! должны быть только цифры.";
            setPartyErrors(partyTypeFieldErrors);
            isFieldValidType = false;
          } else {
            partyTypeFieldErrors.sampleSize = "";
            setPartyErrors(partyTypeFieldErrors);
          }

          if (!CanBeConvertedToNumberWithAnyDigits(updateItem.ttn.toString())) {
            partyTypeFieldErrors.ttn =
              "Неверные формат данных! должны быть только цифры.";
            setPartyErrors(partyTypeFieldErrors);
            isFieldValidType = false;
          } else {
            partyTypeFieldErrors.ttn = "";
            setPartyErrors(partyTypeFieldErrors);
          }

          if (isFieldValidType) {
            const updatePartyModel: UpdatePartyModel = {
              id: updateItem.id,
              batchNumber: updateItem.batchNumber,
              dateOfReceipt: dateOfReceiptValue,
              productId: selectedProductPartyItem,
              supplierId: selectedSupplierPartyItem,
              manufacturerId: selectedManufacturerPartyItem,
              batchSize: updateItem.batchSize,
              sampleSize: updateItem.sampleSize,
              ttn: updateItem.ttn,
              documentOnQualityAndSafety: updateItem.documentOnQualityAndSafety,
              testReport: updateItem.testReport,
              dateOfManufacture: dateOfManufactureValue,
              expirationDate: expirationDateValue,
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
        }
        break;

      case "Users":
        if (item !== null) {
          const userItem = item as UserModel;

          const updateItem: UserModel = Object.keys(userItem).reduce(
            (acc, key) => {
              acc[key as keyof UserModel] =
                formData[key] !== undefined && formData[key] !== ""
                  ? formData[key]
                  : userItem[key as keyof UserModel];
              return acc;
            },
            {
              id: userItem.id,
              role: "",
              surname: "",
              userName: "",
              patronymic: "",
              email: "",
            }
          );

          const updateUserModel: UpdateUserModel = {
            id: updateItem.id,
            role: selectedItem,
            surname: updateItem.surname,
            userName: updateItem.userName,
            patronymic: updateItem.patronymic,
          };

          const result = await UpdateUserAsync(updateUserModel);
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
                        value={
                          input.name === "productId"
                            ? selectedProductPartyItem
                            : input.name === "supplierId"
                            ? selectedSupplierPartyItem
                            : input.name === "manufacturerId"
                            ? selectedManufacturerPartyItem
                            : selectedItem
                        }
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
                        //required
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
                        //required
                      />
                    </div>
                  ) : input.name === "result" ? (
                    <div>
                      <input
                        type="text"
                        name={input.name}
                        id={input.name}
                        placeholder={input.placeholder}
                        onChange={handleInputChange}
                        // required
                      />
                    </div>
                  ) : (
                    <div>
                      <input
                        type="text"
                        name={input.name}
                        id={input.name}
                        placeholder={
                          item && item[input.name] !== undefined
                            ? item[input.name]
                            : input.placeholder
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
                Сохранить
              </button>
              {tableName === "Parties" && (
                <h3 style={{ color: "yellow", fontWeight: "bold" }}>
                  При изменении продукта все результаты исследований будут
                  удалены!
                </h3>
              )}
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
