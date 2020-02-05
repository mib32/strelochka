export const HHMMtoMins = function(hhmm) {
  let [h, m] = hhmm.split(':').map((v) => parseInt(v))
  return h * 60 + m
}

export const MinstoHHMM = function(minutes) {
  return [Math.floor(minutes/60), minutes % 60].map(v => v.toString().padStart(2, "0")).join(':')
}

export const diffInDays = function(date1, date2) {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays
}

export const addDays = function(date, days) {
  var result = new Date(date);
  result.setDate(date.getDate() + days)
  return result
}

export const lastDayOfMonth = function(date) {
  return new Date(date.getFullYear(), date.getMonth()+1, 0);
}

export const firstDayNextMonth = function(date) {
  return new Date(date.getFullYear(), date.getMonth()+1, 1);
}

export const dateToISO = function(date) {
  var mm = date.getMonth() + 1; // getMonth() is zero-based
  var dd = date.getDate();
  return [date.getFullYear(),
          (mm>9 ? '' : '0') + mm,
          (dd>9 ? '' : '0') + dd
        ].join('-');
}

export const dateFromRussian = function(string) {
  let [d, m, y] = string.split('.').map(s => parseInt(s))
  return new Date(y, m-1, d)
}
