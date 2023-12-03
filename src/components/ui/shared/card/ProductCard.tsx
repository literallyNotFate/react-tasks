import { IProduct } from "../../../../models/types";
import FormButton from "../FormButton";

interface IProductCardProps {
  product: IProduct;
  onClick: () => void;
  onCart: (product: IProduct) => void;
}

const ProductCard: React.FC<IProductCardProps> = ({
  product,
  onClick,
  onCart,
}) => {
  return (
    <div className="p-4 hover:scale-105 duration-100 border-2 border-gray-500 bg-[#2d2d2d] cursor-pointer">
      <h1
        className="text-2xl text-white font-bold mb-5 break-words"
        onClick={onClick}
      >
        {product.name}
      </h1>
      <h2 className="text-xl text-white">
        Price:{" "}
        <span className="text-green-500 font-bold">
          {product.price} {product.currency}
        </span>
      </h2>
      <h2 className="text-lg text-white">Brand: {product.brand.name}</h2>

      <FormButton
        className="mt-5"
        variant="warning"
        onClick={() => onCart(product)}
      >
        To Cart
      </FormButton>
    </div>
  );
};

export default ProductCard;
