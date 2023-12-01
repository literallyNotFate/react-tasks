import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { IAppointment } from "../../../models/types";
import FormButton from "../shared/FormButton";
import customParseFormat from "dayjs/plugin/customParseFormat";
import AppointmentCard from "../shared/card/AppointmentCard";
import { axiosApi } from "../../../api/axios";

dayjs.extend(customParseFormat);

interface ICalendarProps {
  appointments: IAppointment[];
  selected: IAppointment[];
  setSelected: (selected: IAppointment[]) => void;
  onDelete: (appointment: IAppointment) => void;
  onEdit: (appointment: IAppointment) => void;
}

interface ICalendarCell {
  appointment: IAppointment[];
  color: string;
  first: IAppointment[];
}

const AppointmentCalendar: React.FC<ICalendarProps> = ({
  appointments,
  selected,
  setSelected,
  onDelete,
  onEdit,
}) => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());

  const goToPreviousMonth = () => {
    setCurrentMonth((prev) => prev.subtract(1, "month"));
  };

  const goToNextMonth = () => {
    setCurrentMonth((prev) => prev.add(1, "month"));
  };

  const getAppointment = async (id: string | undefined) => {
    try {
      const response = await axiosApi.get<IAppointment>(`appointment/${id}`);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const handleClick = async (appointments: ICalendarCell[]) => {
    const cell: IAppointment[][] = appointments.map(
      (value) => value.appointment
    );

    const apps: IAppointment[] = cell.flat(1);

    try {
      const promises = apps.map((item) => getAppointment(item.id));
      const results = await Promise.all(promises);

      setSelected(results);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const [appointmentColors, setAppointmentColors] = useState<{
    [key: string]: string;
  }>({});

  const generateAppointmentColors = (appointments: IAppointment[]): void => {
    const colors: { [key: string]: string } = {};

    appointments.forEach((appointment) => {
      if (!appointmentColors[appointment.id]) {
        colors[appointment.id] = `hsla(${~~(
          360 * Math.random()
        )}, 70%, 72%, 0.8)`;
      }
    });

    setAppointmentColors((prevColors) => ({ ...prevColors, ...colors }));
  };

  useEffect(() => {
    generateAppointmentColors(appointments);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointments]);

  const isFirst = (
    day: number,
    appointments: IAppointment[]
  ): IAppointment[] => {
    const first = appointments.filter(
      (value) => dayjs(value.startDate, "DD-MM-YYYY").date() === day
    );

    return first;
  };

  const renderCalendar = () => {
    const startOfMonth = currentMonth.startOf("month");
    const endOfMonth = currentMonth.endOf("month");
    const startDate = startOfMonth.startOf("week");
    const endDate = endOfMonth.endOf("week");
    const totalDays = endDate.diff(startDate, "day") + 1;

    const calendarDays: JSX.Element[] = [];
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const appointmentsMap: { [key: string]: ICalendarCell[] } = {};

    appointments.forEach((appointment) => {
      const startDate = dayjs(appointment.startDate, "DD-MM-YYYY");
      const endDate = dayjs(appointment.endDate, "DD-MM-YYYY");
      const dateDiff = endDate.diff(startDate, "day") + 1;

      for (let i = 0; i < dateDiff; i++) {
        const currentDate = startDate.add(i, "day");
        const key = currentDate.format("DD-MM-YYYY");

        if (!appointmentsMap[key]) {
          appointmentsMap[key] = [];
        }

        appointmentsMap[key].push({
          appointment: [appointment],
          color: appointmentColors[appointment.id],
          first: isFirst(currentDate.date(), [appointment]),
        });
      }
    });

    for (let j = 0; j < daysOfWeek.length; j++) {
      calendarDays.push(
        <div>
          <div
            key={`day-of-week-${j}`}
            className="flex justify-center items-center md:h-12 font-bold h-6 md:w-32 w-16 my-3 mx-3 bg-gray-200"
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
            key={`calendar-day-${i}-${currentDate.format("DD-MM-YYYY")}`}
            className={`flex justify-center hover:scale-105 cursor-pointer hover:border-2 hover:border-indigo-400 items-center md:h-32 md:w-32 h-fit w-16 mx-3 my-3 ${
              currentDate.isSame(dayjs(), "day")
                ? "bg-green-200"
                : "bg-gray-200"
            }`}
            onClick={() => handleClick(appointmentsForDay)}
          >
            <div className="w-full h-full">
              <span className="text-xl font-bold">
                {currentDate.format("D")}
              </span>

              <div className="mt-2">
                {appointmentsForDay.map((value, index) => (
                  <div
                    key={`${value.color}-${value.appointment[0].id}-${index}`}
                    style={{ backgroundColor: value.color }}
                  >
                    {value.first.length > 0 ? (
                      value.first.map((f) => (
                        <span
                          className="font-medium text-sm"
                          style={{ color: "black" }}
                          key={f.id}
                        >
                          {value.appointment[0].name}
                        </span>
                      ))
                    ) : (
                      <span
                        className="font-medium text-sm"
                        style={{ opacity: 0 }}
                      >
                        {value.appointment[0].name}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      } else {
        calendarDays.push(
          <div
            key={`empty-calendar-day-${i}`}
            className="flex justify-center items-center md:h-32 md:w-32 h-16 w-16 bg-gray-100 my-3 mx-3"
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
        {selected.length > 0 ? (
          <div className="grid grid-cols-3 gap-10">
            {selected.map((app) => (
              <AppointmentCard
                appointment={app}
                key={`appointment-${app.id}`}
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
