"use client";

import { useState } from "react";
import "./style.css";
import Link from "next/link";
import { RegistrationUserModelRequest } from "../Models/RegistrationUserModelRequest";
import { RegistrationUserAsync } from "@/services/UserServices/RegistrationUserAsync";

export default function Registration() {
  const [formData, setFormData] = useState<RegistrationUserModelRequest>({
    surname: "",
    userName: "",
    patronymic: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegistration = async (event: React.FormEvent) => {
    event.preventDefault();
    await RegistrationUserAsync(formData);
  };


  return (
    <div className="page-registration">
      <div className="registration-container">
        <div className="signup-content">
          <form className="signup-form">
            <h2 className="form-title">Registration</h2>
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
              </div>
              <div className="form-group form-button">
                <button
                  type="submit"
                  name="signup"
                  id="signup"
                  className="form-submit"
                  onClick={handleRegistration}
                >
                  Register
                </button>
              </div>
            </div>
          </form>
          <div className="signup-image">
            <img
              src="/Images/registration2.png"
              className="registration-img"
              alt="Sign up image"
            />
            <Link href="/login" className="signin-link">
              I already have an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}