import CreateAppointment from "../../ui/CreateAppointment";
import { useEffect, useState } from "react";
import FormButton from "../../ui/shared/FormButton";
import {
  IAppointment,
  IAppointmentData,
  IAppointmentForm,
} from "../../../models/types";
import { format } from "date-fns";
import { axiosApi } from "../../../api/axios";
import AppointmentCard from "../../ui/AppointmentCard";

const Appointments: React.FC = () => {
  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>("");

  const [appointments, setAppointments] = useState<IAppointment[]>([]);

  useEffect(() => {
    const getAppointments = () => {
      axiosApi
        .get("/appointment")
        .then((res) => setAppointments(res.data))
        .catch((err) => console.log(err));
    };

    getAppointments();
  }, []);

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

    const data: IAppointmentData = {
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

  const onDelete = (appointment: IAppointment) => {
    console.log("deleting", appointment.name);
  };

  const onEdit = (appointment: IAppointment) => {
    console.log("editing", appointment.name);
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

        <div className="mt-6">
          {appointments.length > 0 ? (
            <div className="grid grid-cols-3 gap-10">
              {appointments.map((app) => (
                <AppointmentCard
                  appointment={app}
                  key={app.id}
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
              ))}
            </div>
          ) : (
            <h1 className="text-3xl font-bold text-center">No data yet!</h1>
          )}
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
