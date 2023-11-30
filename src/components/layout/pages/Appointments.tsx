import CreateAppointment from "../../ui/create/CreateAppointment";
import { useEffect, useState } from "react";
import FormButton from "../../ui/shared/FormButton";
import {
  IAppointment,
  IAppointmentData,
  IAppointmentForm,
  IError,
} from "../../../models/types";
import { format } from "date-fns";
import { axiosApi } from "../../../api/axios";
import EditAppointment from "../../ui/edit/EditAppointment";
import { parseDateFromString } from "../../../lib/utils";
import AppointmentCalendar from "../../ui/calendar/AppointmentCalendar";

const Appointments: React.FC = () => {
  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>("");

  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [edit, setEdit] = useState<IAppointmentForm>();

  const [editId, setEditId] = useState<string>("");
  const [errors, setErrors] = useState<IError>({ errors: [] });

  useEffect(() => {
    const getAppointments = () => {
      axiosApi
        .get("/appointment")
        .then((res) => setAppointments(res.data))
        .catch((err) => console.log(err));
    };

    getAppointments();
  }, []);

  const parseToApiData = (appointment: IAppointmentForm): IAppointmentData => {
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

    return data;
  };

  const onCreate = (appointment: IAppointmentForm) => {
    const data = parseToApiData(appointment);

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
    axiosApi
      .delete(`/appointment/${appointment.id}`)
      .then(() => {
        console.log(`Deleted appointment with id: ${appointment.id}`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onEdit = (appointment: IAppointment) => {
    const editData: IAppointmentForm = {
      name: appointment.name,
      dateRange: [
        parseDateFromString(appointment.startDate, "-"),
        parseDateFromString(appointment.endDate, "-"),
      ],
      userId: parseInt(appointment.userId),
    };

    setEdit(editData);
    setEditId(appointment.id);
    setShowEdit(true);
  };

  const editing = (updatedData: IAppointmentForm) => {
    const data = parseToApiData(updatedData);

    axiosApi
      .patch(`/appointment/${editId}`, data)
      .then((res) => {
        setErrors({ errors: [] });
        console.log(res);
        setSuccess(`Edited appointment with id: ${res.data.id}`);
      })
      .catch((err) => {
        setSuccess("");
        setErrors({ errors: err.response?.data.message });
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

        <div className="mt-6">
          <AppointmentCalendar
            appointments={appointments}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        </div>

        <CreateAppointment
          show={showCreate}
          setShow={setShowCreate}
          onCreate={onCreate}
          success={success}
        />

        <EditAppointment
          show={showEdit}
          setShow={setShowEdit}
          edit={edit as IAppointmentForm}
          success={success}
          editing={editing}
          id={editId}
          errors={errors}
          setErrors={setErrors}
        />
      </div>
    </>
  );
};

export default Appointments;
