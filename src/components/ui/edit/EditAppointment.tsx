import { useState, useEffect } from "react";
import FormInput from "../shared/FormInput";
import { IAppointmentForm, IError, IModal, IUser } from "../../../models/types";
import FormButton from "../shared/FormButton";
import Modal from "../shared/Modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Errors from "../shared/Errors";

interface IEditAppointmentProps extends IModal {
  edit: IAppointmentForm | undefined;
  editing: (updatedData: IAppointmentForm) => void;
  id?: string;
  errors: IError;
  setErrors: (value: IError) => void;
  me: IUser | null;
}

const EditAppointment: React.FC<IEditAppointmentProps> = ({
  show,
  setShow,
  edit,
  editing,
  errors,
  me,
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
          [name]: value,
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
          {errors.errors.length > 0 && <Errors errors={errors.errors} />}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
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
                  readOnly
                  name="date"
                  className="flex h-10 w-full text-white rounded-md border border-white bg-transparent py-2 px-3 text-sm placeholder:text-white focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 focus:border-red-500"
                />
              </div>

              <div className="mt-64"></div>
            </div>

            <div className="pt-10 text-md">
              Editing appointment for{" "}
              <span className="font-bold">
                {me?.firstName} {me?.lastName}
              </span>
            </div>
          </div>

          <div className="flex py-3 px-3 gap-3 flex-row-reverse">
            <FormButton type="submit" variant="primary">
              Edit
            </FormButton>

            <FormButton onClick={() => setShow(false)} variant="danger">
              Cancel
            </FormButton>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default EditAppointment;
