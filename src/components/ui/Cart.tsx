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
                className="flex h-10 w-full dark:text-white text-black rounded-md border dark:border-white border-black bg-transparent py-2 px-3 text-sm dark:placeholder:text-white placeholder:text-black focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 focus:border-red-500 dark:focus:border-red-500"
                value={target}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                  setTarget(e.target.value);
                }}
              >
                {CURRENCIES.map((code) => (
                  <option
                    key={code}
                    value={code}
                    className="dark:bg-black dark:text-white bg-white text-black"
                  >
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

                  <div className="flex gap-2">
                    <FormButton
                      variant="success"
                      onClick={() => add(item.product)}
                    >
                      +
                    </FormButton>
                    <FormButton
                      variant="danger"
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

        <div className="py-3 px-3 flex flex-row-reverse">
          <FormButton onClick={() => setShow(false)} variant="danger">
            Close
          </FormButton>
        </div>
      </Modal>
    </>
  );
};

export default Cart;
