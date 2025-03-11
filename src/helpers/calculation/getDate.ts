export const getWeekRange = () => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  const endDate = new Date(today);
  endDate.setDate(startDate.getDate() + 6);
  return {
    start: startDate.toLocaleDateString("en-CA"), // YYYY-MM-DD
    end: endDate.toLocaleDateString("en-CA"), // YYYY-MM-DD
  };
};

export const getMonthRange = () => {
  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
  const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return {
    monthStart: startDate.toLocaleDateString("en-CA"), // YYYY-MM-DD
    monthEnd: endDate.toLocaleDateString("en-CA"), // YYYY-MM-DD
  };
};

export const getYearRange = () => {
  const today = new Date();
  const startDate = new Date(today.getFullYear(), 0, 1);
  const endDate = new Date(today.getFullYear(), 11, 31);
  return {
    yearStart: startDate.toLocaleDateString("en-CA"), // YYYY-MM-DD
    yearEnd: endDate.toLocaleDateString("en-CA"), // YYYY-MM-DD
  };
};
