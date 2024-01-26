import moment from 'moment';


export function getMinDate() {
  console.log(123)
  const currentDate = moment();
  let minDate = currentDate.subtract(3, 'months');
  minDate = minDate.toDate();
  console.log('minDate', minDate);
  return minDate;
}

export function getMaxDate() {
  console.log(23)
  const currentDate = moment();
  let maxDate = currentDate.add(1, 'year');
  maxDate = maxDate.toDate();
  console.log('maxDate', maxDate)
  return maxDate;
}