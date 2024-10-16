"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import "./style.css";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };


  return (
    <div className="page-login">
      <div className="login-container">
        <div className="signin-content">
          <form className="signin-form">
            <h2 className="form-title">Login</h2>
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
                >
                  Sign in
                </button>
              </div>
            </div>
          </form>
          <div className="signin-image">
            <img src="/Images/login2.png" className="login-img" alt="Login image" />
            <Link href="/registration" className="signin-link">
              I already have an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}