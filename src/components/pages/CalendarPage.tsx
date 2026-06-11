import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, Plus } from 'lucide-react';
import { calendarService } from '../../lib/supabase';
import { useApp } from '../../contexts/AppContext';
import type { CalendarEvent } from '../../types';

export default function CalendarPage() {
  const { t, theme, user } = useApp();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const isDark = theme === 'dark';

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    calendarService.getUserEvents(user.id, currentMonth.getFullYear(), currentMonth.getMonth()).then(({ data }) => {
      if (data) setEvents(data);
      setLoading(false);
    });
  }, [user, currentMonth]);

  const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayAdjust = firstDay === 0 ? 6 : firstDay - 1;

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1));

  const getEventsForDay = (day: number) => events.filter(e => {
    const d = new Date(e.date);
    return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
  });

  return (
    <div className={`p-4 md:p-6 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div className="mb-6">
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('nav.calendar')}</h1>
        <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('calendar.subtitle')}</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className={`h-8 w-8 animate-spin rounded-full border-2 border-t-transparent ${isDark ? 'border-slate-600' : 'border-slate-300'}`} />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className={`overflow-hidden rounded-2xl border lg:col-span-2 ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
            <div className={`flex items-center justify-between border-b px-6 py-4 ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
              <button onClick={prevMonth} className={`rounded-lg p-2 transition-colors ${isDark ? 'text-slate-400 hover:bg-slate-700 hover:text-slate-200' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}>
                <ChevronLeft className="h-5 w-5" />
              </button>
              <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{monthNames[month]} {year}</h2>
              <button onClick={nextMonth} className={`rounded-lg p-2 transition-colors ${isDark ? 'text-slate-400 hover:bg-slate-700 hover:text-slate-200' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}>
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <div className="mb-2 grid grid-cols-7">
                {dayNames.map(day => (
                  <div key={day} className="p-2 text-center text-xs font-medium text-slate-500">{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {Array.from({ length: firstDayAdjust }).map((_, idx) => (
                  <div key={`empty-${idx}`} className="p-2" />
                ))}
                {Array.from({ length: daysInMonth }).map((_, idx) => {
                  const dayEvents = getEventsForDay(idx + 1);
                  const isToday = idx + 1 === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
                  return (
                    <div key={idx} className={`group relative p-2 ${isToday ? 'rounded-lg bg-primary-50 dark:bg-primary-900/20' : ''}`}>
                      <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${isToday ? 'bg-primary-600 font-bold text-white' : isDark ? 'text-slate-300 group-hover:bg-slate-700' : 'text-slate-700 group-hover:bg-slate-100'}`}>
                        {idx + 1}
                      </span>
                      {dayEvents.length > 0 && (
                        <div className="mt-1 space-y-0.5">
                          {dayEvents.slice(0, 2).map(evt => (
                            <div key={evt.id} className={`h-1.5 w-full rounded-full ${evt.type === 'exam' ? 'bg-danger-500' : evt.type === 'deadline' ? 'bg-warning-500' : 'bg-primary-500'}`} />
                          ))}
                          {dayEvents.length > 2 && <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>+{dayEvents.length - 2}</span>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {events.length > 0 ? (
            <div className={`rounded-2xl border ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
              <div className={`border-b px-5 py-4 ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('dashboard.upcomingEvents')}</h3>
              </div>
              <div className="max-h-[28rem] divide-y overflow-y-auto dark:divide-slate-700">
                  {events.slice(0, 10).map(evt => (
                          <div key={evt.id} className={`p-4 transition-colors ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-50'}`}>
                            <div className="flex items-start gap-3">
                              <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${evt.type === 'exam' ? 'bg-danger-50 text-danger-600 dark:bg-danger-900/30 dark:text-danger-400' : 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'}`}>
                                <Calendar className="h-5 w-5" />
                              </div>
                              <div className="flex-1">
                                <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{evt.title}</p>
                                <div className="mt-1 flex items-center gap-3">
                                  <span className={`flex items-center gap-1 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                    <Clock className="h-3 w-3" /> {evt.time || evt.date}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
              </div>
            </div>
          ) : (
            <div className={`flex flex-col items-center justify-center rounded-2xl border p-6 ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
              <Calendar className={`h-12 w-12 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
              <h3 className={`mt-4 text-base font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('calendar.noEvents')}</h3>
              <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('calendar.clickOnDay')}</p>
              <button className="mt-4 flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
                <Plus className="h-4 w-4" /> {t('calendar.legend')}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
