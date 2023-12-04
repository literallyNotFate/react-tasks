import { useEffect, useMemo, useState } from "react";
import { axiosApi } from "../../../api/axios";
import { ICartItem, IProduct } from "../../../models/types";
import ProductCard from "../../ui/shared/card/ProductCard";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Cart from "../../ui/Cart";
import FormButton from "../../ui/shared/FormButton";
import useCurrency from "../../../lib/hooks/useCurrency";
import Loading from "../../ui/shared/Loading";
import { useAuth } from "../../../lib/hooks/useAuth";
import useTimeout from "../../../lib/hooks/useTimeout";

const Products: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const { user, getProfile, loadingProfile } = useAuth();

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      try {
        await getProfile();
        const response = await axiosApi.get<IProduct[]>("/product");
        setProducts(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const { convert } = useCurrency();

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

  const [profileLoadingTime, setProfileLoadingTime] = useState<number>(0);

  useTimeout(() => {
    setProfileLoadingTime((prevTime) => prevTime + 1);
  }, 1000);

  if (loading || (!user && loadingProfile && profileLoadingTime < 5)) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <div className="p-12 bg-black w-full md:w-3/4 border-2 border-gray-500 mx-auto">
        <div>
          {products.length > 0 ? (
            <div>
              <h1 className="mb-6 font-bold text-3xl text-white">
                Products ({products.length})
              </h1>
              <div className="flex gap-5 mb-6">
                <FormButton href="/products/new" variant="danger">
                  Create
                </FormButton>

                <FormButton onClick={() => setShowCart(true)} variant="success">
                  Open Cart ({quantity})
                </FormButton>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {products.map((product) => (
                  <ProductCard
                    product={product}
                    key={product.id}
                    onClick={() => navigate(`/products/${product.id}`)}
                    onCart={(product) => addToCart(product)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <h1 className="text-3xl font-bold text-center">
              No data yet!{" "}
              <Link to="/products/new" className="font-bold">
                Create product!
              </Link>
            </h1>
          )}
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
