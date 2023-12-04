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
    <div className="p-4 hover:scale-105 duration-100 border-2 dark:border-gray-500 dark:bg-[#2d2d2d] bg-white border-gray-200 cursor-pointer text-black dark:text-white">
      <h1 className="text-3xl font-bold mb-5">{appointment.name}</h1>
      <h2>
        From <span className="font-bold">{appointment.startDate}</span> to{" "}
        <span className="font-bold">{appointment.endDate}</span>
      </h2>
      <h2 className="italic">
        For: {appointment.user?.firstName || ""}{" "}
        {appointment.user?.lastName || ""}
      </h2>

      <div className="mt-5 flex flex-col gap-3">
        <FormButton onClick={() => onEdit(appointment)} variant="success">
          Edit
        </FormButton>

        <FormButton onClick={() => onDelete(appointment)} variant="danger">
          Delete
        </FormButton>
      </div>
    </div>
  );
};

export default AppointmentCard;
