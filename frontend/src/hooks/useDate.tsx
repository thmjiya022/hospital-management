import { useEffect, useState } from "react";

export type CalendarMatrix = number[][];

export interface UseCalendarDateResult {
    date: Date;
    calendarMatrix: CalendarMatrix;
    setDate: (date: Date) => void;
    goToToday: () => void;
    syncTimeToNow: () => void;
    goToNextMonth: () => void;
    goToPreviousMonth: () => void;
    goToNextYear: () => void;
    goToPreviousYear: () => void;
    incrementHours: () => void;
    decrementHours: () => void;
    incrementMinutes: () => void;
    decrementMinutes: () => void;
    setHours: (hours: number) => void;
    setMinutes: (minutes: number) => void;
}

const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

const buildCalendarMatrix = (date: Date): CalendarMatrix => {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const totalDays = getDaysInMonth(date);
    const days: number[] = [];

    for (let i = 0; i < startOfMonth.getDay(); i++) {
        days.push(0);
    }

    for (let day = 1; day <= totalDays; day++) {
        days.push(day);
    }

    const matrix: CalendarMatrix = [];

    for (let i = 0; i < days.length; i += 7) {
        matrix.push(days.slice(i, i + 7));
    }

    return matrix;
}

const useCalendarDate = (initialDate: Date | null, controlledDate?: Date | null,onDateChange?: (date: Date) => void): UseCalendarDateResult => {
    const [internalDate, setInternalDate] = useState<Date>(initialDate ?? new Date());
    const [calendarMatrix, setCalendarMatrix] = useState<CalendarMatrix>([]);
    const date = controlledDate ?? internalDate;
    const setDate = onDateChange ?? setInternalDate;

    useEffect(() => {
        setCalendarMatrix(buildCalendarMatrix(date));
    }, [date]);


    const updateDate = (updates: Partial<{year: number; month: number; day: number; hours: number; minutes: number; seconds: number}>) => {
        setDate(
            new Date(
                updates.year ?? date.getFullYear(),
                updates.month ?? date.getMonth(),
                updates.day ?? date.getDate(),
                updates.hours ?? date.getHours(),
                updates.minutes ?? date.getMinutes(),
                updates.seconds ?? date.getSeconds()
            )
        );
    };

    const goToToday = () => {
        const now = new Date();
        updateDate({
            year: now.getFullYear(),
            month: now.getMonth(),
            day: now.getDate(),
        });
    };

    const syncTimeToNow = () => {
        const now = new Date();
        updateDate({
            hours: now.getHours(),
            minutes: now.getMinutes(),
            seconds: now.getSeconds(),
        });
    };

    const goToNextMonth = () => updateDate({ month: date.getMonth() + 1 });
    const goToPreviousMonth = () => updateDate({ month: date.getMonth() - 1});
    const goToNextYear = () => updateDate({year: date.getFullYear() + 1});
    const goToPreviousYear = () => updateDate({ year: date.getFullYear() - 1});
    const incrementHours = () => updateDate({ hours: (date.getHours() + 1) % 24 });
    const decrementHours = () => updateDate({ hours: (date.getHours() + 23) % 24 });
    const incrementMinutes = () => updateDate({ minutes: (date.getMinutes() + 1) % 60 });
    const decrementMinutes = () => updateDate({ minutes: (date.getMinutes() + 59) % 60 });
    const setHours = (hours: number) => updateDate({ hours: Math.min(Math.max(hours, 0), 23) });
    const setMinutes = (minutes: number) => updateDate({ minutes: Math.min(Math.max(minutes, 0), 59) });

    return { date, calendarMatrix, setDate, goToToday, syncTimeToNow, goToNextMonth, goToPreviousMonth, goToNextYear,goToPreviousYear, incrementHours, decrementHours, incrementMinutes, decrementMinutes, setHours, setMinutes};
};

export default useCalendarDate;
