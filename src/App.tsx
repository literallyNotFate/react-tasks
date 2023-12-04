import Login from "./components/layout/pages/Login";
import Register from "./components/layout/pages/Register";
import Products from "./components/layout/pages/Products";
import { useRoutes, BrowserRouter } from "react-router-dom";
import NewProduct from "./components/layout/pages/NewProduct";
import ProductInspect from "./components/layout/pages/ProductInspect";
import Navbar from "./components/layout/Navbar";
import Appointments from "./components/layout/pages/Appointments";
import ToastProvider from "./lib/context/ToastProvider";
import Home from "./components/layout/pages/Home";
import NotFound from "./components/layout/pages/NotFound";
import AuthProvider from "./lib/context/AuthProvider";
import Profile from "./components/layout/pages/Profile";

const AppRoutes = () => {
  const routes = useRoutes([
    { path: "/", element: <Home /> },
    { path: "/register", element: <Register /> },
    { path: "/login", element: <Login /> },
    { path: "/products", element: <Products /> },
    { path: "/products/new", element: <NewProduct /> },
    { path: "/products/:id", element: <ProductInspect /> },
    { path: "/appointments", element: <Appointments /> },
    { path: "/profile", element: <Profile /> },
    { path: "*", element: <NotFound /> },
  ]);

  return routes;
};

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <Navbar />
            <AppRoutes />
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
