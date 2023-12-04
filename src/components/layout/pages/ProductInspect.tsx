import { useParams, useNavigate, Navigate } from "react-router-dom";
import { IError, IProduct, IProductForm } from "../../../models/types";
import { axiosApi } from "../../../api/axios";
import { useEffect, useState } from "react";
import FormButton from "../../ui/shared/FormButton";
import Edit from "../../ui/edit/Edit";
import toast from "react-hot-toast";
import Loading from "../../ui/shared/Loading";
import { useAuth } from "../../../lib/hooks/useAuth";
import useTimeout from "../../../lib/hooks/useTimeout";

const ProductInspect: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<IProduct>();
  const [loading, setLoading] = useState<boolean>(false);
  const [edit, setEdit] = useState<IProductForm>({
    name: "",
    description: "",
    brandId: 0,
    currency: "",
    price: 0,
  });

  const navigate = useNavigate();
  const { user, loadingProfile, getProfile } = useAuth();

  useEffect(() => {
    // const getOne = (id: string | undefined) => {
    //   setLoading(true);
    //   axiosApi
    //     .get(`/product/${id}`)
    //     .then((res) => {
    //       setProduct(res.data);
    //       setEdit({
    //         name: res.data.name,
    //         description: res.data.description,
    //         currency: res.data.currency,
    //         price: res.data.price,
    //         brandId: res.data.brandId,
    //       });
    //     })
    //     .catch((err) => {
    //       toast.error(err);
    //     })
    //     .finally(() => setLoading(false));
    // };

    // getOne(id);

    const getOneProduct = async (id: string | undefined) => {
      setLoading(true);
      try {
        await getProfile();
        const response = await axiosApi.get<IProduct>(`/product/${id}`);

        setProduct(response.data);
        setEdit({
          name: response.data.name,
          description: response.data.description,
          currency: response.data.currency,
          price: response.data.price,
          brandId: response.data.brandId,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getOneProduct(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [errors, setErrors] = useState<IError>({ errors: [] });

  const onEdit = (updatedData: IProductForm) => {
    axiosApi
      .patch(`/product/${id}`, updatedData)
      .then((res) => {
        setErrors({ errors: [] });

        setProduct(res.data);

        setShowModal(false);
        toast.success(`Edited product with ID: ${res.data.id}`);
      })
      .catch((err) => {
        if (err.response?.data.message) {
          setErrors({ errors: err.response?.data.message });
        } else if (err.response?.data) {
          setErrors({ errors: [err.response?.data] });
        }
      });
  };

  const onDelete = (id: string | undefined) => {
    axiosApi
      .delete(`/product/${id}`)
      .then(() => {
        navigate("/products", { replace: true });
        toast.success(`Deleted product with ID: ${id}`);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const [profileLoadingTime, setProfileLoadingTime] = useState<number>(0);

  useTimeout(() => {
    setProfileLoadingTime((prevTime) => prevTime + 1);
  }, 1000);

  if (loading || (!user && loadingProfile && profileLoadingTime < 5)) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <div className="p-12 bg-black w-full md:w-1/2 border-2 border-gray-500 mx-auto">
        <h1 className="text-3xl font-bold text-white">
          {product?.name} (ID: {product?.id})
        </h1>
        <h2 className="mt-3 text-white text-xl">
          Brand: {product?.brand.name}
        </h2>

        <div className="text-white mb-6">
          {product?.description ? (
            <h2 className="text-lg">Description: {product?.description}</h2>
          ) : (
            <h2 className="text-lg">No description</h2>
          )}
        </div>

        <h2 className="text-2xl text-white text-end">
          Price:{" "}
          <span className="text-green-500 font-bold">
            {product?.price} {product?.currency}
          </span>
        </h2>
        <h2>About: {product?.description}</h2>

        <div className="mt-4 flex gap-5">
          <FormButton onClick={() => setShowModal(true)} variant="success">
            Edit
          </FormButton>
          <FormButton onClick={() => onDelete(id)} variant="danger">
            Delete
          </FormButton>
        </div>

        <Edit
          show={showModal}
          setShow={setShowModal}
          edit={edit}
          onEdit={onEdit}
          errors={errors}
          setErrors={setErrors}
        />
      </div>
    </>
  );
};

export default ProductInspect;
