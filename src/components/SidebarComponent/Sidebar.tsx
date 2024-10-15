"use client";

import "./Sidebar.css";
import "boxicons/css/boxicons.min.css"; // Обновленный импорт стилей Boxicons
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Установите значение в зависимости от состояния входа в систему

  const sidebarItems = [
    { link: "/", icon: "bx bx-home-alt-2", name: "Home", tooltip: "Home" },
    { link: "/users", icon: "bx bx-user", name: "Users", tooltip: "User" },
    { link: "/researches", icon: "bx bx-book-content", name: "Research", tooltip: "Research" },
    { link: "#", icon: "bx bx-test-tube", name: "Experiments", tooltip: "Experiments" },
    { link: "#", icon: "bx bx-package", name: "Products", tooltip: "Products" },
    { link: "#", icon: "bx bx-receipt", name: "Orders", tooltip: "Orders" },
    { link: "#", icon: "bx bx-cog", name: "Setting", tooltip: "Setting" },
  ];

  useEffect(() => {
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

    closeBtn?.addEventListener("click", handleSidebarToggle);
    searchBtn?.addEventListener("click", handleSidebarToggle);

    return () => {
      closeBtn?.removeEventListener("click", handleSidebarToggle);
      searchBtn?.removeEventListener("click", handleSidebarToggle);
    };
  }, []);

  return (
    <div className="sidebar">
      <div className="logo-details">
        <i className="bx bxl-codepen icon"></i>
        <div className="logo_name">SideMenu</div>
        <i className="bx bx-menu" id="btn"></i>
      </div>
      <ul className="nav-list">
        <li>
          <i className="bx bx-search"></i>
          <input type="text" placeholder="Search..." />
          <span className="tooltip">Search</span>
        </li>
        {sidebarItems.map((item, index) => (
          <li key={index}>
            <Link href={item.link}>
              <i className={item.icon}></i>
              <span className="links_name">{item.name}</span>
            </Link>
            <span className="tooltip">{item.tooltip}</span>
          </li>
        ))}
        {isLoggedIn ? (
          <li className="profile">
            <div className="profile-details">
              <i className="bx bx-id-card"></i>
              <div className="name_job">
                <div className="name">Account</div>
              </div>
            </div>
            <i className="bx bx-user" id="log_in"></i>
          </li>
        ) : (
          <li className="profile">
            <div className="profile-details">
              <i className="bx bx-export"></i>
              <div className="name_job">
                <div className="name"><Link href="#">Login</Link> or <Link href="/registration">Registration</Link></div>
              </div>
            </div>
            <i className="bx bx-log-in" id="log_in"></i>
          </li>
        )}
      </ul>
    </div>
  );
}
