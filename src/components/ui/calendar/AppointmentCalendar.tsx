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
      console.error(error);
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
      console.error(error);
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

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const renderCalendar = () => {
    const startOfMonth = currentMonth.startOf("month");
    const endOfMonth = currentMonth.endOf("month");
    const startDate = startOfMonth.startOf("week");
    const endDate = endOfMonth.endOf("week");
    const totalDays = endDate.diff(startDate, "day") + 1;

    const appointmentsMap: { [key: string]: ICalendarCell[] } = {};

    const calendarRows: JSX.Element[] = [];
    let weekDays: JSX.Element[] = [];

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

    for (let i = 0; i < totalDays; i++) {
      const currentDate = startDate.add(i, "day");

      const appointmentsForDay =
        appointmentsMap[currentDate.format("DD-MM-YYYY")] || [];

      if (weekDays.length === 7) {
        calendarRows.push(
          <tr key={`calendar-row-${calendarRows.length}`}>{weekDays}</tr>
        );
        weekDays = [];
      }

      if (
        (currentDate.isSame(startOfMonth, "day") ||
          currentDate.isAfter(startOfMonth, "day")) &&
        (currentDate.isSame(endOfMonth, "day") ||
          currentDate.isBefore(endOfMonth, "day"))
      ) {
        weekDays.push(
          <td
            key={`calendar-day-${i}-${currentDate.format("DD-MM-YYYY")}`}
            className={`cursor-pointer hover:border hover:border-red-500 w-32 h-32 ${
              currentDate.isSame(dayjs(), "day")
                ? "bg-green-200 text-black"
                : "dark:bg-gray-900 dark:text-white bg-gray-200 text-black"
            }`}
            onClick={() => handleClick(appointmentsForDay)}
          >
            <div className="w-full h-full">
              <span className="text-lg font-bold">
                {currentDate.format("D")}
              </span>

              <div className="mt-2 text-center">
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
          </td>
        );
      } else {
        weekDays.push(
          <td
            key={`empty-calendar-day-${i}`}
            className="dark:bg-black bg-white"
          ></td>
        );
      }
    }

    if (weekDays.length > 0) {
      calendarRows.push(
        <tr key={`calendar-row-${calendarRows.length}`}>{weekDays}</tr>
      );
    }

    return calendarRows;
  };

  return (
    <div className="flex flex-col dark:text-white text-black">
      <div className="flex items-center mb-4 gap-5 mx-auto">
        <FormButton className="mr-2 w-fit" onClick={goToPreviousMonth}>
          Previous
        </FormButton>
        <h1 className="text-lg md:text-3xl text-center font-bold">
          {currentMonth.format("MMMM YYYY")}
        </h1>
        <FormButton className="ml-2 w-fit" onClick={goToNextMonth}>
          Next
        </FormButton>
      </div>

      <div className="my-6">
        {selected.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
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

      <div className="overflow-x-hidden">
        <table className="table-auto">
          <thead>
            <tr>
              {daysOfWeek.map((day, index) => (
                <th
                  key={`day-of-week-${index}`}
                  className="font-bold dark:bg-black bg-gray-200 dark:text-white text-black p-3"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{renderCalendar()}</tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentCalendar;
