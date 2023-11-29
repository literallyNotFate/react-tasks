import CreateAppointment from "../../ui/CreateAppointment";
import { useState } from "react";
import FormButton from "../../ui/shared/FormButton";
import { IAppointment, IAppointmentForm } from "../../../models/types";
import { format } from "date-fns";
import { axiosApi } from "../../../api/axios";

const Appointments: React.FC = () => {
  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>("");

  const onCreate = (appointment: IAppointmentForm) => {
    let startD: string | null = null;
    let endD: string | null = null;

    if (appointment.dateRange && Array.isArray(appointment.dateRange)) {
      const [start, end] = appointment.dateRange;
      if (start && end) {
        startD = format(start, "dd-MM-yyyy");
        endD = format(end, "dd-MM-yyyy");
      }
    }

    const data: IAppointment = {
      name: appointment.name,
      startDate: startD,
      endDate: endD,
      userId: appointment.userId,
    };

    axiosApi
      .post("/appointment", data)
      .then((res) => {
        setSuccess("Appointment created");
        setShowCreate(false);
        console.log(res);
      })
      .catch((err) => {
        setSuccess("");
        console.log(err);
      });
  };

  return (
    <>
      <div className="p-12 shadow-lg rounded-lg bg-white flex flex-col gap-5">
        <div>
          <h1 className="text-center text-4xl font-bold text-indigo-500 mb-7">
            All Appointments
          </h1>
        </div>
        <div className="w-64">
          <FormButton onClick={() => setShowCreate(true)}>
            Create an appointment
          </FormButton>
        </div>

        <CreateAppointment
          show={showCreate}
          setShow={setShowCreate}
          onCreate={onCreate}
          success={success}
        />
      </div>
    </>
  );
};

export default Appointments;
