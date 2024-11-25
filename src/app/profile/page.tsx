"use client";

import { useEffect, useState } from "react";
import "./style.css";
import { UpdateUserDetailsModel } from "@/Models/UserModels/UpdateUserDetailsModel";
import { UserValidationErrorModel } from "@/Models/UserModels/UserValidationErrorModel";
import { useRouter } from "next/navigation";
import { UpdateUserDetailsAsync } from "@/services/UserServices/UpdateUserDetailsAsync";
import { GetUserAsync } from "@/services/UserServices/GetUserAsync";
import { UserModel } from "@/Models/UserModels/UserModel";

export default function Profile() {
  const [formData, setFormData] = useState<UpdateUserDetailsModel>({
    id: "",
    surname: "",
    userName: "",
    patronymic: "",
  });

  const router = useRouter();

  const [errors, setErrors] = useState<string>();
  const [userErrors, setUserErrors] = useState<UserValidationErrorModel>({});
  const [successMessage, setSuccessMessage] = useState<string>();

  const [userData, setUserData] = useState<UserModel | null>();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const user = await GetUserAsync();
      setUserData(user);
    };

    getUser();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();

    const updatedUserData: UpdateUserDetailsModel = {
      id: userData?.id || "",
      surname: formData.surname || userData?.surname || "",
      userName: formData.userName || userData?.userName || "",
      patronymic: formData.patronymic || userData?.patronymic || "",
    };

    setUserData(updatedUserData as UserModel);

    const result = await UpdateUserDetailsAsync(updatedUserData);
    const [response, statusCode] = result;
    console.log(response);
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

    const handleToggleEditClick = () => {
      setIsEditing((prev) => !prev); 
    };

  return (
    <div className="page-profile">
      <div className="profile-container">
        <div className="profile-content">
          <form className="profile-form">
            <h2 className="form-title">Профиль</h2>
            <div className="user-profile-form" id="user-profile-form">
              <div className="form-group">
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      name="surname"
                      id="surname"
                      placeholder={userData?.surname}
                      value={formData.surname}
                      onChange={handleInputChange}
                    />
                    <span className="error-message">{userErrors.Surname}</span>
                  </div>
                ) : (
                  <div>
                    <h2>Фамилия: {userData?.surname}</h2>
                  </div>
                )}
              </div>
              <div className="form-group">
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      name="userName"
                      id="userName"
                      placeholder={userData?.userName}
                      value={formData.userName}
                      onChange={handleInputChange}
                    />
                    <span className="error-message">{userErrors.UserName}</span>
                  </div>
                ) : (
                  <div>
                    <h2>Имя: {userData?.userName}</h2>
                  </div>
                )}
              </div>
              <div className="form-group">
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      name="patronymic"
                      id="patronymic"
                      placeholder={userData?.patronymic}
                      value={formData.patronymic}
                      onChange={handleInputChange}
                    />
                    <span className="error-message">
                      {userErrors.Patronymic}
                    </span>
                  </div>
                ) : (
                  <div>
                    <h2>Отчество: {userData?.patronymic}</h2>
                  </div>
                )}
              </div>

              {isEditing ? (
                <div className="button-container">
                  <div
                    className="form-group form-button"
                    style={{ marginTop: "10px" }}
                  >
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
                  <div
                    className="form-group form-button"
                    style={{ marginTop: "15px" }}
                  >
                    <button
                      type="submit"
                      name="signup"
                      id="signup"
                      className="form-submit"
                      onClick={handleToggleEditClick}
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className="form-group form-button"
                  style={{ marginTop: "10px" }}
                >
                  <button
                    type="submit"
                    name="signup"
                    id="signup"
                    className="form-submit"
                    onClick={handleToggleEditClick}
                  >
                    Редактировать
                  </button>
                </div>
              )}
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
