import logo from "@/assets/logo.svg";
import type { PropsWithChildren } from "react";
import type React from "react";
import { Link as RouterLink } from "@tanstack/react-router";

const Header: React.FC<PropsWithChildren> = ({ children }) => {
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
            <span className="has-text-grey mr-3">mahoo12138</span>
            <div className="is-flex is-align-items-center image">
              <img
                src="https://avatars.githubusercontent.com/u/45908451"
                className="is-rounded"
                style={{ width: "3rem", height: "3rem" }}
                alt="User Avatar"
              />
            </div>
          </div>

        </div>
      </div>
      <div className="relative element-shadow">
        <img
          alt="User Profile Picture"
          className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-4 border-white"
          src="https://avatars.githubusercontent.com/u/45908451"
        />
        <span className="absolute -bottom-1 -right-1 bg-app-primary text-white text-xs sm:text-xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full element-shadow">
          Lvl 3
        </span>
      </div>
    </header>
  );
};

export default Header;
