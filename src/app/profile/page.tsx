"use client";

import { useEffect, useState } from "react";
import "./style.css";
import { UpdateUserDetailsModel } from "@/Models/UserModels/UpdateUserDetailsModel";
import { UserValidationErrorModel } from "@/Models/UserModels/UserValidationErrorModel";
import { useRouter } from "next/navigation";
import { UpdateUserDetailsAsync } from "@/services/UserServices/UpdateUserDetailsAsync";
import { GetUserAsync } from "@/services/UserServices/GetUserAsync";

export default function Profile() {
  const [formData, setFormData] = useState<UpdateUserDetailsModel>({
    surname: "",
    userName: "",
    patronymic: "",
  });

  const router = useRouter();

  const [errors, setErrors] = useState<string>();
  const [userErrors, setUserErrors] = useState<UserValidationErrorModel>({});
  const [successMessage, setSuccessMessage] = useState<string>();

    useEffect(() => {
      const getUser = async () => {
        const user = await GetUserAsync();
      };

      getUser();
    }, []); 

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    const result = await UpdateUserDetailsAsync(formData);
    const [response, statusCode] = result;
    if (statusCode === 200) {
      setSuccessMessage(response);
      setUserErrors({});
      setErrors("");
    } else if (statusCode === 400) {
      setSuccessMessage("");
      setUserErrors(response);
      setErrors("");
    } else if (statusCode === 409) {
      setSuccessMessage("");
      setUserErrors({});
      setErrors(response);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="page-profile">
      <div className="profile-container">
        <div className="profile-content">
          <form className="profile-form">
            <h2 className="form-title">Профиль</h2>
            <div className="user-profile-form" id="user-profile-form">
              <div className="form-group">
                <input
                  type="text"
                  name="surname"
                  id="surname"
                  placeholder="Фамилия"
                  value={formData.surname}
                  onChange={handleInputChange}
                />
                <span className="error-message">{userErrors.Surname}</span>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="userName"
                  id="userName"
                  placeholder="Имя"
                  value={formData.userName}
                  onChange={handleInputChange}
                />
                <span className="error-message">{userErrors.UserName}</span>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="patronymic"
                  id="patronymic"
                  placeholder="Отчество"
                  value={formData.userName}
                  onChange={handleInputChange}
                />
                <span className="error-message">{userErrors.Patronymic}</span>
              </div>
              <div className="form-group form-button">
                <button
                  type="submit"
                  name="signup"
                  id="signup"
                  className="form-submit"
                  onClick={handleUpdate}
                >
                  Сохранить
                </button>
              </div>
            </div>
            <span className="success-message">{successMessage}</span>
            <span className="error-message">{errors}</span>
          </form>
          <div className="signin-image">
            <img
              src="/images/login2.png"
              className="login-img"
              alt="Login image"
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
