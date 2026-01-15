'use client';

import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { useReservation } from '@/src/hooks/useReservation';
import Button from '@/src/components/Button/Button';
import CompleteModal from '@/src/components/Modal/CompleteModal';
import { getAvailableSchedule, AvailableSchedule, AvailableTime, createReservation } from '@/src/features/public/services/activities';

const DAY_LIST = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

// Props 타입 정의
interface ReservationProps {
  activityId: string;
  pricePerPerson?: number;
}

export default function Reservation({ 
  activityId,
  pricePerPerson = 1000,
}: ReservationProps) {
  const {
    weeks,
    selectedDate,
    handlePrevMonth,
    handleNextMonth,
    handleSelectDate,
    isCurrentMonth,
    isSelected,
    isToday,
    getFormattedMonthYear,
  } = useReservation();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendees, setAttendees] = useState(1);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(null);
  const [hasSelectedDate, setHasSelectedDate] = useState(false);
  const [availableSchedules, setAvailableSchedules] = useState<AvailableSchedule[]>([]);
  const [availableTimes, setAvailableTimes] = useState<AvailableTime[]>([]);
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalPrice = pricePerPerson * attendees;

  // 월 변경 시 일정 조회
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setIsLoadingSchedule(true);
        const year = format(currentDate, 'yyyy');
        const month = format(currentDate, 'MM');
        
        const schedules = await getAvailableSchedule(activityId, year, month);
        setAvailableSchedules(schedules);
      } catch (error) {
        console.error('예약 가능 일정 조회 실패:', error);
        setAvailableSchedules([]);
      } finally {
        setIsLoadingSchedule(false);
      }
    };

    if (activityId) {
      fetchSchedule();
    }
  }, [currentDate, activityId]);

  // 날짜 선택 시 해당 날짜의 예약 가능 시간대 업데이트
  useEffect(() => {
    if (selectedDate) {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const schedule = availableSchedules.find(s => s.date === formattedDate);
      
      if (schedule && schedule.times.length > 0) {
        setAvailableTimes(schedule.times);
        // 첫 번째 시간대 자동 선택
        setSelectedTime(`${schedule.times[0].startTime}~${schedule.times[0].endTime}`);
        setSelectedScheduleId(schedule.times[0].id);
      } else {
        setAvailableTimes([]);
        setSelectedTime(null);
        setSelectedScheduleId(null);
      }
    }
  }, [selectedDate, availableSchedules]);

  const handleIncreaseAttendees = () => setAttendees((prev) => prev + 1);
  const handleDecreaseAttendees = () => {
    if (attendees > 1) setAttendees((prev) => prev - 1);
  };

  const handleDateSelect = (day: Date) => {
    handleSelectDate(day);
    setHasSelectedDate(true);
  };

  // 이전 달로 이동
  const goToPrevMonth = () => {
    handlePrevMonth();
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  // 다음 달로 이동
  const goToNextMonth = () => {
    handleNextMonth();
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // 해당 날짜에 예약 가능한 시간이 있는지 확인
  const hasAvailableTime = (date: Date) => {
    if (!date) return false;
    
    const formattedDate = format(date, 'yyyy-MM-dd');
    const schedule = availableSchedules.find(s => s.date === formattedDate);
    const hasTime = schedule && schedule.times.length > 0;
    
    return hasTime;
  };

  // 예약하기
  const handleReservation = async () => {
    if (!selectedDate) {
      alert('날짜를 선택해주세요.');
      return;
    }
    if (!selectedScheduleId) {
      alert('시간을 선택해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      await createReservation(activityId, {
        scheduleId: selectedScheduleId,
        headCount: attendees,
      });
      setIsModalOpen(true);
    } catch (error) {
      console.error('예약 실패:', error);
      alert('예약에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="w-full bg-white p-0">
        {/* 가격 */}
        <div className="mb-4">
          <span className="text-h2 font-bold text-gray-900 tracking-h2">₩ {pricePerPerson.toLocaleString()}</span>
          <span className="text-gray-600 ml-1 text-h3 font-medium">/ 인</span>
        </div>

        {/* 날짜 선택 */}
        <div className="mb-4">
          <h3 className="text-body-lg font-bold text-gray-900 mb-3">날짜</h3>

          {/* 월 네비게이션 */}
          <div className="flex justify-between items-center mb-3">
            <span className="text-body-lg font-medium text-gray-900">
              {getFormattedMonthYear()}
            </span>
            <div className="flex gap-3">
              <button
                onClick={goToPrevMonth}
                className="w-5 h-5 flex items-center justify-center text-gray-900 hover:text-gray-600"
              >
                &lt;
              </button>
              <button
                onClick={goToNextMonth}
                className="w-5 h-5 flex items-center justify-center text-gray-900 hover:text-gray-600"
              >
                &gt;
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
                  const isTodayDate = day && isToday(day);
                  const isSelectedDate = day && hasSelectedDate && isSelected(day);
                  const isOtherMonth = day && !isCurrentMonth(day);
                  const isAvailable = day && !isOtherMonth && hasAvailableTime(day);

                  return (
                    <button
                      key={dayIndex}
                      onClick={() => day && !isOtherMonth && isAvailable && handleDateSelect(day)}
                      disabled={!day || isOtherMonth || !isAvailable}
                      className={`
                        aspect-square flex items-center justify-center rounded-full text-body-lg font-medium
                        transition-colors
                        ${!day ? 'invisible' : ''}
                        ${isOtherMonth ? 'text-gray-300 cursor-default' : ''}
                        ${!isOtherMonth && !isAvailable ? 'text-gray-300 cursor-not-allowed' : ''}
                        ${!isOtherMonth && isAvailable && !isSelectedDate ? 'text-gray-900 hover:bg-gray-50' : ''}
                        ${isTodayDate && !isSelectedDate ? 'bg-primary-100 text-primary-500' : ''}
                        ${isSelectedDate ? 'bg-primary-500 text-white' : ''}
                      `}
                    >
                      {day ? format(day, 'd') : ''}
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
                -
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
            {isLoadingSchedule ? (
              <div className="text-center text-body text-gray-600 py-4">
                로딩 중...
              </div>
            ) : availableTimes.length > 0 ? (
              availableTimes.map((time) => {
                const timeString = `${time.startTime}~${time.endTime}`;
                return (
                  <button
                    key={time.id}
                    onClick={() => {
                      setSelectedTime(timeString);
                      setSelectedScheduleId(time.id);
                    }}
                    className={`
                      w-full py-3 px-4 rounded-[11px] text-center
                      ${selectedTime === timeString 
                        ? 'bg-primary-100 border-2 border-primary-500 text-primary-500 text-body-lg font-bold' 
                        : 'bg-white border border-gray-200 text-gray-900 text-body font-medium hover:bg-gray-50'}
                    `}
                  >
                    {timeString}
                  </button>
                );
              })
            ) : (
              <div className="text-center text-body text-gray-600 py-4">
                {hasSelectedDate ? '선택한 날짜에 예약 가능한 시간이 없습니다.' : '날짜를 선택해주세요.'}
              </div>
            )}
          </div>
        </div>

        {/* 총 합계 및 예약하기 */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
          <div className="flex items-baseline gap-2">
            <span className="text-h3 font-medium text-gray-600">총 합계</span>
            <span className="text-h3 font-bold text-gray-900 tracking-h3">
              ₩ {totalPrice.toLocaleString()}
            </span>
          </div>
          <Button
            onClick={handleReservation}
            variant="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? '처리 중...' : '예약하기'}
          </Button>
        </div>
      </div>

      {/* 예약 완료 모달 */}
      <CompleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message="예약이 완료되었습니다."
      />
    </>
  );
}