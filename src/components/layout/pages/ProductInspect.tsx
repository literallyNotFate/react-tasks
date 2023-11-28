import { useParams } from "react-router-dom";
import { IError, IProduct, IProductForm } from "../../../models/types";
import { axiosApi } from "../../../api/axios";
import { useEffect, useState } from "react";
import FormButton from "../../ui/shared/FormButton";
import Edit from "../../ui/Edit";

const ProductInspect: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<IProduct>();
  const [edit, setEdit] = useState<IProductForm>({
    name: "",
    description: "",
    brandId: 0,
    currency: "",
    price: 0,
  });

  useEffect(() => {
    const getOne = (id: string | undefined) => {
      axiosApi
        .get(`/product/${id}`)
        .then((res) => {
          setProduct(res.data);
          setEdit({
            name: res.data.name,
            description: res.data.description,
            currency: res.data.currency,
            price: res.data.price,
            brandId: res.data.brandId,
          });
        })
        .catch((err) => console.log(err));
    };

    getOne(id);
  }, [id]);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [errors, setErrors] = useState<IError>({ errors: [] });
  const [success, setSuccess] = useState<string>("");

  const onEdit = (updatedData: IProductForm) => {
    axiosApi
      .patch(`/product/${id}`, updatedData)
      .then((res) => {
        setErrors({ errors: [] });
        setSuccess(res.statusText);

        setTimeout(() => {
          setSuccess("");
        }, 1000);

        setShowModal(false);
      })
      .catch((err) => {
        setSuccess("");
        if (err.response?.data.message) {
          setErrors({ errors: err.response?.data.message });
        } else if (err.response?.data) {
          setErrors({ errors: [err.response?.data] });
        }
      });

    window.location.reload();
  };

  return (
    <>
      <div className="bg-white p-5 rounded-md">
        <h1 className="text-3xl font-bold">
          {product?.name} (ID: {product?.id})
        </h1>
        <h2 className="mt-3">Brand: {product?.brand.name}</h2>
        <h2>
          Price:{" "}
          <span className="text-green-500">
            {product?.price} {product?.currency}
          </span>
        </h2>
        <h2>About: {product?.description}</h2>

        <div className="mt-4">
          <FormButton onClick={() => setShowModal(true)}>Edit</FormButton>
        </div>

        <Edit
          show={showModal}
          setShow={setShowModal}
          edit={edit}
          onEdit={onEdit}
          errors={errors}
          setErrors={setErrors}
          success={success}
          setSuccess={setSuccess}
        />
      </div>
    </>
  );
};

export default ProductInspect;
