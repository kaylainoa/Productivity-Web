// src/pages/CalendarPage.js
import React from 'react';
import { useTasks } from '../contexts/TaskProvider';
import '../styles/Calendar.css';

function CalendarPage() {
  const { tasks } = useTasks();
  
  // In a real app, you would integrate with Google Calendar API
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  // Get previous month's trailing days
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
  const prevMonthDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    prevMonthDays.push(daysInPrevMonth - firstDayOfMonth + i + 1);
  }
  
  // Get next month's leading days
  const totalCells = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;
  const nextMonthDays = [];
  for (let i = 1; i <= totalCells - (firstDayOfMonth + daysInMonth); i++) {
    nextMonthDays.push(i);
  }
  
  // Current month's days
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
  // Get month name
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  return (
    <div className="calendar-container">
      <h1 className="calendar-heading">Calendar</h1>
      
      <div className="calendar-card">
        <div className="calendar-header">
          <h2 className="calendar-month-title">{monthName} {currentYear}</h2>
        </div>
        
        <div className="calendar-grid">
          <div className="calendar-weekdays">
            <div className="calendar-weekday">Sun</div>
            <div className="calendar-weekday">Mon</div>
            <div className="calendar-weekday">Tue</div>
            <div className="calendar-weekday">Wed</div>
            <div className="calendar-weekday">Thu</div>
            <div className="calendar-weekday">Fri</div>
            <div className="calendar-weekday">Sat</div>
          </div>
          
          <div className="calendar-days">
            {/* Previous month days */}
            {prevMonthDays.map((day, index) => (
              <div key={`prev-${index}`} className="calendar-day calendar-day-inactive">
                {day}
              </div>
            ))}
            
            {/* Current month days */}
            {monthDays.map(day => {
              const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
              const dayTasks = tasks.filter(task => task.dueDate === dateStr);
              const isToday = day === currentDate.getDate();
              
              return (
                <div 
                  key={`day-${day}`} 
                  className={`calendar-day ${isToday ? 'calendar-day-today' : ''}`}
                >
                  <div className="calendar-day-number">{day}</div>
                  
                  {dayTasks.length > 0 && (
                    <div className="calendar-day-tasks">
                      {dayTasks.map(task => (
                        <div 
                          key={task.id} 
                          className={`calendar-task calendar-task-urgency-${task.urgency} ${task.completed ? 'calendar-task-completed' : ''}`}
                        >
                          {task.title}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            
            {/* Next month days */}
            {nextMonthDays.map((day, index) => (
              <div key={`next-${index}`} className="calendar-day calendar-day-inactive">
                {day}
              </div>
            ))}
          </div>
        </div>
        
        <div className="calendar-integration">
          <h3 className="calendar-integration-title">Calendar Integration</h3>
          <button className="calendar-connect-button">
            Connect Google Calendar
          </button>
          <p className="calendar-integration-help">
            Connect your Google Calendar to sync tasks and events
          </p>
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;