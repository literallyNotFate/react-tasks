import React, { useState } from "react";
import dayjs from "dayjs";
import { IAppointment } from "../../../models/types";
import FormButton from "../shared/FormButton";
import customParseFormat from "dayjs/plugin/customParseFormat";
import AppointmentCard from "../shared/card/AppointmentCard";

dayjs.extend(customParseFormat);

interface ICalendarProps {
  appointments: IAppointment[];
  onDelete: (appointment: IAppointment) => void;
  onEdit: (appointment: IAppointment) => void;
}

const AppointmentCalendar: React.FC<ICalendarProps> = ({
  appointments,
  onDelete,
  onEdit,
}) => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [appointmentsSelected, setAppointmentsSelected] = useState<
    IAppointment[]
  >([]);

  const goToPreviousMonth = () => {
    setCurrentMonth((prev) => prev.subtract(1, "month"));
  };

  const goToNextMonth = () => {
    setCurrentMonth((prev) => prev.add(1, "month"));
  };

  const handleClick = (appointments: IAppointment[]) => {
    setAppointmentsSelected(appointments);
  };

  const renderCalendar = () => {
    const startOfMonth = currentMonth.startOf("month");
    const endOfMonth = currentMonth.endOf("month");
    const startDate = startOfMonth.startOf("week");
    const endDate = endOfMonth.endOf("week");
    const totalDays = endDate.diff(startDate, "day") + 1;

    const calendarDays: JSX.Element[] = [];
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const appointmentsMap: { [key: string]: IAppointment[] } = {};

    appointments.forEach((appointment) => {
      const startDate = dayjs(appointment.startDate, "DD-MM-YYYY");
      //const endDate = dayjs(appointment.endDate, "DD-MM-YYYY");
      const key = startDate.format("DD-MM-YYYY");

      if (!appointmentsMap[key]) {
        appointmentsMap[key] = [];
      }

      appointmentsMap[key].push(appointment);
    });

    // const appointmentsMap: {
    //   [key: string]: {
    //     apps: IAppointment[];
    //     color: string;
    //   };
    // } = {};

    // appointments.forEach((appointment) => {
    //   const startDate = dayjs(appointment.startDate, "DD-MM-YYYY");
    //   const endDate = dayjs(appointment.endDate, "DD-MM-YYYY");

    //   const dateDiff = endDate.diff(startDate, "day") + 1;
    //   const color = "#" + Math.floor(Math.random() * 16777215).toString(16);

    //   for (let i = 0; i < dateDiff; i++) {
    //     const currentDate = startDate.add(i, "day");
    //     const key = currentDate.format("DD-MM-YYYY");

    //     if (!appointmentsMap[key]) {
    //       appointmentsMap[key] = {
    //         apps: [],
    //         color: "#C8C8C8",
    //       };
    //     }

    //     // const data = {
    //     //   apps: appointment,
    //     //   color: color,
    //     // };

    //     appointmentsMap[key].apps = [appointment];
    //     appointmentsMap[key].color = color;
    //   }
    // });

    for (let j = 0; j < daysOfWeek.length; j++) {
      calendarDays.push(
        <div>
          <div
            key={j}
            className="flex justify-center items-center md:h-12 font-bold h-6 md:w-32 w-16 mx-3 my-3 bg-gray-200"
          >
            {daysOfWeek[j]}
          </div>
        </div>
      );
    }

    for (let i = 0; i < totalDays; i++) {
      const currentDate = startDate.add(i, "day");

      const appointmentsForDay =
        appointmentsMap[currentDate.format("DD-MM-YYYY")] || [];

      if (
        (currentDate.isSame(startOfMonth, "day") ||
          currentDate.isAfter(startOfMonth, "day")) &&
        (currentDate.isSame(endOfMonth, "day") ||
          currentDate.isBefore(endOfMonth, "day"))
      ) {
        calendarDays.push(
          <div
            key={i}
            className={`flex justify-center hover:scale-105 cursor-pointer hover:border-2 hover:border-indigo-400 items-center md:h-32 md:w-32 h-16 w-16 mx-3 my-3 relative ${
              currentDate.isSame(dayjs(), "day")
                ? "bg-green-200"
                : "bg-gray-200"
            }`}
            onClick={() => handleClick(appointmentsForDay)}
          >
            <div>
              <span className="text-xl absolute top-0 left-0 m-3 font-bold">
                {currentDate.format("D")}

                <div className="mt-2">
                  {appointmentsForDay.map((appointment) => (
                    <div key={appointment.id}>
                      <span className="text-sm font-medium">
                        {appointment.name}
                      </span>
                    </div>
                  ))}
                </div>

                {/* {appointmentsForDay.apps?.length > 0 ? (
                  <div className="mt-2">
                    {appointmentsForDay.apps.map((appointment) => (
                      <div key={appointment.id}>
                        <span className="text-sm font-medium">
                          {appointment.name}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : null} */}
              </span>
            </div>
          </div>
        );
      } else {
        calendarDays.push(
          <div
            key={i}
            className="flex justify-center items-center md:h-32 md:w-32 h-16 w-16 mx-3 my-3 relative bg-gray-100"
          ></div>
        );
      }
    }

    return calendarDays;
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center mb-4 gap-5 w-1/2 mx-auto">
        <FormButton className="mr-2 w-fit" onClick={goToPreviousMonth}>
          {"<"}
        </FormButton>
        <h1 className="text-3xl text-center font-bold w-[300px]">
          {currentMonth.format("MMMM YYYY")}
        </h1>
        <FormButton className="ml-2 w-fit" onClick={goToNextMonth}>
          {">"}
        </FormButton>
      </div>

      <div className="my-6">
        {appointmentsSelected.length > 0 ? (
          <div className="grid grid-cols-3 gap-10">
            {appointmentsSelected.map((app) => (
              <AppointmentCard
                appointment={app}
                key={app.id}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))}
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap justify-center">{renderCalendar()}</div>
    </div>
  );
};

export default AppointmentCalendar;
