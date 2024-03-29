import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { axiosApi } from "../../../api/axios";
import FormButton from "../../ui/shared/FormButton";
import FormInput from "../../ui/shared/FormInput";
import { IProductForm, IError, IBrandPartial } from "../../../models/types";
import Errors from "../../ui/shared/Errors";
import { Navigate, useNavigate } from "react-router-dom";
import { CURRENCIES } from "../../../lib/constants";
import toast from "react-hot-toast";
import { useAuth } from "../../../lib/hooks/useAuth";
import useTimeout from "../../../lib/hooks/useTimeout";
import Loading from "../../ui/shared/Loading";

const NewProduct: React.FC = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState<IBrandPartial[]>([]);

  const { user, getProfile, loadingProfile } = useAuth();

  const [product, setProduct] = useState<IProductForm>({
    name: "",
    description: "",
    currency: CURRENCIES[0],
    price: 0,
    brandId: 1,
  });

  useEffect(() => {
    const getBrands = async () => {
      try {
        await getProfile();
        const response = await axiosApi.get<IBrandPartial[]>(`/brand`);
        setBrands(response.data.map((raw) => ({ id: raw.id, name: raw.name })));
      } catch (error) {
        console.error(error);
      }
    };

    getBrands();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [errors, setErrors] = useState<IError>({ errors: [] });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: name == "price" || name == "brandId" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    axiosApi
      .post("/product", product)
      .then((res) => {
        setErrors({ errors: [] });
        toast.success(
          `New product ${res.data.name} with ID: ${res.data.id} created`
        );

        reset();

        navigate("/products", { replace: true });
      })
      .catch((err) => {
        if (Array.isArray(err.response?.data.message)) {
          setErrors({ errors: err.response?.data.message });
        } else {
          setErrors({ errors: [err.response?.data.message] });
        }
      });
  };

  const reset = () => {
    setErrors({ errors: [] });
    setProduct({
      name: "",
      description: "",
      currency: CURRENCIES[0],
      price: 0,
      brandId: 1,
    });
  };

  const [profileLoadingTime, setProfileLoadingTime] = useState<number>(0);

  useTimeout(() => {
    setProfileLoadingTime((prevTime) => prevTime + 1);
  }, 1000);

  if (!user && loadingProfile && profileLoadingTime < 5) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <form
        className="p-12 dark:bg-black bg-white w-full md:w-3/4 border-2 dark:border-gray-500 border-gray-200 text-black dark:text-white mx-auto"
        onSubmit={handleSubmit}
      >
        <h1 className="text-4xl font-bold mb-7">Create Product</h1>

        <div className="my-6">
          {errors.errors.length > 0 && <Errors errors={errors.errors} />}
        </div>

        <div className="flex flex-col gap-5">
          <FormInput
            name="name"
            value={product.name}
            onChange={handleChange}
            label="Product Name"
          />

          <div className="flex justify-center gap-7">
            <FormInput
              name="price"
              value={product.price}
              onChange={handleChange}
              label="Price"
              type="number"
            />

            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="currency" className="text-lg">
                Currency
              </label>
              <select
                id="currency"
                className="flex h-10 w-full dark:text-white text-black rounded-md border dark:border-white border-black bg-transparent py-2 px-3 text-sm dark:placeholder:text-white placeholder:text-black focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 focus:border-red-500 dark:focus:border-red-500"
                value={product.currency}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                  setProduct((prev) => ({
                    ...prev,
                    ["currency"]: e.target.value,
                  }));
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

            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="brands" className="text-lg">
                Brand
              </label>
              <select
                id="brands"
                className="flex h-10 w-full dark:text-white text-black rounded-md border dark:border-white border-black bg-transparent py-2 px-3 text-sm dark:placeholder:text-white placeholder:text-black focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 focus:border-red-500 dark:focus:border-red-500"
                value={product.brandId}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                  setProduct((prev) => ({
                    ...prev,
                    ["brandId"]: parseInt(e.target.value),
                  }));
                }}
              >
                {brands.map((brand) => (
                  <option
                    key={brand.id}
                    value={brand.id}
                    className="dark:bg-black dark:text-white bg-white text-black"
                  >
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="description" className="text-lg">
              Description
            </label>
            <textarea
              name="description"
              id="description"
              className="flex h-[150px] w-full dark:text-white text-black rounded-md border dark:border-white border-black bg-transparent py-2 px-3 text-sm dark:placeholder:text-white placeholder:text-black focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 focus:border-red-500 dark:focus:border-red-500"
              style={{ resize: "none" }}
              value={product.description}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                setProduct((prev) => ({
                  ...prev,
                  ["description"]: e.target.value,
                }));
              }}
            />
          </div>

          <div className="mt-5">
            <FormButton type="submit">Create</FormButton>
          </div>
        </div>
      </form>
    </>
  );
};

export default NewProduct;
