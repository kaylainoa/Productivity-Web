// src/utils/dateUtils.js

// Format date to YYYY-MM-DD
export const formatDateForInput = (date) => {
    return date.toISOString().split('T')[0];
  };
  
  // Get today's date in YYYY-MM-DD format
  export const getToday = () => {
    return formatDateForInput(new Date());
  };
  
  // Format date for display
  export const formatDateForDisplay = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Check if a date is today
  export const isToday = (dateString) => {
    const today = getToday();
    return dateString === today;
  };
  
  // Check if a date is in the future
  export const isFutureDate = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(dateString);
    return date > today;
  };
  
  // Check if a date is within the next 7 days
  export const isWithinNextWeek = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    nextWeek.setHours(0, 0, 0, 0);
    
    const date = new Date(dateString);
    return date > today && date <= nextWeek;
  };
  
  // Get month details for calendar
  export const getMonthDetails = (month, year) => {
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    return {
      firstDayOfMonth,
      daysInMonth,
      daysInPrevMonth,
      monthName: new Date(year, month).toLocaleString('default', { month: 'long' })
    };
  };