import Login from "./components/layout/Login";
import Register from "./components/layout/Register";
import Products from "./components/layout/Products";
import { useRoutes, BrowserRouter } from "react-router-dom";
import NewProduct from "./components/layout/NewProduct";
import ProductInspect from "./components/layout/ProductInspect";

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
        <AppRoutes />
      </BrowserRouter>
    </div>
  );
}

export default App;
