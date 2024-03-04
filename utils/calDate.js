import moment from 'moment';


export function getMinDate() {
  const currentDate = moment();
  let minDate = currentDate.subtract(2, 'months');
  minDate = minDate.toDate();
  return minDate;
}

export function getMaxDate() {
  const currentDate = moment();
  let maxDate = currentDate.add(1, 'year');
  maxDate = maxDate.toDate();
  return maxDate;
}