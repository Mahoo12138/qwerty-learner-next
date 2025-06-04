import logo from "@/assets/logo.svg";
import type { PropsWithChildren } from "react";
import type React from "react";
import { Link } from "@tanstack/react-router";

const Header: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <header className="">
      <div className="">
        <Link
          className=""
          to="/"
        >
          <img
            src={logo}
            className=""
            alt="Qwerty Learner Logo"
          />
          <h1>Qwerty Learner</h1>
        </Link>
        {children && (
          <nav className="">
            {children}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
