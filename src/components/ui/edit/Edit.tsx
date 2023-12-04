import { useState, ChangeEvent, useEffect } from "react";
import FormInput from "../shared/FormInput";
import {
  IBrandPartial,
  IError,
  IModal,
  IProductForm,
} from "../../../models/types";
import FormButton from "../shared/FormButton";
import { axiosApi } from "../../../api/axios";
import Errors from "../shared/Errors";
import Modal from "../shared/Modal";
import { CURRENCIES } from "../../../lib/constants";
import toast from "react-hot-toast";

interface IEditProps extends IModal {
  edit: IProductForm;
  onEdit: (updatedData: IProductForm) => void;
  errors: IError;
  setErrors: (value: IError) => void;
}

const Edit: React.FC<IEditProps> = ({
  show,
  setShow,
  edit,
  onEdit,
  errors,
  setErrors,
}) => {
  const [editData, setEditData] = useState<IProductForm>({ ...edit });

  useEffect(() => {
    setEditData({ ...edit });
  }, [edit]);

  const [brands, setBrands] = useState<IBrandPartial[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: name == "price" ? parseInt(value) : value,
    }));
  };

  useEffect(() => {
    const getBrands = () => {
      axiosApi
        .get<IBrandPartial[]>(`/brand`)
        .then((res) =>
          setBrands(res.data.map((raw) => ({ id: raw.id, name: raw.name })))
        )
        .catch((err) => toast.error(err));
    };

    getBrands();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEdit(editData);
  };

  const handleClose = () => {
    setErrors({ errors: [] });
    setShow(false);
  };

  return (
    <>
      <Modal show={show} setShow={setShow}>
        <div>
          {errors.errors.length > 0 && <Errors errors={errors.errors} />}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="mb-4">
              <div className="flex flex-col gap-2">
                <FormInput
                  name="name"
                  onChange={handleChange}
                  label="Product Name"
                  value={editData.name || ""}
                />

                <div className="flex justify-center gap-7">
                  <FormInput
                    name="price"
                    onChange={handleChange}
                    label="Price"
                    type="number"
                    value={editData.price || ""}
                  />

                  <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="currency">Brand</label>
                    <select
                      id="currency"
                      className="flex h-10 w-full dark:text-white text-black rounded-md border dark:border-white border-black bg-transparent py-2 px-3 text-sm dark:placeholder:text-white placeholder:text-black focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 focus:border-red-500 dark:focus:border-red-500"
                      value={editData.currency}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                        setEditData((prev) => ({
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
                    <label htmlFor="brands">Brand</label>
                    <select
                      id="brands"
                      className="flex h-10 w-full dark:text-white text-black rounded-md border dark:border-white border-black bg-transparent py-2 px-3 text-sm dark:placeholder:text-white placeholder:text-black focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 focus:border-red-500 dark:focus:border-red-500"
                      value={editData.brandId}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                        setEditData((prev) => ({
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
                  <label htmlFor="description">Description</label>
                  <textarea
                    name="description"
                    id="description"
                    className="flex h-[150px] w-full dark:text-white text-black rounded-md border dark:border-white border-black bg-transparent py-2 px-3 text-sm dark:placeholder:text-white placeholder:text-black focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 focus:border-red-500 dark:focus:border-red-500"
                    style={{ resize: "none" }}
                    value={editData.description || ""}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                      setEditData((prev) => ({
                        ...prev,
                        ["description"]: e.target.value,
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex py-3 px-3 gap-3 flex-row-reverse">
            <FormButton type="submit" variant="primary">
              Edit
            </FormButton>

            <FormButton onClick={() => handleClose()} variant="danger">
              Cancel
            </FormButton>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default Edit;
