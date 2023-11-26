import { IProduct } from "../../models/types";
import FormButton from "./FormButton";

interface IProductCardProps {
  product: IProduct;
  onClick: () => void;
  onCart: (product: IProduct) => void;
}

const ProductCard: React.FC<IProductCardProps> = ({
  product,
  onClick,
  onCart,
}: IProductCardProps) => {
  return (
    <div className="p-4 hover:scale-105 duration-100 border border-black rounded-lg cursor-pointer">
      <h1
        className="text-2xl text-center text-indigo-400 underline"
        onClick={onClick}
      >
        {product.name}
      </h1>
      <h2>
        Price:{" "}
        <span className="text-green-500">
          {product.price} {product.currency}
        </span>
      </h2>
      <h2>Brand: {product.brand.name}</h2>

      <FormButton className="mt-5" onClick={() => onCart(product)}>
        To Cart
      </FormButton>
    </div>
  );
};

export default ProductCard;
