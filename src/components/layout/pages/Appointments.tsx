import CreateAppointment from "../../ui/create/CreateAppointment";
import { useEffect, useState } from "react";
import FormButton from "../../ui/shared/FormButton";
import {
  IAppointment,
  IAppointmentData,
  IAppointmentForm,
  IError,
  IUser,
} from "../../../models/types";
import { format } from "date-fns";
import { axiosApi } from "../../../api/axios";
import EditAppointment from "../../ui/edit/EditAppointment";
import { parseDateFromString } from "../../../lib/utils";
import AppointmentCalendar from "../../ui/calendar/AppointmentCalendar";
import toast from "react-hot-toast";
import Loading from "../../ui/shared/Loading";

const Appointments: React.FC = () => {
  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [showEdit, setShowEdit] = useState<boolean>(false);

  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [selected, setSelected] = useState<IAppointment[]>([]);

  const [edit, setEdit] = useState<IAppointmentForm>();
  const [editId, setEditId] = useState<string>("");

  const [errors, setErrors] = useState<IError>({ errors: [] });
  const [me, setMe] = useState<IUser>();

  const [formResetFlag, setFormResetFlag] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getAppointments = () => {
      setLoading(true);
      axiosApi
        .get<IAppointment[]>("/appointment")
        .then((res) => setAppointments(res.data))
        .catch((err) => toast.error(err))
        .finally(() => setLoading(false));
    };

    const getMe = () => {
      axiosApi
        .get<IUser>("/user/profile")
        .then((res) => setMe(res.data))
        .catch((err) => console.log(err));
    };

    getAppointments();
    getMe();
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

    const id = me ? parseInt(me.id, 10) : 0;

    const data: IAppointmentData = {
      name: appointment.name,
      startDate: startD,
      endDate: endD,
      userId: id,
    };

    return data;
  };

  const onCreate = (appointment: IAppointmentForm) => {
    const data = parseToApiData(appointment);

    axiosApi
      .post("/appointment", data)
      .then((res) => {
        setErrors({ errors: [] });
        setShowCreate(false);
        setFormResetFlag(true);
        setAppointments((prev) => [...prev, res.data]);

        toast.success(`Appointment '${res.data.name}' created!`);
      })
      .catch((err) => {
        setErrors({ errors: err.response?.data.message });
      });
  };

  const onDelete = (appointment: IAppointment) => {
    axiosApi
      .delete(`/appointment/${appointment.id}`)
      .then(() => {
        const updatedAppointments: IAppointment[] = appointments.filter(
          (app) => app.id !== appointment.id
        );

        const updatedSelected: IAppointment[] = selected.filter(
          (app) => app.id !== appointment.id
        );

        setAppointments(updatedAppointments);
        setSelected(updatedSelected);

        toast.success(`Appointment '${appointment.name}' deleted!`);
      })
      .catch((err) => {
        toast.error(`${err.response?.data.message}`);
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
    setErrors({ errors: [] });
    setEditId(appointment.id);
    setShowEdit(true);
  };

  const editing = (updatedData: IAppointmentForm) => {
    const data = parseToApiData(updatedData);

    axiosApi
      .patch(`/appointment/${editId}`, data)
      .then((res) => {
        setErrors({ errors: [] });
        setShowEdit(false);

        const updatedAppointments = appointments.map((item) => {
          if (item.id === editId) {
            return { ...item, ...res.data };
          }
          return item;
        });

        const updatedSelected = selected.map((item) => {
          if (item.id === editId) {
            return { ...item, ...res.data };
          }
          return item;
        });

        setAppointments(updatedAppointments);
        setSelected(updatedSelected);

        toast.success(`Appointment with ID: ${editId} edited!`);
      })
      .catch((err) => {
        setErrors({ errors: err.response?.data.message });
      });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div className="p-12 bg-black w-full md:w-3/4 border-2 border-gray-500 mx-auto  flex flex-col gap-5">
        <div>
          <h1 className="text-4xl font-bold text-white mb-7">
            All Appointments
          </h1>
        </div>
        <div className="w-64">
          <FormButton onClick={() => setShowCreate(true)} variant="success">
            Create an appointment
          </FormButton>
        </div>

        <div className="mt-6">
          <AppointmentCalendar
            appointments={appointments}
            selected={selected}
            setSelected={setSelected}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        </div>

        <CreateAppointment
          show={showCreate}
          setShow={setShowCreate}
          onCreate={onCreate}
          errors={errors}
          me={me as IUser}
          resetForm={formResetFlag}
          setResetFormFlag={() => setFormResetFlag(false)}
        />

        <EditAppointment
          show={showEdit}
          setShow={setShowEdit}
          edit={edit as IAppointmentForm}
          editing={editing}
          id={editId}
          errors={errors}
          setErrors={setErrors}
          me={me as IUser}
        />
      </div>
    </>
  );
};

export default Appointments;
