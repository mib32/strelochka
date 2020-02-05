import React from 'react';
import StationInputs from './StationInputs';
import {
  FormControlLabel,
  Switch,
  Grid,
  Button,
  CircularProgress
} from '@material-ui/core';
import DatePickerWrapper from './DatePickerWrapper';

function ControlFields(props){
  return(
    <React.Fragment>
      <StationInputs
        fromStation={props.fromStation}
        toStation={props.toStation}
        onFromStationChange={props.onFromStationChange}
        onToStationChange={props.onToStationChange}
        onFlipClick={props.onFlipClick}
        errors={props.errors}
        sPage={props.sPage}
      />
      <FormControlLabel
        control={
          <Switch color="primary" checked={props.transferRoutes} onChange={(e) => props.onTransferRoutesChange(e.target.checked)}  />
        }
        label="Маршрут с пересадкой"
      />
      <DatePickerWrapper
        dates={props.dates}
        onDatesChange={props.onDatesChange}
        errors={props.errors}
      />
    <Grid container style={{margin: '20px 0px'}} justify="center">
        <Grid item xs={12}>
          <Button disabled={props.loading} fullWidth variant="contained" color="primary" size="large" id="goButton" onClick={props.onSearch}>
            {props.loading ? <CircularProgress color="inherit" /> : "Найти"}
          </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

// ControlFields.whyDidYouRender = true
// export default ControlFields
export default React.memo(ControlFields)
