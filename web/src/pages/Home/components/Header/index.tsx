import logo from "@/assets/logo.svg";
import { Link } from "@tanstack/react-router";

const Header: React.FC = () => {
  return (
    <header className="container z-20 mx-auto w-full px-10 py-6">
      <div className="flex w-full flex-col items-center justify-between space-y-3 lg:flex-row lg:space-y-0">
        <Link
          className="flex items-center text-2xl font-bold text-indigo-500 no-underline hover:no-underline lg:text-4xl"
          to="/"
        >
          <img
            src={logo}
            className="mr-3 h-16 w-16"
            alt="Qwerty Learner Logo"
          />
          <h1>Qwerty Learner</h1>
        </Link>

      </div>
    </header>
  );
};

export default Header;
