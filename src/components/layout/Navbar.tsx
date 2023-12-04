import { Link, useMatch, useResolvedPath } from "react-router-dom";
import { useState, useEffect } from "react";
import FormButton from "../ui/shared/FormButton";
import { useAuth } from "../../lib/hooks/useAuth";
import Moon from "../ui/shared/icons/Moon";
import Sun from "../ui/shared/icons/Sun";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [show, setShow] = useState(false);

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const storedValue = localStorage.getItem("darkMode");
    return storedValue ? JSON.parse(storedValue) : true;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <div className="dark:bg-black bg-white text-black dark:text-white shadow-lg mb-[100px] border-y-2 dark:border-gray-500 border-gray-200">
      <div className="container flex items-center px-7">
        <Link to="/" className="text-3xl font-bold hidden sm:block">
          react-tasks
        </Link>

        <div className="contents font-semibold text-base lg:text-lg">
          <ul className="mx-auto flex items-center">
            <li className="p-5 xl:p-8">
              <ActiveLink to="/products">Products</ActiveLink>
            </li>
            <li className="p-5 xl:p-8">
              <ActiveLink to="/appointments">Appointments</ActiveLink>
            </li>
          </ul>
        </div>

        {user ? (
          <div onClick={() => setShow((prev) => !prev)} className="relative">
            <FormButton variant="primary">{user.email}</FormButton>
            {show && (
              <div className="absolute top-full right-0 mt-2 w-40 dark:bg-[#2c2c2c] bg-white border rounded-lg flex flex-col gap-3">
                <FormButton
                  href="/profile"
                  variant="warning"
                  className="w-full"
                >
                  Profile
                </FormButton>
                <FormButton
                  onClick={logout}
                  variant="danger"
                  className="w-full"
                >
                  Logout
                </FormButton>
              </div>
            )}
          </div>
        ) : (
          <FormButton href="/register">Sign Up</FormButton>
        )}

        <FormButton
          className="mx-3"
          onClick={() => setDarkMode((prev) => !prev)}
        >
          {darkMode ? <Moon /> : <Sun />}
        </FormButton>
      </div>
    </div>
  );
};

interface IActiveLinkProps {
  to: string;
  children?: React.ReactNode;
}

const ActiveLink: React.FC<IActiveLinkProps> = ({ to, children }) => {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });

  return (
    <Link to={to} className={`${isActive ? "text-red-500" : ""}`}>
      {children}
    </Link>
  );
};

export default Navbar;
