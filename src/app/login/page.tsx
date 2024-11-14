"use client";

import { useState } from "react";
import "./style.css";
// import { useRouter } from "next/navigation";
import Link from "next/link";
import { LoginUserModel } from "../../Models/UserModels/LoginUserModel";
import { LoginUserAsync } from "@/services/UserServices/LoginUserAsync";

export default function Login() {
  // const router = useRouter();
  const [formData, setFormData] = useState<LoginUserModel>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<string>();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    const result = await LoginUserAsync(formData);
    if (result) {
      setErrors(result);
    } else {
      setErrors("");
      // router.push("/");
      window.location.href = "/";
    }
  };

  return (
    <div className="page-login">
      <div className="login-container">
        <div className="signin-content">
          <form className="signin-form">
            <h2 className="form-title">Вход</h2>
            <div className="login-form" id="login-form">
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
                <input
                  type="password"
                  name="password"
                  id="pass"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group form-button">
                <button
                  type="submit"
                  name="signup"
                  id="signup"
                  className="form-submit"
                  onClick={handleLogin}
                >
                  Войти
                </button>
              </div>
            </div>
            <span className="error-message">{errors}</span>
          </form>
          <div className="signin-image">
            <img
              src="/images/login2.png"
              className="login-img"
              alt="Login image"
            />
            <Link href="/registration" className="signup-link">
              У меня нет аккаунта
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}