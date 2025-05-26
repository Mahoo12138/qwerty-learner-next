import logo from "@/assets/logo.svg";
import type { PropsWithChildren } from "react";
import type React from "react";
import { Link } from "@tanstack/react-router";

const Header: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <header className="z-20 mx-auto w-full px-10 py-6 flex items-center justify-between">
      <div className="flex w-full flex-col items-center justify-between space-y-3 lg:flex-row lg:space-y-0">
        <Link
          className="flex items-center text-2xl font-bold text-indigo-500 no-underline hover:no-underline lg:text-4xl"
          to="https://qwerty.kaiyi.cool/"
        >
          <img
            src={logo}
            className="mr-3 h-16 w-16"
            alt="Qwerty Learner Logo"
          />
          <h1>Qwerty Learner</h1>
        </Link>
        {children && (
          <nav className="my-card on element flex w-auto content-center items-center justify-end space-x-3 rounded-xl bg-white p-4 transition-colors duration-300 dark:bg-gray-800">
            {children}
          </nav>
        )}
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
