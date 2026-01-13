'use client';

import { format } from 'date-fns';
import { useState } from 'react';
import { useReservation } from '@/src/hooks/useReservation';
import Button from '@/src/components/Button/Button';

const DAY_LIST = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

// Props 타입 정의 (API에서 받아올 데이터)
interface ReservationProps {
  pricePerPerson?: number; // 체험 등록 페이지에서 설정한 1인당 가격
  availableTimes?: string[]; // 체험 등록 페이지에서 설정한 예약 가능 시간대
}

export default function Reservation({ 
  pricePerPerson = 1000, // 목업 (API 연동 전까지 사용)
  availableTimes = ['14:00~15:00', '15:00~16:00', '16:00~17:00', '17:00~18:00'] // 기본값
}: ReservationProps) {
  const {
    weeks,
    handlePrevMonth,
    handleNextMonth,
    handleSelectDate,
    isCurrentMonth,
    isSelected,
    isToday,
    getFormattedMonthYear,
  } = useReservation();

  const [attendees, setAttendees] = useState(1);
  const [selectedTime, setSelectedTime] = useState<string | null>(availableTimes[0] || null);
  const [hasSelectedDate, setHasSelectedDate] = useState(false);

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
    <div className="w-full bg-white p-0">
      {/* 가격 */}
      <div className="mb-4">
        <span className="text-h2 font-bold text-gray-900 tracking-h2">₩ {pricePerPerson.toLocaleString()}</span>
        <span className="text-gray-600 ml-1 text-h3 font-medium">/ 인</span>
      </div>

      {/* 날짜 섹션 */}
      <div className="mb-4">
        <h3 className="text-body-lg font-bold text-gray-900 mb-3">날짜</h3>

        {/* 월/년도 헤더 */}
        <div className="flex justify-between items-center mb-3">
          <span className="text-body-lg font-medium text-gray-900">
            {getFormattedMonthYear()}
          </span>
          <div className="flex gap-3">
            <button
              onClick={handlePrevMonth}
              className="w-5 h-5 flex items-center justify-center text-gray-900 hover:text-gray-600"
            >
              ◀
            </button>
            <button
              onClick={handleNextMonth}
              className="w-5 h-5 flex items-center justify-center text-gray-900 hover:text-gray-600"
            >
              ▶
            </button>
          </div>
        </div>

        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAY_LIST.map((day, index) => (
            <div key={index} className="text-center text-body-lg font-semibold text-gray-600">
              {day}
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="space-y-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-1">
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
                      aspect-square flex items-center justify-center rounded-full text-body-lg font-bold
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
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <h3 className="text-body-lg font-bold text-gray-900">참여 인원수</h3>
          <div className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-1">
            <button
              onClick={handleDecreaseAttendees}
              disabled={attendees <= 1}
              className="w-8 h-8 flex items-center justify-center bg-white text-gray-900 text-body-lg font-bold hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              −
            </button>
            <span className="text-body-lg font-bold text-gray-900 min-w-[28px] text-center">
              {attendees}
            </span>
            <button
              onClick={handleIncreaseAttendees}
              className="w-8 h-8 flex items-center justify-center bg-white text-gray-900 text-body-lg font-bold hover:bg-gray-50"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* 예약 가능한 시간 */}
      <div className="mb-4">
        <h3 className="text-body-lg font-bold text-gray-900 mb-3">예약 가능한 시간</h3>
        <div className="space-y-2">
          {availableTimes.map((time) => (
            <button
              key={time}
              onClick={() => setSelectedTime(time)}
              className={`
                w-full h-12 rounded-lg border text-body-lg font-medium transition-colors
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
      <div className="flex justify-between items-center pt-3 border-t border-gray-200">
        <div className="flex items-baseline gap-2">
          <span className="text-h3 font-medium text-gray-600">총 합계</span>
          <span className="text-h3 font-bold text-gray-900 tracking-h3">
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