import React, { useCallback } from 'react'
import Grid from '@material-ui/core/Grid';
import Slider from './Slider';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    width: 300,
  },
});

function TimeFilter(props) {
  const classes = useStyles();
  const value = props.value

  // const step = 15;
  //
  // const marks = [...Array(1440 / step).keys()].map((minute) => {
  //   var minute = minute * step
  //   if (minute % step == 0) {
  //     return {value: minute, label: `${Math.floor(minute/60)}:${minute%60}`}
  //   }
  // })

  return <div className={classes.root}>
    <Grid container spacing={2}>
        <Grid item>
          <MinutesHours value={value[0]}/>
        </Grid>
        <Grid item xs>
          <Slider
            value={value}
            onChange={props.onChange}
            name={props.name}
            onChangeActive={props.onChangeActive}
            valueLabelDisplay="off"
            aria-labelledby="range-slider"
            max={props.max || 1440}
            min={props.min || 0}
            marks={props.marks}
            step={props.step}
            getAriaValueText={(v) => {return `${Math.floor(v/60)}:${v%60}`}}
          />
        </Grid>
        <Grid item>
          <MinutesHours value={value[1]}/>
        </Grid>
      </Grid>
  </div>
}

function MinutesHours(props) {
  var h = Math.floor(props.value / 60);
  var m = props.value % 60;
  h = h < 10 ? '0' + h : h;
  m = m < 10 ? '0' + m : m;
  return(<span style={{width: 50, display: 'inline-block'}}>
    {h}:{m}
  </span>)
}
// TimeFilter.whyDidYouRender = true
// export default TimeFilter
export default React.memo(TimeFilter)
