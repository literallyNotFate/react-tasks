import { ICartItem, IProduct } from "../../models/types";
import FormButton from "./FormButton";

const Cart = ({
  showCart,
  setShowCart,
  items,
  add,
  remove,
  total,
  quantity,
}: {
  showCart: boolean;
  setShowCart: (value: boolean) => void;
  items: ICartItem[];
  add: (product: IProduct) => void;
  remove: (product: IProduct) => void;
  total: () => number;
  quantity: () => number;
}) => {
  return (
    <>
      {showCart ? (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                {items.length > 0 ? (
                  <>
                    <h1 className="mb-6 font-bold text-3xl">
                      Cart Items ({quantity()})
                    </h1>

                    <ul>
                      {items.map((item) => (
                        <li
                          key={item.product.id}
                          className="flex items-center justify-between border-b py-2"
                        >
                          <p>
                            <span className="font-bold">
                              {item.product.name}
                            </span>{" "}
                            - Quantity: {item.quantity}
                          </p>

                          <div className="flex">
                            <FormButton
                              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 mr-2"
                              onClick={() => add(item.product)}
                            >
                              +
                            </FormButton>
                            <FormButton
                              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                              onClick={() => remove(item.product)}
                            >
                              -
                            </FormButton>
                          </div>
                        </li>
                      ))}
                    </ul>

                    <p className="my-6 text-end font-bold text-green-500 text-2xl">
                      Total: {total()}{" "}
                      {items.length > 0 && items[0].product.currency}
                    </p>
                  </>
                ) : (
                  <h1 className="text-2xl mb-4 font-bold text-center">
                    No items added to cart
                  </h1>
                )}

                <div className="bg-gray-50">
                  <FormButton
                    onClick={() => setShowCart(false)}
                    className="bg-gray-100 hover:bg-gray-200 text-black"
                  >
                    Close
                  </FormButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Cart;
