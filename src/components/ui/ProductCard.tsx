import { IProduct } from "../../models/types";

interface IProductCardProps {
  product: IProduct;
  onClick: () => void;
}

const ProductCard: React.FC<IProductCardProps> = ({
  product,
  onClick,
}: IProductCardProps) => {
  return (
    <div
      className="p-4 hover:scale-105 duration-100 border border-black rounded-lg cursor-pointer"
      onClick={onClick}
    >
      <h1 className="text-2xl text-center">{product.name}</h1>
      <h2>
        Price:{" "}
        <span className="text-green-500">
          {product.price} {product.currency}
        </span>
      </h2>
      <h2>Brand: {product.brand.name}</h2>
    </div>
  );
};

export default ProductCard;
