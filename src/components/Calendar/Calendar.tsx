'use client';

import { format } from 'date-fns';
import { useState } from 'react';
import { useCalendar } from '@/src/hooks/useCalendar';
import Button from '@/src/components/Button/Button';

const DAY_LIST = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const TIME_SLOTS = [
  '14:00~15:00',
  '15:00~16:00',
  '16:00~17:00',
  '17:00~18:00',
];

export default function Calendar() {
  const {
    weeks,
    handlePrevMonth,
    handleNextMonth,
    handleSelectDate,
    isCurrentMonth,
    isSelected,
    isToday,
    getFormattedMonthYear,
  } = useCalendar();

  const [attendees, setAttendees] = useState(10);
  const [selectedTime, setSelectedTime] = useState<string | null>('15:00~16:00');
  const [hasSelectedDate, setHasSelectedDate] = useState(false);

  const pricePerPerson = 1000;
  const totalPrice = pricePerPerson * attendees;

  const handleIncreaseAttendees = () => setAttendees((prev) => prev + 1);
  const handleDecreaseAttendees = () => {
    if (attendees > 1) setAttendees((prev) => prev - 1);
  };

  const handleDateSelect = (day: Date) => {
    handleSelectDate(day);
    setHasSelectedDate(true);
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-6">
      {/* 가격 */}
      <div className="mb-6">
        <span className="text-2xl font-bold text-gray-900">₩ {pricePerPerson.toLocaleString()}</span>
        <span className="text-gray-600 ml-1">/ 인</span>
      </div>

      {/* 날짜 섹션 */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">날짜</h3>

        {/* 월/년도 헤더 */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-base font-semibold text-gray-900">
            {getFormattedMonthYear()}
          </span>
          <div className="flex gap-4">
            <button
              onClick={handlePrevMonth}
              className="w-6 h-6 flex items-center justify-center text-gray-900 hover:text-gray-600"
            >
              ◀
            </button>
            <button
              onClick={handleNextMonth}
              className="w-6 h-6 flex items-center justify-center text-gray-900 hover:text-gray-600"
            >
              ▶
            </button>
          </div>
        </div>

        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {DAY_LIST.map((day, index) => (
            <div key={index} className="text-center text-sm font-semibold text-gray-600">
              {day}
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="space-y-2">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-2">
              {week.map((day, dayIndex) => {
                const isTodayDate = isToday(day);
                const isSelectedDate = hasSelectedDate && isSelected(day);
                const isOtherMonth = !isCurrentMonth(day);

                return (
                  <button
                    key={dayIndex}
                    onClick={() => !isOtherMonth && handleDateSelect(day)}
                    disabled={isOtherMonth}
                    className={`
                      aspect-square flex items-center justify-center rounded-full text-sm font-medium
                      transition-colors
                      ${isOtherMonth ? 'text-gray-300 cursor-default' : 'text-gray-900 hover:bg-gray-50'}
                      ${isTodayDate && !isSelectedDate ? 'bg-primary-100 text-primary-500' : ''}
                      ${isSelectedDate ? 'bg-primary-500 text-white' : ''}
                    `}
                  >
                    {format(day, 'd')}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* 참여 인원수 */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">참여 인원수</h3>
          <div className="flex items-center gap-3 border border-gray-200 rounded-full px-5">
            <button
              onClick={handleDecreaseAttendees}
              disabled={attendees <= 1}
              className="w-11 h-11 flex items-center justify-center bg-white text-gray-900 text-xl hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              −
            </button>
            <span className="text-lg font-semibold text-gray-900 min-w-[32px] text-center">
              {attendees}
            </span>
            <button
              onClick={handleIncreaseAttendees}
              className="w-11 h-11 flex items-center justify-center bg-white text-gray-900 text-xl hover:bg-gray-50"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* 예약 가능한 시간 */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">예약 가능한 시간</h3>
        <div className="space-y-3">
          {TIME_SLOTS.map((time) => (
            <button
              key={time}
              onClick={() => setSelectedTime(time)}
              className={`
                w-full h-14 rounded-xl border text-base font-semibold transition-colors
                ${
                  selectedTime === time
                    ? 'bg-primary-100 border-primary-500 text-primary-500'
                    : 'bg-white border-gray-200 text-gray-900 hover:border-gray-300'
                }
              `}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      {/* 하단 예약하기 */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <div className="flex items-baseline gap-3">
          <span className="text-sm text-gray-600">총 합계</span>
          <span className="text-xl font-bold text-gray-900">
            ₩ {totalPrice.toLocaleString()}
          </span>
        </div>
        <Button
          variant="primary"
          size="md"
          disabled={!hasSelectedDate}
          onClick={() => alert('예약 완료!')}
        >
          예약하기
        </Button>
      </div>
    </div>
  );
}