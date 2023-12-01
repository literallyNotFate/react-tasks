import { IAppointment } from "../../../../models/types";
import FormButton from "../FormButton";

interface IAppointmentCardProps {
  appointment: IAppointment;
  onEdit: (appointment: IAppointment) => void;
  onDelete: (appointment: IAppointment) => void;
}

const AppointmentCard: React.FC<IAppointmentCardProps> = ({
  appointment,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="p-4 hover:scale-105 duration-100 border border-black rounded-lg cursor-pointer">
      <h1 className="text-2xl text-center text-indigo-400 underline">
        {appointment.name}
      </h1>
      <h2>
        From <span className="font-bold">{appointment.startDate}</span> to{" "}
        <span className="font-bold">{appointment.endDate}</span>
      </h2>
      <h2>
        For: {appointment.user?.firstName || ""}{" "}
        {appointment.user?.lastName || ""}
      </h2>

      <div className="mt-5 flex flex-col gap-3">
        <FormButton onClick={() => onEdit(appointment)}>Edit</FormButton>

        <FormButton
          onClick={() => onDelete(appointment)}
          className="bg-red-500 hover:bg-red-600"
        >
          Delete
        </FormButton>
      </div>
    </div>
  );
};

export default AppointmentCard;
