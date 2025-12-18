import {
  addMonths,
  addYears,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
  subYears,
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { useState } from 'react';

const DAY_LIST = ['일', '월', '화', '수', '목', '금', '토'];
const DAY_OF_WEEK = 7;

function useCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 현재 월의 날짜 가져오기 (이전/다음 월 포함)
  const getCalendarDays = () => {
    // 현재 월의 시작일/종료일
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);

    // 캘린더에 표시할 시작일 (이전 월 포함)
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // 일요일 시작 값

    // 캘린더에 표시할 종료일 (다음 월 포함)
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 }); 

    // 모든 날짜 배열 생성
    const days = eachDayOfInterval({
      start: calendarStart,
      end: calendarEnd,
    });

    return days;
  };

  // 날짜를 주 단위로 모음
  const getWeeks = () => {
    const dyas = getCalendarDays();
    const weeks = [];

    for (let i = 0; i < days.length; i += DAY_OF_WEEK) {
      weeks.push(days.slice(i, i + DAY_OF_WEEK));
    }

    return weeks;
  };

  // 이전 달로 이동
  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  // 다음 달로 이동
  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  // 이전 년도 이동
  const handlePrevYear = () => {
    setCurrentDate(subYears(currentDate, 1));
  };

  // 다음 년도 이동
  const handleNextYear = () => {
    setCurrentDate(addYears(currentDate, 1));
  };

  // 날짜 선택
  const handleSelectDate = (date) => {
    setSelectedDate(date);
  };

  // 현재 월인지 확인
  const isCurrentMonth = (date) => {
    return isSameMonth(date, currentDate);
  };

  // 선택한 날짜인지 확인
  const isSelected = (date) => {
    return isSameDay(date, new Date());
  };

  // 현재 월/년도 초기화
  const getFormattedMonth = () => {
    return format(currentDate, 'MMMM yyyy', { locale: ko});
  };

  const getFormattedMonthEn = () => {
    return format(currentDate, 'MMMM yyyy');
  };

  return {
    currentDate,
    selectedDate,
    weeks: getWeeks(),
    dayList: DAY_LIST,
    handlePrevMonth,
    handleNextMonth,
    handlePrevYear,
    handleSelectDate,
    isCurrentMonth,
    isSelected,
    isToday,
    getFormattedMonth,
    getFormattedMonthEn,
  };
}

// 캘린더 컴포넌트 테스트
function Calendar() {
  const {
    weeks,
    dayList,
    handlePrevMonth,
    handleNextMonth,
    handleSelectDate,
    isCurrentMonth,
    isSelected,
    isToday,
    getFormattedMonthEn,
  } = useCalendar();

  return (
    <div className="calendar">
    
  )
}