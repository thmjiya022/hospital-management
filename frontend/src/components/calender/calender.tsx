import { type FC, useEffect, useState } from "react";
import { faAngleDoubleLeft, faAngleDoubleRight, faAngleLeft, faAngleRight, } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const MONTH_NAMES: readonly string[] = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

const WEEK_DAYS: readonly string[] = [
    "Sunday", "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday",
];

export type CalendarMatrix = number[][];

export interface CalendarViewProps {
    currentDate: Date;
    calendarMatrix: CalendarMatrix;
    onDateChange: (date: Date) => void;
    onPrevMonth: () => void;
    onNextMonth: () => void;
    onPrevYear: () => void;
    onNextYear: () => void;
    onGoToToday: () => void;
}

const CalendarView: FC<CalendarViewProps> = ({currentDate, calendarMatrix, onDateChange,onPrevMonth,onNextMonth,onPrevYear,onNextYear,onGoToToday}) => {
    const [selectedDate, setSelectedDate] = useState<Date>(currentDate);
    const [monthLabel, setMonthLabel] = useState<string>(MONTH_NAMES[currentDate.getMonth()].toUpperCase());
    const [yearLabel, setYearLabel] = useState<number>(currentDate.getFullYear());

    useEffect(() => {
        setMonthLabel(MONTH_NAMES[currentDate.getMonth()].toUpperCase());
        setYearLabel(currentDate.getFullYear());
    }, [currentDate]);

    const handleDaySelect = (day: number): void => {
        if (day <= 0) return;

        const newDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            day,
            currentDate.getHours(),
            currentDate.getMinutes(),
            currentDate.getSeconds()
        );

        setSelectedDate(newDate);
        onDateChange(newDate);
    };

    const isToday = (day: number): boolean => {
        const today = new Date();
        return (
            today.getDate() === day &&
            today.getMonth() === currentDate.getMonth() &&
            today.getFullYear() === currentDate.getFullYear()
        );
    };

    const isSelected = (day: number): boolean => {
        return (
            selectedDate.getDate() === day &&
            selectedDate.getMonth() === currentDate.getMonth() &&
            selectedDate.getFullYear() === currentDate.getFullYear()
        );
    };

    const getCellClasses = (day: number): string => {
        if (isSelected(day)) {
            return "bg-portal-blue-primary text-gray-100";
        }
        if (isToday(day)) {
            return "bg-gray-300 text-gray-600";
        }
        return "text-gray-600";
    };

    return (
        <div className="w-full p-2" id="calendar">
            <div className="flex justify-between items-center my-1">
                <div>
                    <button onClick={onPrevYear} className="mx-1 hover:text-portal-blue-primary">
                        <FontAwesomeIcon icon={faAngleDoubleLeft} />
                    </button>
                    <button onClick={onPrevMonth} className="mx-3 hover:text-portal-blue-primary">
                        <FontAwesomeIcon icon={faAngleLeft} />
                    </button>
                </div>
                <button
                    onClick={onGoToToday}
                    className="font-bold text-xs rounded py-1 px-2 hover:text-portal-blue-primary">
                    {monthLabel} {yearLabel}
                </button>
                <div>
                    <button onClick={onNextMonth} className="mx-3 hover:text-portal-blue-primary">
                        <FontAwesomeIcon icon={faAngleRight} />
                    </button>
                    <button onClick={onNextYear} className="mx-1 hover:text-portal-blue-primary">
                        <FontAwesomeIcon icon={faAngleDoubleRight} />
                    </button>
                </div>
            </div>

            <table className="w-full">
                <thead>
                    <tr>
                        {WEEK_DAYS.map((day) => (
                            <th key={day} className="text-xs">
                                {day.slice(0, 3).toUpperCase()}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {calendarMatrix.map((week, rowIndex) => (
                        <tr key={rowIndex}>
                            {week.map((day, colIndex) => (
                                <td key={colIndex} className={`text-xs text-center p-0 ${getCellClasses(day)}`}>
                                    <button onClick={() => handleDaySelect(day)}>
                                        {day > 0 ? day : ""}
                                    </button>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CalendarView;