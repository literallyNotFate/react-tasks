import { ChangeEvent, useState } from "react";
import { IAppointmentForm, IModal } from "../../models/types";
import FormButton from "./shared/FormButton";
import FormInput from "./shared/FormInput";
import Modal from "./shared/Modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface ICreateAppointmentProps extends IModal {
  onCreate: (appointment: IAppointmentForm) => void;
  success: string;
}

const CreateAppointment: React.FC<ICreateAppointmentProps> = ({
  show,
  setShow,
  onCreate,
  success,
}) => {
  const [appointment, setAppointment] = useState<IAppointmentForm>({
    name: "",
    dateRange: [null, null],
    userId: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(appointment);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAppointment((prev) => ({
      ...prev,
      [name]: name == "userId" ? parseInt(value) : value,
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
          {success && (
            <div className="mx-5 mt-5 p-3 bg-green-400 text-white rounded-md mb-3">
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
              value={appointment.name}
            />

            <div className="mt-5 relative">
              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="date">Appointment Date</label>
                <DatePicker
                  selected={startDate}
                  onChange={handleDateChange}
                  selectsRange
                  startDate={startDate}
                  endDate={endDate}
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
              onChange={handleChange}
              label="User ID"
              value={appointment.userId}
              type="number"
            />
          </div>

          <div className="bg-gray-50 flex justify-center py-3 px-3 gap-3 flex-row-reverse">
            <FormButton type="submit">Create</FormButton>

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

export default CreateAppointment;
