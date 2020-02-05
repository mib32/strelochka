import React, {useEffect, useMemo, useState, useCallback} from 'react'
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import Slider from './Slider';
import TimeFilter from './TimeFilter'

function Filters(props) {
  const {
    handleDurationChange,
    handleDisabledChange,
    disabledSeats,
    handleClearClick,
    minSeats,
    handleMinSeatsChange,
    handleDepartTimeChange,
    handleArriveTimeChange,
    activeSlider,
    handleActiveSliderChange,
    minDuration,
    maxDuration,
    handlePopoverClick
   } = props

  const disabledSeatsSwitch = useMemo(() => {
    return <Grid container alignItems="center" spacing={2}>
      <Grid item >
        <FormControlLabel
          control={
            <Switch color="primary" checked={disabledSeats} onChange={(e) => handleDisabledChange(e.target.checked)}  />
          }
          label="Места для инвалидов"
        />
      </Grid>
    </Grid>
  }, [disabledSeats, handleDisabledChange])

  const clearButton = useMemo(() => {
    return <Button color="primary" onClick={handleClearClick}>Очистить фильтры</Button>
  }, [handleClearClick])

  const helpButton = useMemo(() => {
    return <Button variant="outlined" onClick={handlePopoverClick}>
      Помощь
    </Button>
  }, [handleClearClick])

  const minSeatsSlider = useMemo(() => {
    return <Grid item sm={5}>
      <div className={activeSlider && activeSlider !== 'minSeats' ? 'sliderHiddenMobile' : ''}>
        <h5 className="searcher-heading-3" id="minSeatsHeader">Минимальное кол-во мест</h5>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <span style={{width: 15}}>{minSeats}</span>
          </Grid>
          <Grid item xs>
            <Slider
              value={minSeats}
              onChange={handleMinSeatsChange}
              onChangeActive={handleActiveSliderChange}
              name="minSeats"
              valueLabelDisplay="off"
              aria-labelledby="range-slider"
              max={10}
              min={1}
            />
          </Grid>
        </Grid>
      </div>
    </Grid>
  }, [minSeats, handleMinSeatsChange, activeSlider])

  const defaultDurationFilter = useMemo(() =>
  [minDuration || 0, maxDuration || 1440], [minDuration, maxDuration])
  const defaultTimeFilter = [0, 1440]

  return <React.Fragment>
    <h4 className="searcher-heading-2">Фильтры</h4>
    <Grid container spacing={2}>
      <Grid item sm={6}>
        <h5 className="searcher-heading-3">Отправление</h5>
        <TimeFilter onChangeActive={handleActiveSliderChange} name="depart" step={15} value={props.departTime || defaultTimeFilter} onChange={handleDepartTimeChange}/>
      </Grid>
      <Grid item sm={6}>
        <div className={activeSlider && activeSlider === 'depart' ? 'sliderHiddenMobile' : ''}>
          <h5 className="searcher-heading-3">Прибытие</h5>
          <TimeFilter onChangeActive={handleActiveSliderChange} name="arrive" step={15} value={props.arriveTime || defaultTimeFilter} onChange={handleArriveTimeChange}/>
        </div>
      </Grid>
    </Grid>
    <Grid container alignItems="center" spacing={2}>
      <Grid item sm={6}>
        <div className={activeSlider && ['depart', 'arrive'].includes(activeSlider) ? 'sliderHiddenMobile' : ''}>
          <h5 className="searcher-heading-3">Время в пути</h5>
          <TimeFilter
            value={props.durationFilter || defaultDurationFilter}
            onChangeActive={handleActiveSliderChange}
            name="duration"
            onChange={handleDurationChange}
            min={minDuration}
            max={maxDuration}
          />
        </div>
      </Grid>
      {minSeatsSlider}
    </Grid>
    <div className={activeSlider && ['depart', 'arrive', 'duration'].includes(activeSlider) ? 'sliderHiddenMobile' : ''}>
      {disabledSeatsSwitch}
      {clearButton}
      {helpButton}
    </div>
  </React.Fragment>
}

export default React.memo(Filters)
