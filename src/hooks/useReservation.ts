import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { useState } from 'react';

const DAY_OF_WEEK = 7;

export function useReservation() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const getCalendarDays = (): Date[] => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    return eachDayOfInterval({
      start: calendarStart,
      end: calendarEnd,
    });
  };

  const getWeeks = (): Date[][] => {
    const days = getCalendarDays();
    const weeks: Date[][] = [];

    for (let i = 0; i < days.length; i += DAY_OF_WEEK) {
      weeks.push(days.slice(i, i + DAY_OF_WEEK));
    }

    return weeks;
  };

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const handleSelectDate = (date: Date) => setSelectedDate(date);
  const isCurrentMonth = (date: Date): boolean => isSameMonth(date, currentDate);
  const isSelected = (date: Date): boolean => isSameDay(date, selectedDate);
  const isToday = (date: Date): boolean => isSameDay(date, new Date());
  const getFormattedMonthYear = (): string => format(currentDate, 'MMMM yyyy');

  return {
    currentDate,
    selectedDate,
    weeks: getWeeks(),
    handlePrevMonth,
    handleNextMonth,
    handleSelectDate,
    isCurrentMonth,
    isSelected,
    isToday,
    getFormattedMonthYear,
  };
}