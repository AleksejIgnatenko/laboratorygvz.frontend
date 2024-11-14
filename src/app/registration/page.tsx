"use client";

import { useState } from "react";
import "./style.css";
// import { useRouter } from "next/navigation";

import { RegistrationUserModelRequest } from "../../Models/UserModels/RegistrationUserModelRequest";
import { RegistrationUserAsync } from "@/services/UserServices/RegistrationUserAsync";
import { UserValidationErrorModel } from "../../Models/UserModels/UserValidationErrorModel";
import Link from "next/link";

export default function Registration() {
  // const router = useRouter();
  const [formData, setFormData] = useState<RegistrationUserModelRequest>({
    surname: "",
    userName: "",
    patronymic: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  const [errors, setErrors] = useState<string>();
  const [userErrors, setUserErrors] =
    useState<UserValidationErrorModel>({});

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegistration = async (event: React.FormEvent) => {
    event.preventDefault();
    const result = await RegistrationUserAsync(formData);
    const [response, statusCode] = result;
    if (statusCode === 200) {
      // router.push('/');
      window.location.href = "/";
    } else if (statusCode === 400) {
      setErrors("");
      setUserErrors(response);
    } else if (statusCode === 409) {
      setErrors(response);
      setUserErrors({});
    }
  };

  return (
    <div className="page-registration">
      <div className="registration-container">
        <div className="signup-content">
          <form className="signup-form">
            <h2 className="form-title">Регистрация</h2>
            <div className="register-form" id="register-form">
              <div className="form-group">
                <input
                  type="text"
                  name="surname"
                  id="surname"
                  placeholder="Your surname"
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
                  placeholder="Your Name"
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
                  placeholder="Your Patronymic"
                  value={formData.patronymic}
                  onChange={handleInputChange}
                />
                <span className="error-message">{userErrors.Patronymic}</span>
              </div>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                <span className="error-message">{userErrors.Email}</span>
              </div>
              <div className="form-group">
                <label>
                  <i data-feather="lock" className="material-icons-name"></i>
                </label>
                <input
                  type="password"
                  name="password"
                  id="pass"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <span className="error-message">{userErrors.Password}</span>
              </div>
              <div className="form-group">
                <label>
                  <i data-feather="lock" className="material-icon-name"></i>
                </label>
                <input
                  type="password"
                  name="repeatPassword"
                  id="repeatPassword"
                  placeholder="Repeat your password"
                  value={formData.repeatPassword}
                  onChange={handleInputChange}
                />
                <span className="error-message">
                  {userErrors.RepeatPassword}
                </span>
              </div>
              <div className="form-group form-button">
                <button
                  type="submit"
                  name="signup"
                  id="signup"
                  className="form-submit"
                  onClick={handleRegistration}
                >
                  Зарегистрироваться
                </button>
              </div>
            </div>
            <span className="error-message">{errors}</span>
          </form>
          <div className="signup-image">
            <img
              src="/images/registration2.png"
              className="registration-img"
              alt="Sign up image"
            />
            <Link href="/login" className="signin-link">
              У меня уже есть аккаунт
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
