import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { axiosApi } from "../../api/axios";
import FormButton from "../ui/FormButton";
import FormInput from "../ui/FormInput";
import { IProductForm, IError, IBrandPartial } from "../../models/types";
import Errors from "../ui/Errors";
import { useNavigate } from "react-router-dom";

const NewProduct = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState<IProductForm>({
    name: "",
    description: "",
    currency: "",
    price: 0,
    brandId: 0,
  });

  const [brands, setBrands] = useState<IBrandPartial[]>([]);

  useEffect(() => {
    const getBrands = () => {
      axiosApi
        .get<IBrandPartial[]>(`/brand`)
        .then((res) =>
          setBrands(res.data.map((raw) => ({ id: raw.id, name: raw.name })))
        )
        .catch((err) => console.log(err));
    };

    getBrands();
  }, []);

  const [errors, setErrors] = useState<IError>({ errors: [] });
  const [success, setSuccess] = useState<string>("");

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
        setSuccess(res.statusText);

        setTimeout(() => {
          reset();
        }, 1000);

        setSuccess("");
        navigate("/products", { replace: true });
      })
      .catch((err) => {
        setSuccess("");
        if (err.response?.data.message) {
          setErrors({ errors: err.response?.data.message });
        } else if (err.response?.data) {
          setErrors({ errors: [err.response?.data] });
        }
      });
  };

  const reset = () => {
    setErrors({ errors: [] });
    setProduct({
      name: "",
      description: "",
      currency: "",
      price: 0,
      brandId: 0,
    });
  };

  return (
    <>
      <form
        className="p-12 shadow-lg rounded-lg bg-white"
        onSubmit={handleSubmit}
      >
        <h1 className="text-center text-4xl font-bold text-indigo-500 mb-7">
          Create Product
        </h1>

        {errors.errors.length > 0 && <Errors errors={errors.errors} />}

        {success && (
          <div className="p-3 bg-green-400 text-white rounded-md mb-3">
            {success}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <FormInput name="name" onChange={handleChange} label="Product Name" />

          <div className="flex justify-center gap-7">
            <FormInput
              name="price"
              onChange={handleChange}
              label="Price"
              type="number"
            />
            <FormInput
              name="currency"
              onChange={handleChange}
              label="Currency"
            />

            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="brands">Brand</label>
              <select
                id="brands"
                className="p-2 border border-indigo-400 focus:outline-none focus:border-indigo-700 duration:100 rounded-md w-full"
                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                  setProduct((prev) => ({
                    ...prev,
                    ["brandId"]: parseInt(e.target.value),
                  }));
                }}
              >
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              id="description"
              className="p-2 border border-indigo-400 focus:outline-none focus:border-indigo-700 duration:100 rounded-md w-full h-[150px]"
              style={{ resize: "none" }}
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
