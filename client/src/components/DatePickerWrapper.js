import React, { Component } from 'react';
import { Grid, Button, FormControl, FormHelperText, TextField } from '@material-ui/core';
import { addDays, lastDayOfMonth, firstDayNextMonth, dateToISO } from '../utils/time';
import DatePicker from './DatePicker';
import { Waypoint } from 'react-waypoint';

export default class DatePickerWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focusedInput: 'startDate',
      showCalendar: !(window.innerWidth <= 800)
    }

    this.handleClickOutside = this.handleClickOutside.bind(this)
    this.handleCalendarWaypointEnter = this.handleCalendarWaypointEnter.bind(this)
  }

  componentDidMount() {
  }

  shouldComponentUpdate(nextProps, nextState) {
    if ((nextProps.dates !== this.props.dates) ||
      (nextProps.errors !== this.props.errors) ||
      (nextProps.showCalendar !== this.props.showCalendar) ||
      nextState !== this.state
    ) {
      return true;
    } else {
      return false;
    }
  }

  handleCalendarWaypointEnter() {
    this.setState({showCalendar: true})
  }

  onFocusChange(focusedInput) {
    this.setState({
      // Force the focusedInput to always be truthy so that dates are always selectable
      focusedInput: !focusedInput ? 'startDate' : focusedInput,
    });
  }


  handleClickOutside(e) {
    if (this.state.focusedInput === 'endDate') {
      this.setState({focusedInput: 'startDate'})
    }
  }


  handleRangeSelect(period, e) {
    let start, end
    switch (period) {
      case '120':
          start = new Date()
          end = addDays(start, 119)
        break;
      case '90':
          start = new Date()
          end = addDays(start, 89)
        break;
      case '30':
          start = new Date()
          end = addDays(start, 29)
        break;
      case 'curMonth':
          start = new Date()
          end = lastDayOfMonth(start)
        break;
      case 'nextMonth':
          start = firstDayNextMonth(new Date())
          end = lastDayOfMonth(start)
        break;
      case 'clear':
          start = null
          end = null
        break;
      default:


    }
    this.setState({selectedPeriod: period}, () => {
      setTimeout(() => this.props.onDatesChange({startDate: start, endDate: end}), 0)
    })
    e.preventDefault()
  }

  handleDatesChange = (date) => {
    if (this.state.focusedInput === 'startDate') {
      this.props.onDatesChange({startDate: date, endDate: null})
      this.setState({focusedInput: 'endDate'})
    } else {
      if (date.getTime() < this.props.dates.startDate.getTime()) {
        this.props.onDatesChange({startDate: date})
      } else {
        this.props.onDatesChange({endDate: date})
        this.setState({focusedInput: 'startDate'})
      }
    }
  }

  render() {
    const { focusedInput } = this.state;
    const { startDate, endDate } = this.props.dates;
    return (
      <div className="">
        <h4 className="searcher-heading-2">Выберите диапазон дат</h4>
        <p style={{marginBottom: '10px'}}>Разом:&nbsp;
          <Button color="primary" size="small" variant={this.state.selectedPeriod === '120' ? 'text' : "outlined"} style={{margin: 2}} onClick={this.handleRangeSelect.bind(this, '120')}>120 дней</Button>
          <Button color="primary" size="small" variant={this.state.selectedPeriod === '90' ? 'text' : "outlined"} style={{margin: 2}} onClick={this.handleRangeSelect.bind(this, '90')}>90 дней</Button>
          <Button color="primary" size="small" variant={this.state.selectedPeriod === '30' ? 'text' : "outlined"} style={{margin: 2}} onClick={this.handleRangeSelect.bind(this, '30')}>30 дней</Button>
          <Button color="primary" size="small" variant={this.state.selectedPeriod === 'curMonth' ? 'text' : "outlined"} style={{margin: 2}} onClick={this.handleRangeSelect.bind(this, 'curMonth')}>текущий месяц</Button>
          <Button color="primary" size="small" variant={this.state.selectedPeriod === 'nextMonth' ? 'text' : "outlined"} style={{margin: 2}} onClick={this.handleRangeSelect.bind(this, 'nextMonth')}>следующий месяц</Button>
          <Button color="primary" size="small" variant="outlined" style={{margin: 2}} onClick={this.handleRangeSelect.bind(this, 'clear')}>очистить даты</Button>
        </p>
        <FormControl error={this.props.errors.dateError || this.props.errors.dateInverseError} style={{width: '100%'}} classes={{root: `${this.props.errors.dateError ? "has-error" : ""}`}}>
          <Grid container justify="center" spacing={2}>
            <Grid item xs={6} md={6}>
              <DatePickField label="С" value={startDate} dateKey="startDate" onDatesChange={this.props.onDatesChange} />
            </Grid>
            <Grid item xs={6} md={6}>
              <DatePickField label="По" value={endDate} dateKey="endDate" onDatesChange={this.props.onDatesChange} />
            </Grid>
          </Grid>
          <div id="DayPickerContainer">
            <Waypoint
              onEnter={this.handleCalendarWaypointEnter}
            />
            {this.state.showCalendar &&
              <DatePicker
                startDate={startDate}
                endDate={endDate}
                focusedInput={focusedInput}
                handleDatesChange={this.handleDatesChange}
                handleClickOutside={this.handleClickOutside}
              />
            }
          </div>
          { this.props.errors.dateError && <FormHelperText id="component-error-text">Выберите даты</FormHelperText>}
          { this.props.errors.dateInverseError && <FormHelperText id="component-error-text">Ошибка: Дата конца диапазона раньше даты начала</FormHelperText>}
        </FormControl>
      </div>
    );
  }
}

function DatePickField(props) {
  return(<TextField
    {...props}
    inputProps={{min: dateToISO(new Date()), max: dateToISO(addDays(new Date(), 119))}}
    variant="outlined"
    type="date"
    onChange={(e) => props.onDatesChange({[props.dateKey]: e.target.value ? new Date(e.target.value) : null})}
    fullWidth
    value={props.value ? dateToISO(props.value) : ''}
    InputLabelProps={{shrink: true}}/>)
}
