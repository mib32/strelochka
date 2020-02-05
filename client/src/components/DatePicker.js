import React from 'react';
import ReactDatePicker, { registerLocale } from 'react-datepicker';
import { addDays } from '../utils/time'
import ru from 'date-fns/locale/ru';
// import "react-datepicker/dist/react-datepicker.css";

registerLocale('ru', ru)

function DatePicker(props) {
  return(<ReactDatePicker
    selected={props.startDate}
    startDate={props.startDate}
    endDate={props.endDate}
    inline
    locale='ru'
    selectsStart={false}
    selectsEnd={props.focusedInput === 'endDate'}
    onChange={props.handleDatesChange}
    monthsShown={2}
    minDate={new Date()}
    maxDate={addDays(new Date(), 119)}
    inlineFocusSelectedMonth
    onClickOutside={props.handleClickOutside}
    onMonthMouseLeave={() => {}}
    onDayMouseEnter={() => {}}
  />)
}

export default React.memo(DatePicker)
