import { useEffect, useMemo, useState } from "react";
import { axiosApi } from "../../../api/axios";
import { ICartItem, IProduct } from "../../../models/types";
import ProductCard from "../../ui/shared/card/ProductCard";
import { useNavigate } from "react-router-dom";
import Cart from "../../ui/Cart";
import FormButton from "../../ui/shared/FormButton";
import useCurrency from "../../../lib/hooks/useCurrency";

const Products: React.FC = () => {
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

  const [showCart, setShowCart] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);
  const [target, setTarget] = useState<string>("EUR");

  const addToCart = (product: IProduct) => {
    const existingItem = cartItems.find(
      (item) => item.product.id === product.id
    );

    if (existingItem) {
      const updatedCartItems = cartItems.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );

      setCartItems(updatedCartItems);
    } else {
      const newCartItem: ICartItem = { product, quantity: 1 };
      setCartItems([...cartItems, newCartItem]);
    }
  };

  const removeFromCart = (product: IProduct) => {
    const existingItem = cartItems.find(
      (item) => item.product.id === product.id
    );

    if (existingItem && existingItem.quantity > 1) {
      const updatedCartItems = cartItems.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );

      setCartItems(updatedCartItems);
    } else {
      const updatedCartItems = cartItems.filter(
        (item) => item.product.id !== product.id
      );

      setCartItems(updatedCartItems);
    }
  };

  const { convert, error } = useCurrency();

  const total = useMemo(() => {
    let total: number = 0;

    cartItems.forEach((item) => {
      const converted = convert(
        item.product.price,
        item.product.currency,
        target
      );

      total += converted * item.quantity;
    });

    return total;
  }, [cartItems, target, convert]);

  const quantity = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  return (
    <>
      <div className="p-12 shadow-lg rounded-lg bg-white">
        <div>
          <h1 className="mb-6 font-bold text-3xl">
            Products ({products.length})
          </h1>
          <div className="w-1/3 mb-6">
            <FormButton onClick={() => setShowCart(true)}>
              Open Cart ({quantity})
            </FormButton>
          </div>

          {error && <div>Error: {error}</div>}

          <div>
            {products.length > 0 ? (
              <div className="grid grid-cols-3 gap-10">
                {products.map((product) => (
                  <ProductCard
                    product={product}
                    key={product.id}
                    onClick={() => navigate(`/products/${product.id}`)}
                    onCart={(product) => addToCart(product)}
                  />
                ))}
              </div>
            ) : (
              <h1 className="text-3xl font-bold text-center">No data yet!</h1>
            )}
          </div>
        </div>

        <Cart
          show={showCart}
          setShow={setShowCart}
          items={cartItems}
          add={addToCart}
          remove={removeFromCart}
          total={total}
          quantity={quantity}
          target={target}
          setTarget={setTarget}
        />
      </div>
    </>
  );
};

export default Products;
