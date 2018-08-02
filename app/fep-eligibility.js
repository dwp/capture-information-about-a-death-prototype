var differenceInMonths = require('date-fns/difference_in_months')
// month, day, year
const validateFuneralDate = (year, month, day) => {
  const parsedMonth = parseInt(month) - 1;
  const parsedDay = parseInt(day);
  const date = new Date();
  const formattedDay = date.getDate() === parsedDay ? parsedDay + 1 : parsedDay; // This means if they claim on the 6th, it will class the 6 as the 5th month

  return differenceInMonths(date, new Date(year, parsedMonth, formattedDay));
}

module.exports = {
  validateFuneralDate
}