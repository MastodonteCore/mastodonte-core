module.exports = function(date = null) {
  const d = new Date(date),
        prevMonth = (d.getMonth() + 1).toString(),
        prevDay = d.getDay().toString(),
        year = d.getFullYear(),
        month = `${prevMonth.length < 2 ? '0' : ''}${prevMonth}`,
        day = `${prevDay.length < 2 ? '0' : ''}${prevDay}`;

  return [year, month, day].join('-')
}