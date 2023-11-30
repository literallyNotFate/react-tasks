import { useState, useEffect } from "react";
import FormInput from "../shared/FormInput";
import { IAppointmentForm, IError, IModal } from "../../../models/types";
import FormButton from "../shared/FormButton";
import Modal from "../shared/Modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Errors from "../shared/Errors";

interface IEditAppointmentProps extends IModal {
  edit: IAppointmentForm | undefined;
  editing: (updatedData: IAppointmentForm) => void;
  success: string;
  id?: string;
  errors: IError;
  setErrors: (value: IError) => void;
}

const EditAppointment: React.FC<IEditAppointmentProps> = ({
  show,
  setShow,
  edit,
  editing,
  success,
  errors,
}) => {
  const [editData, setEditData] = useState<IAppointmentForm>();

  useEffect(() => {
    setEditData({ ...edit } as IAppointmentForm);
  }, [edit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData((prev: IAppointmentForm | undefined) => {
      if (prev) {
        return {
          ...prev,
          [name]: name === "userId" ? parseInt(value) : value,
        };
      }

      return prev;
    });
  };

  const handleDateChange = (dates: [Date | null, Date | null] | null) => {
    if (dates && Array.isArray(dates)) {
      setEditData((prev: IAppointmentForm | undefined) => {
        if (prev) {
          return {
            ...prev,
            dateRange: dates,
          };
        }

        return prev;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    editing(editData as IAppointmentForm);
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
            <FormInput
              name="name"
              onChange={handleChange}
              label="Appointment"
              value={editData?.name || ""}
            />

            <div className="mt-5 relative">
              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="date">Appointment Date</label>
                <DatePicker
                  selected={editData?.dateRange?.[0]}
                  onChange={handleDateChange}
                  selectsRange
                  startDate={editData?.dateRange?.[0]}
                  endDate={editData?.dateRange?.[1]}
                  dateFormat={"dd/MM/yyyy"}
                  open
                  name="date"
                  className="p-2 border border-indigo-400 focus:outline-none focus:border-indigo-700 duration:100 rounded-md w-full"
                />
              </div>

              <div className="mt-64"></div>
            </div>

            <FormInput
              name="userId"
              label="User ID"
              value={editData?.userId || 0}
              onChange={handleChange}
              type="number"
            />
          </div>

          <div className="bg-gray-50 flex justify-center py-3 px-3 gap-3 flex-row-reverse">
            <FormButton type="submit">Edit</FormButton>

            <FormButton
              onClick={() => setShow(false)}
              className="bg-gray-400 hover:bg-gray-500"
            >
              Cancel
            </FormButton>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default EditAppointment;