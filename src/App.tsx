import Login from "./components/layout/pages/Login";
import Register from "./components/layout/pages/Register";
import Products from "./components/layout/pages/Products";
import { useRoutes, BrowserRouter } from "react-router-dom";
import NewProduct from "./components/layout/pages/NewProduct";
import ProductInspect from "./components/layout/pages/ProductInspect";
import Navbar from "./components/layout/Navbar";

const AppRoutes = () => {
  const routes = useRoutes([
    { path: "/", element: <Register /> },
    { path: "/login", element: <Login /> },
    { path: "/products", element: <Products /> },
    { path: "/products/new", element: <NewProduct /> },
    { path: "/products/:id", element: <ProductInspect /> },
  ]);

  return routes;
};

function App() {
  return (
    <div className="w-full">
      <BrowserRouter>
        <Navbar />
        <AppRoutes />
      </BrowserRouter>
    </div>
  );
}

export default App;
