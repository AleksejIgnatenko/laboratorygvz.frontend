"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import "./style.css";

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
    Providers: [
        { name: 'providerName', placeholder: 'Поставщик' },
        { name: 'legalAddress	', placeholder: 'Юредический адрес' },
    ],

    Products: [
        { name: 'dateOfReceipt', placeholder: 'Дата получения' },
        { name: 'productName', placeholder: 'Название продукта' },
        { name: 'providerId', placeholder: 'Поставщик', isSelect: true },
        { name: 'batchSize', placeholder: 'Размер партии' },
        { name: 'sampleSize', placeholder: 'Размер выборки' },
        { name: 'ttn', placeholder: 'ТТН' },
        { name: 'documentOnQualityAndSafety', placeholder: 'Документ по качеству и безопасности' },
        { name: 'testReport', placeholder: 'Протокол испытаний' },
    ],

    Researches: [
        { name: 'researchName', placeholder: 'Название исследования' },
        { name: 'ProductId', placeholder: 'Название продукта', isSelect: true },
        // { name: 'сonclusion', placeholder: 'Вывод' },
    ],

    Experiments: [
        { name: 'experimentName', placeholder: 'Да' },
        { name: 'result', placeholder: 'Результат' },
        { name: 'researchId', placeholder: 'Исследование', isSelect: true },
    ]
};

export default function AddPage() {
    const searchParams = useSearchParams();
    const tableName = searchParams.get('tableName');
    const inputs = tableName && tableName in inputConfig ? inputConfig[tableName] : [];

    const [options, setOptions] = useState<Option[]>([]);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const fetchOptions = async () => {
            switch (tableName) {
                case "Products":
                    console.log("Products");
                    const productOptions: Option[] = [
                        { id: '1', name: 'Provider A' },
                        { id: '2', name: 'Provider B' },
                        { id: '3', name: 'Provider C' },
                        { id: '4', name: 'Provider D' },
                        { id: '5', name: 'Provider E' },
                    ];
                    setOptions(productOptions);
                    // Call method to fetch providers
                    break;

                case "Researches":
                    console.log("Researches");
                    const researchOptions: Option[] = [
                        { id: '1', name: 'Product A' },
                        { id: '2', name: 'Product B' },
                        { id: '3', name: 'Product C' },
                        { id: '4', name: 'Product D' },
                        { id: '5', name: 'Product E' },
                    ];
                    setOptions(researchOptions);
                    // Call method to fetch products
                    break;

                case "Experiments":
                    console.log("Experiments");
                    // Call method to fetch studies and users
                    break;

                default:
                    console.log("Unknown table name");
                    break;
            }
        };

        fetchOptions();
    }, []);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log('Form submitted:', formData);
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
                                                <option value="" disabled selected>
                                                    {input.placeholder}
                                                </option>
                                                {options.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    ) 
                                    // : input.name === 'сonclusion' ? (
                                    //     <input
                                    //         type="text"
                                    //         name={input.name}
                                    //         id={input.name}
                                    //         placeholder={input.placeholder}
                                    //         onChange={handleInputChange}
                                    //     />
                                    // ) 
                                    : (
                                        <input
                                            type="text"
                                            name={input.name}
                                            id={input.name}
                                            placeholder={input.placeholder}
                                            onChange={handleInputChange}
                                            required
                                        />
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
                    </form>
                    <div className="add-image">
                        <img
                            src="/images/registration2.png"
                            className="registration-img"
                            alt="Add image"
                        />
                        <Link href="/login" className="add-link">
                            Back
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}