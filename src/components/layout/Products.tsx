import { useEffect, useState } from "react";
import { axiosApi } from "../../api/axios";
import { IProduct } from "../../models/types";
import ProductCard from "../ui/ProductCard";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getAll = () => {
      axiosApi
        .get("/product")
        .then((res) => setProducts(res.data))
        .catch((err) => console.log(err));
    };

    getAll();
  }, []);

  return (
    <>
      <div className="p-12 shadow-lg rounded-lg bg-white">
        <div className="grid grid-cols-3 gap-10">
          {products.length > 0 ? (
            <>
              {products.map((product) => (
                <ProductCard
                  product={product}
                  key={product.id}
                  onClick={() => navigate(`/products/${product.id}`)}
                />
              ))}
            </>
          ) : (
            <h1>No data yet!</h1>
          )}
        </div>
      </div>
    </>
  );
};

export default Products;
