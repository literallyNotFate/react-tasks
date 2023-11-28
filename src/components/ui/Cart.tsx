import { ICartItem, IModal, IProduct } from "../../models/types";
import { ChangeEvent } from "react";
import FormButton from "./shared/FormButton";
import Modal from "./shared/Modal";
import { CURRENCIES } from "../../lib/constants";

interface ICartProps extends IModal {
  items: ICartItem[];
  add: (product: IProduct) => void;
  remove: (product: IProduct) => void;
  total: number;
  quantity: number;
  target: string;
  setTarget: (value: string) => void;
}

const Cart: React.FC<ICartProps> = ({
  show,
  setShow,
  items,
  add,
  remove,
  total,
  quantity,
  target,
  setTarget,
}) => {
  return (
    <>
      <Modal show={show} setShow={setShow}>
        {items.length > 0 ? (
          <>
            <h1 className="mb-6 font-bold text-3xl">Cart Items ({quantity})</h1>

            <div className="flex flex-col gap-2 w-full mb-6">
              <label htmlFor="target">Select currency to convert total</label>
              <select
                id="target"
                className="p-2 border border-indigo-400 focus:outline-none focus:border-indigo-700 duration:100 rounded-md w-full"
                value={target}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                  setTarget(e.target.value);
                }}
              >
                {CURRENCIES.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </div>

            <ul>
              {items.map((item) => (
                <li
                  key={item.product.id}
                  className="flex items-center justify-between border-b py-2"
                >
                  <p>
                    <span className="font-bold">{item.product.name}</span> -
                    Quantity: {item.quantity}
                  </p>

                  <div className="flex">
                    <FormButton
                      className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded mr-2"
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
              Total: {total.toFixed(2)} in {target}
            </p>
          </>
        ) : (
          <h1 className="text-2xl mb-4 font-bold text-center">
            No items added to cart
          </h1>
        )}

        <div className="bg-gray-50 py-3 px-3">
          <FormButton
            onClick={() => setShow(false)}
            className="bg-gray-300 hover:bg-gray-400"
          >
            Close
          </FormButton>
        </div>
      </Modal>
    </>
  );
};

export default Cart;
