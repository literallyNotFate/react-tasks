import { ChangeEvent, useEffect, useState } from "react";
import { IAppointmentForm, IError, IModal, IUser } from "../../../models/types";
import FormButton from "../shared/FormButton";
import FormInput from "../shared/FormInput";
import Modal from "../shared/Modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Errors from "../shared/Errors";

interface ICreateAppointmentProps extends IModal {
  onCreate: (appointment: IAppointmentForm) => void;
  me: IUser | null;
  errors: IError;
  resetForm: boolean;
  setResetFormFlag: () => void;
}

const CreateAppointment: React.FC<ICreateAppointmentProps> = ({
  show,
  setShow,
  onCreate,
  errors,
  me,
  resetForm,
  setResetFormFlag,
}) => {
  const [appointment, setAppointment] = useState<IAppointmentForm>({
    name: "",
    dateRange: [null, null],
  });

  useEffect(() => {
    if (resetForm) {
      setAppointment({
        name: "",
        dateRange: [null, null],
      });

      setStartDate(null);
      setEndDate(null);
      setResetFormFlag();
    }
  }, [resetForm, setResetFormFlag]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(appointment);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAppointment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleDateChange = (dates: [Date | null, Date | null] | null) => {
    if (dates && Array.isArray(dates)) {
      const [start, end] = dates;

      setStartDate(start);
      setEndDate(end);

      setAppointment((prev) => ({
        ...prev,
        ["dateRange"]: dates,
      }));
    }
  };

  return (
    <>
      <Modal show={show} setShow={setShow}>
        <div>
          {errors.errors.length > 0 && <Errors errors={errors.errors} />}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-black px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <FormInput
              name="name"
              onChange={handleChange}
              label="Appointment"
              value={appointment.name}
            />

            <div className="mt-5 relative">
              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="date">Appointment Date</label>
                <DatePicker
                  popperPlacement="bottom-start"
                  selected={startDate}
                  onChange={handleDateChange}
                  selectsRange
                  startDate={startDate}
                  endDate={endDate}
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
              Making appointment for{" "}
              <span className="font-bold">
                {me?.firstName} {me?.lastName}
              </span>
            </div>
          </div>

          <div className="flex py-3 px-3 gap-3 flex-row-reverse">
            <FormButton type="submit" variant="primary">
              Create
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

export default CreateAppointment;
