import { useState, ChangeEvent, useEffect } from "react";
import FormInput from "./shared/FormInput";
import {
  IBrandPartial,
  IError,
  IModal,
  IProductForm,
} from "../../models/types";
import FormButton from "./shared/FormButton";
import { axiosApi } from "../../api/axios";
import Errors from "./Errors";
import Modal from "./shared/Modal";
import { CURRENCIES } from "../../lib/constants";

interface IEditProps extends IModal {
  edit: IProductForm;
  onEdit: (updatedData: IProductForm) => void;
  success: string;
  errors: IError;
  setErrors: (value: IError) => void;
  setSuccess: (value: string) => void;
}

const Edit: React.FC<IEditProps> = ({
  show,
  setShow,
  edit,
  onEdit,
  success,
  errors,
  setErrors,
  setSuccess,
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
        .catch((err) => console.log(err));
    };

    getBrands();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEdit(editData);
  };

  const handleClose = () => {
    setErrors({ errors: [] });
    setSuccess("");
    setShow(false);
  };

  return (
    <>
      <Modal show={show} setShow={setShow}>
        <div>
          {errors.errors.length > 0 && (
            <div className="mx-5 mt-5">
              <Errors errors={errors.errors} />
            </div>
          )}

          {success && (
            <div className="mt-5 mx-5 p-3 bg-green-400 text-white rounded-md mb-3">
              {success}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
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
                      className="p-2 border border-indigo-400 focus:outline-none focus:border-indigo-700 duration:100 rounded-md w-full"
                      value={editData.currency}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                        setEditData((prev) => ({
                          ...prev,
                          ["currency"]: e.target.value,
                        }));
                      }}
                    >
                      {CURRENCIES.map((code) => (
                        <option key={code} value={code}>
                          {code}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="brands">Brand</label>
                    <select
                      id="brands"
                      className="p-2 border border-indigo-400 focus:outline-none focus:border-indigo-700 duration:100 rounded-md w-full"
                      value={editData.brandId}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                        setEditData((prev) => ({
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
          <div className="bg-gray-50 flex justify-center py-3 px-3 gap-3 flex-row-reverse">
            <FormButton type="submit">Edit</FormButton>

            <FormButton
              onClick={() => handleClose()}
              className="bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </FormButton>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default Edit;
