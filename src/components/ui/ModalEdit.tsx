import { useState, ChangeEvent, useEffect } from "react";
import FormInput from "./FormInput";
import { IBrandPartial, IError, IProductForm } from "../../models/types";
import FormButton from "./FormButton";
import { axiosApi } from "../../api/axios";
import Errors from "./Errors";

const ModalEdit = ({
  showModal,
  setShowModal,
  edit,
  onEdit,
  success,
  errors,
  setErrors,
  setSuccess,
}: {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  edit: IProductForm;
  onEdit: (updatedData: IProductForm) => void;
  success: string;
  errors: IError;
  setErrors: (value: IError) => void;
  setSuccess: (value: string) => void;
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
    setShowModal(false);
  };

  return (
    <>
      {showModal ? (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="mx-5 mt-5">
                {errors.errors.length > 0 && <Errors errors={errors.errors} />}

                {success && (
                  <div className="p-3 bg-green-400 text-white rounded-md mb-3">
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
                        <FormInput
                          name="currency"
                          onChange={handleChange}
                          label="Currency"
                          value={editData.currency || ""}
                        />

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
                    className="bg-gray-100 hover:bg-gray-200 text-black"
                  >
                    Cancel
                  </FormButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ModalEdit;
