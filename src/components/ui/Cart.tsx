import { ICartItem, IModal, IProduct } from "../../models/types";
import FormButton from "./shared/FormButton";
import Modal from "./shared/Modal";

interface ICartProps extends IModal {
  items: ICartItem[];
  add: (product: IProduct) => void;
  remove: (product: IProduct) => void;
  total: number;
  quantity: number;
}

const Cart: React.FC<ICartProps> = ({
  show,
  setShow,
  items,
  add,
  remove,
  total,
  quantity,
}) => {
  return (
    <>
      <Modal show={show} setShow={setShow}>
        {items.length > 0 ? (
          <>
            <h1 className="mb-6 font-bold text-3xl">Cart Items ({quantity})</h1>

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
              Total: {total} {items.length > 0 && items[0].product.currency}
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
