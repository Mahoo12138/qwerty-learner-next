import logo from "@/assets/logo.svg";
import type { PropsWithChildren } from "react";
import type React from "react";
import { Link as RouterLink } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Settings, LogOut, Info } from "lucide-react";

const Header: React.FC<PropsWithChildren> = ({ children }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  return (
    <header className="py-5 px-6">
      <div className="container">
        <div className="is-flex is-justify-content-space-between is-align-items-center">
          <RouterLink
            className="is-flex is-align-items-center"
            to="/"
          >
            <img
              src={logo}
              className="mr-4"
              style={{ height: "3.5rem" }}
              alt="Qwerty Learner Logo"
            />
            <h1 className="title is-2 mb-0">Qwerty Learner</h1>
          </RouterLink>
          <div className="is-flex is-align-items-center">
            <div
              className={`dropdown is-hoverable is-right${dropdownOpen ? " is-active" : ""}`}
              ref={dropdownRef}
            >
              <div className="dropdown-trigger image">
                <img
                  src="https://avatars.githubusercontent.com/u/45908451"
                  className="is-rounded"
                  style={{ width: "3rem", height: "3rem" }}
                  alt="User Avatar"
                />
              </div>
              <div className="dropdown-menu" id="dropdown-menu" role="menu">
                <div className="dropdown-content">
                  <RouterLink to="/setting" className="dropdown-item is-flex is-align-items-center">
                    <Settings size={18} className="mr-2" />
                    设置
                  </RouterLink>
                  <RouterLink to="/about" className="dropdown-item is-flex is-align-items-center">
                    <Info size={18} className="mr-2" />
                    关于
                  </RouterLink>
                  <hr className="dropdown-divider" />
                  <button className="dropdown-item is-flex is-align-items-center has-text-danger">
                    <LogOut size={18} className="mr-2" />
                    退出登录
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
