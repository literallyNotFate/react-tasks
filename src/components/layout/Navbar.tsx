import { Link, useMatch, useResolvedPath } from "react-router-dom";
import { useState } from "react";
import FormButton from "../ui/shared/FormButton";
import { useAuth } from "../../lib/hooks/useAuth";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [show, setShow] = useState(false);

  return (
    <div className="bg-black text-white shadow-lg mb-[100px] border-y-2 border-gray-500">
      <div className="container flex items-center px-7">
        <Link to="/" className="text-3xl font-bold hidden sm:block">
          react-tasks
        </Link>

        <div className="contents font-semibold text-base lg:text-lg">
          <ul className="mx-auto flex items-center">
            <li className="p-5 xl:p-8 active">
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
              <div className="absolute top-full right-0 mt-2 w-40 bg-[#2c2c2c] border rounded-lg">
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
