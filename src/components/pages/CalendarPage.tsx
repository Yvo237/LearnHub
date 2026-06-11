import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  AlertCircle,
  Video,
  FileText,
  Bell,
  Plus,
} from 'lucide-react';
import { calendarEvents } from '../../data/mockData';
import { CalendarEvent } from '../../types';
import { useApp } from '../../contexts/AppContext';

export default function CalendarPage() {
  const { t, theme } = useApp();
  const isDark = theme === 'dark';

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [view, setView] = useState<'month' | 'list'>('month');

  const MONTHS = [
    t('month.january'), t('month.february'), t('month.march'), t('month.april'),
    t('month.may'), t('month.june'), t('month.july'), t('month.august'),
    t('month.september'), t('month.october'), t('month.november'), t('month.december')
  ];
  const DAYS = [
    t('day.mon'), t('day.tue'), t('day.wed'), t('day.thu'),
    t('day.fri'), t('day.sat'), t('day.sun')
  ];

  const eventTypeConfig = {
    deadline: { 
      icon: AlertCircle, 
      color: 'bg-danger-500', 
      bgColor: isDark ? 'bg-danger-900/30' : 'bg-danger-50', 
      textColor: isDark ? 'text-danger-400' : 'text-danger-700', 
      label: t('calendar.deadline') 
    },
    live: { 
      icon: Video, 
      color: 'bg-success-500', 
      bgColor: isDark ? 'bg-success-900/30' : 'bg-success-50', 
      textColor: isDark ? 'text-success-400' : 'text-success-700', 
      label: t('calendar.live') 
    },
    exam: { 
      icon: FileText, 
      color: 'bg-warning-500', 
      bgColor: isDark ? 'bg-warning-900/30' : 'bg-warning-50', 
      textColor: isDark ? 'text-warning-400' : 'text-warning-700', 
      label: t('calendar.exam') 
    },
    reminder: { 
      icon: Bell, 
      color: 'bg-primary-500', 
      bgColor: isDark ? 'bg-primary-900/30' : 'bg-primary-50', 
      textColor: isDark ? 'text-primary-400' : 'text-primary-700', 
      label: t('calendar.reminder') 
    },
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = lastDay.getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getDayEvents = (day: number): CalendarEvent[] => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return calendarEvents.filter(e => e.date === dateStr);
  };

  const selectedDayEvents = selectedDate
    ? calendarEvents.filter(e => e.date === selectedDate)
    : [];

  const allMonthEvents = calendarEvents
    .filter(e => {
      const d = new Date(e.date);
      return d.getFullYear() === year && d.getMonth() === month;
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className={`p-4 md:p-6 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('calendar.title')}</h1>
          <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {t('calendar.subtitle')}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setView('month')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              view === 'month' 
                ? 'bg-primary-600 text-white' 
                : isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {t('calendar.month')}
          </button>
          <button
            onClick={() => setView('list')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              view === 'list' 
                ? 'bg-primary-600 text-white' 
                : isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {t('calendar.list')}
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          <div className={`rounded-2xl border shadow-sm ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
            {/* Month Navigation */}
            <div className={`flex items-center justify-between border-b px-5 py-4 ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
              <button onClick={prevMonth} className={`rounded-lg p-2 ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}>
                <ChevronLeft className={`h-5 w-5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
              </button>
              <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {MONTHS[month]} {year}
              </h2>
              <button onClick={nextMonth} className={`rounded-lg p-2 ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}>
                <ChevronRight className={`h-5 w-5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
              </button>
            </div>

            {view === 'month' ? (
              <div className="p-4">
                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1">
                  {DAYS.map(d => (
                    <div key={d} className={`py-2 text-center text-xs font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      {d}
                    </div>
                  ))}
                </div>

                {/* Days */}
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: startOffset }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-20" />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const dayEvents = getDayEvents(day);
                    const isSelected = selectedDate === dateStr;
                    const today = new Date();
                    const isToday = year === today.getFullYear() && month === today.getMonth() && day === today.getDate();

                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDate(dateStr)}
                        className={`flex h-20 flex-col items-start rounded-xl p-1.5 text-left transition-all ${
                          isSelected
                            ? 'bg-primary-50 ring-2 ring-primary-500 dark:bg-primary-900/30'
                            : isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-50'
                        }`}
                      >
                        <span
                          className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                            isToday
                              ? 'bg-primary-600 text-white'
                              : isDark ? 'text-slate-300' : 'text-slate-700'
                          }`}
                        >
                          {day}
                        </span>
                        <div className="mt-1 flex flex-wrap gap-0.5">
                          {dayEvents.slice(0, 2).map((evt) => (
                            <div
                              key={evt.id}
                              className={`h-1.5 w-1.5 rounded-full ${eventTypeConfig[evt.type].color}`}
                            />
                          ))}
                          {dayEvents.length > 2 && (
                            <span className={`text-[8px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                              +{dayEvents.length - 2}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className={`divide-y p-4 ${isDark ? 'divide-slate-700' : 'divide-slate-100'}`}>
                {allMonthEvents.length === 0 ? (
                  <p className={`py-8 text-center text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {t('calendar.noEventsThisMonth')}
                  </p>
                ) : (
                  allMonthEvents.map((event) => {
                    const config = eventTypeConfig[event.type];
                    const Icon = config.icon;
                    return (
                      <div key={event.id} className="flex items-center gap-4 py-3">
                        <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${config.bgColor}`}>
                          <Icon className={`h-5 w-5 ${config.textColor}`} />
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{event.title}</p>
                          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {event.date} {event.time && `- ${event.time}`}
                            {event.courseName && ` - ${event.courseName}`}
                          </p>
                        </div>
                        <span className={`rounded-lg px-2 py-1 text-xs font-medium ${config.bgColor} ${config.textColor}`}>
                          {config.label}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Selected Day Events */}
          <div className={`rounded-2xl border p-5 shadow-sm ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
            <div className="flex items-center justify-between">
              <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {selectedDate
                  ? `${t('calendar.eventsOnDay')} ${new Date(selectedDate + 'T00:00:00').getDate()}`
                  : t('calendar.selectDay')}
              </h3>
              <button className="rounded-lg p-1.5 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-3 space-y-2">
              {selectedDayEvents.length === 0 ? (
                <p className={`py-4 text-center text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  {selectedDate ? t('calendar.noEvents') : t('calendar.clickOnDay')}
                </p>
              ) : (
                selectedDayEvents.map((event) => {
                  const config = eventTypeConfig[event.type];
                  const Icon = config.icon;
                  return (
                    <div key={event.id} className={`rounded-xl ${config.bgColor} p-3`}>
                      <div className="flex items-start gap-2">
                        <Icon className={`mt-0.5 h-4 w-4 ${config.textColor}`} />
                        <div>
                          <p className={`text-sm font-medium ${config.textColor}`}>{event.title}</p>
                          {event.time && (
                            <p className="mt-0.5 flex items-center gap-1 text-xs opacity-70">
                              <Clock className="h-3 w-3" /> {event.time}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Legend */}
          <div className={`rounded-2xl border p-5 shadow-sm ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
            <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('calendar.legend')}</h3>
            <div className="mt-3 space-y-2">
              {Object.entries(eventTypeConfig).map(([key, config]) => {
                const Icon = config.icon;
                return (
                  <div key={key} className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${config.color}`} />
                    <Icon className={`h-4 w-4 ${config.textColor}`} />
                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{config.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
