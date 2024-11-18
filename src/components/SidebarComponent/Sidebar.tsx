"use client";

import "./Sidebar.css";
import "boxicons/css/boxicons.min.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IsAdminOrManagerAsync } from "@/services/UserServices/IsAdminOrManagerAsync ";
import { getCookie } from "@/services/Infrastructure/getCookie";

export default function Sidebar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const router = useRouter();

  const [sidebarItems, setSidebarItems] = useState([
    { link: "/", icon: "bx bx-home-alt-2", name: "Домашняя", tooltip: "Домашняя" },
    { link: "#", icon: "bx bx-test-tube", name: "Experiments", tooltip: "Experiments" },
    { link: "/researches", icon: "bx bx-book-content", name: "Иследования", tooltip: "Иследования" },
    { link: "/products", icon: "bx bx-package", name: "Продукты", tooltip: "Продукты" },
    { link: "/suppliers", icon: "bx bx-car", name: "Поставщики", tooltip: "Поставщики" },
    { link: "/manufacturers", icon: "bx bx-buildings", name: "Производители", tooltip: "Производители" },
  ]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const jwtToken = getCookie("jwtToken");
      if(jwtToken) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      
      // Получаем сохранённую тему из localStorage
      const savedTheme = localStorage.getItem("theme");
      const initialTheme = savedTheme ? savedTheme === "dark" : true;
      setIsDarkTheme(initialTheme);
      
      const root = document.documentElement;
      root.setAttribute("data-theme", initialTheme ? "dark" : "light");
      localStorage.setItem("theme", initialTheme ? "dark" : "light");
  
      const sidebar = document.querySelector(".sidebar");
      const closeBtn = document.querySelector("#btn");
      const searchBtn = document.querySelector(".bx-search");
  
      const menuBtnChange = () => {
        if (sidebar) {
          if (sidebar.classList.contains("open")) {
            closeBtn?.classList.replace("bx-menu", "bx-menu-alt-right");
          } else {
            closeBtn?.classList.replace("bx-menu-alt-right", "bx-menu");
          }
        }
      };
  
      const handleSidebarToggle = () => {
        if (sidebar) {
          sidebar.classList.toggle("open");
          menuBtnChange();
        }
      };
  
      // Sidebar hotkey
      const handleKeyDown = (event: KeyboardEvent) => {
        // Alt + 1
        if (event.altKey && event.key === "1") {
          router.push("/");
        }
        // Alt + 2
        if (event.altKey && event.key === "2") {
          router.push("/researches");
        }
        // Alt + 3
        if (event.altKey && event.key === "3") {
          router.push("/#");
        }
        // Alt + 4
        if (event.altKey && event.key === "4") {
          router.push("/products");
        }
        // Alt + 5
        if (event.altKey && event.key === "5") {
          router.push("/suppliers");
        }
        // Alt + 6
        if (event.altKey && event.key === "6") {
          router.push("/users");
        }
        // // Alt + T
        // if (event.altKey && (event.key.toLowerCase() === 't') || event.key.toLowerCase() === 'е') {
        //   toggleColorScheme();
        // }
      };
  
      closeBtn?.addEventListener("click", handleSidebarToggle);
      searchBtn?.addEventListener("click", handleSidebarToggle);
      window.addEventListener('keydown', handleKeyDown);
  
      return () => {
        closeBtn?.removeEventListener("click", handleSidebarToggle);
        searchBtn?.removeEventListener("click", handleSidebarToggle);
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, []);

    const checkUserRole = async () => {
      const isAdminOrManager = await IsAdminOrManagerAsync();
      if (isAdminOrManager) {
        setSidebarItems((prevItems) => [
          ...prevItems,
          {
            link: "/users",
            icon: "bx bx-group",
            name: "Пользователи",
            tooltip: "Пользователи",
          },
        ]);
      }
    };

    useEffect(() => {
      checkUserRole();
    }, []);

  const toggleColorScheme = () => {
    setIsDarkTheme((prev) => {
      const newTheme = !prev;
      const root = document.documentElement;
      root.setAttribute("data-theme", newTheme ? "dark" : "light");
      localStorage.setItem("theme", newTheme ? "dark" : "light");
      return newTheme;
    });
  };

  return (
    <div className="sidebar" tabIndex={0}>
      <div className="logo-details">
        <i className="bx bxl-codepen icon"></i>
        <div className="logo_name">Меню</div>
        <i className="bx bx-menu" id="btn"></i>
      </div>
      <ul className="nav-list">
        {sidebarItems.map((item, index) => (
          <li key={index}>
            <Link href={item.link}>
              <i className={item.icon}></i>
              <span className="links_name">{item.name}</span>
            </Link>
            <span className="tooltip">{item.tooltip}</span>
          </li>
        ))}
        <li className="switch-themes">
          <input
            type="checkbox"
            className="l"
            checked={!isDarkTheme}
            onChange={toggleColorScheme}
          />
        </li>
        {isLoggedIn ? (
          <li className="profile">
            <div className="profile-details">
              <i className="bx bx-id-card"></i>
              <div className="name_job">
                <div className="name">
                  <Link href="/profile">Профиль</Link>
                </div>
              </div>
            </div>
            <i className="bx bx-user-circle" id="log_in"></i>
          </li>
        ) : (
          <li className="profile">
            <div className="profile-details">
              <i className="bx bx-export"></i>
              <div className="name_job">
                <div className="name">
                  <Link href="/login">Вход</Link> или{" "}
                  <Link href="/registration">Регистрация</Link>
                </div>
              </div>
            </div>
            <i className="bx bx-log-in" id="log_in"></i>
          </li>
        )}
      </ul>
    </div>
  );
}