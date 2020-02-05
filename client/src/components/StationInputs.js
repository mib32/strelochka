import React, { useCallback, useMemo } from 'react';
import Autocomplete from './Autocomplete';
import { Button } from '@material-ui/core';

const fromDefaults = [
  {name: 'Москва', code: 2000000},
  {name: 'Санкт-Петербург', code: 2004000},
  {name: 'Волгоград', code: 2020500},
  {name: 'Нижний Новгород', code: 2060001},
  {name: 'Астрахань', code: 2020600},
  {name: 'Самара', code: 2024000},
  {name: 'Сочи', code: 2064130},
  {name: 'Мурманск', code: 2004200},
  {name: 'Екатеринбург', code: 2030000}
]

const toDefaults = [
  {name: 'Санкт-Петербург', code: 2004000},
  {name: 'Москва', code: 2000000},
  {name: 'Нижний Новгород', code: 2060001},
  {name: 'Казань', code: 2060615},
  {name: 'Волгоград', code: 2020500},
  {name: 'Калининград', code: 2058000},
  {name: 'Самара', code: 2024000},
  {name: 'Нестеров', code: 2058434},
  {name: 'Хабаровск', code: 2034000},
  {name: 'Сочи', code: 2064130},
]

function StationInputs(props) {
  const { onFromStationChange, onToStationChange, onFlipClick, toStation, fromStation } = props
  const handleReverseClick = useCallback((e) => {
    setTimeout(() => {
      onFlipClick(fromStation, toStation)
    }, 0)

    e.preventDefault()
  }, [onFlipClick, fromStation, toStation])

  const mobile = window.innerWidth < 800

  const flipButton = useMemo(() =>
    <Button tabIndex={3} color="primary" size="small" className="FlipButton" onClick={handleReverseClick}>поменять местами ↕</Button>
  , [handleReverseClick])

  return(
    <div id="StationInputs">
      <Autocomplete
        autoFocus={!mobile && !(fromStation.text || props.sPage)}
        codeError={props.fromCodeError}
        onChange={onFromStationChange}
        placeholder={'Станция отправления'}
        tabIndex={1}
        value={fromStation.text}
        code={fromStation.code}
        default={fromDefaults}
        error={props.errors.fromError}
      />
      {flipButton}
      <Autocomplete
        codeError={props.toCodeError}
        onChange={onToStationChange}
        placeholder={'Станция прибытия'}
        value={toStation.text}
        code={toStation.code}
        tabIndex={2}
        default={toDefaults}
        error={props.errors.toError}
      />
  </div>
  )
}

// StationInputs.whyDidYouRender = true
// export default StationInputs
export default React.memo(StationInputs)
