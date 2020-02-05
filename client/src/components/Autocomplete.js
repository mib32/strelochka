import ReactAutocomplete from '../utils/ReactAutocomplete';
import React, { useState, useMemo } from 'react';
import { checkStatus, parseJSON } from '../utils/fetch.js';
import { API_BASE } from '../consts'
import { TextField, FormHelperText, FormControl, InputAdornment, IconButton } from '@material-ui/core';
import { ReactComponent as Remove } from '../images/remove.svg';

function sortSuggestions(suggestions) {
  return suggestions.sort((a, b) => {
    const ass    = a.ss ? 1 : 0
    const bss    = b.ss ? 1 : 0
    const sortDiff = b.sort + b.l - (a.sort + a.l)
    const lSort = b.l - a.l
    const ssSort = bss - ass
    const nameSort = a.name.localeCompare(b.name)
    if (sortDiff !== 0) return sortDiff
    else if (lSort !== 0) return lSort
    else if (ssSort !== 0) return ssSort
    else return nameSort
  })
}

function Autocomplete(props) {
  const [suggestions, setSuggestions] = useState(props.default)
  const [open, setOpen] = useState(props.autoFocus)

  const preparedItems = suggestions.filter(item => item.name.includes(props.value.toUpperCase())).slice(0, 12)

  const autocompleteStyles = () => {
    return {
      borderRadius: '3px',
      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
      background: 'rgba(255, 255, 255, 1)',
      padding: '2px 0',
      fontSize: '90%',
      position: 'absolute',
      overflow: 'auto',
      maxHeight: '50%', // TODO: don't cheat, let it flow to the bottom
      zIndex: 100,
    }
  }

  function handleChange(e) {
    setOpen(true)
    if (props.value.length < 2 && e.target.value.length >= 2) {
      fetchStationsSuggests(e.target.value)
    }

    if (e.target.value.length === 0) {
      setSuggestions(props.default)
    }

    props.onChange({text: e.target.value, code: null})
  }

  function fetchStationsSuggests(v) {
    window.fetch(`${API_BASE}/station_codes.json?q=` + encodeURIComponent(v.toUpperCase()))
      .then(checkStatus)
      .then(parseJSON)
      .then(response => setSuggestions(sortSuggestions(response)))
      .catch(() => {})
  }

  function onSelect(value, item) {
    setOpen(false)
    props.onChange({text: value.toUpperCase(), code: item.code})
  }

  function handleClearContentClick(event) {
    props.onChange({text: '', code: null})
  }

  function handleClearContentMouseDown(event) {
    event.preventDefault();
  }

  return(
    <React.Fragment>
      <ReactAutocomplete
        inputProps={{
          autoFocus: props.autoFocus,
          label: props.placeholder,
          onBlur: (e) => { setOpen(false) },
          onFocus: (e) => { setOpen(true) },
          variant: "outlined",
          color: "primary",
          size: "large",
          error: props.error,
          fullWidth: true,
          inputProps: {
            tabIndex: props.tabIndex,
          },
          InputProps: {
            endAdornment: (props.value.length > 0 &&
              <InputAdornment classes={{root: "stationAdornement"}} position="end">
                <IconButton
                  edge="end"
                  aria-label="clear input content"
                  onClick={handleClearContentClick}
                  onMouseDown={handleClearContentMouseDown}
                >
                  <Remove style={{fill: '#6f6f6f'}}/>
                </IconButton>
              </InputAdornment>
            ),
          }
        }}
        wrapperProps={{className: 'form-group', style: {width: '100%'}}}
        getItemValue={ (item) => item.name }
        onChange={handleChange}
        onSelect={onSelect}
        selectFirstOnBlur={!props.code}
        items={preparedItems}
        autofocus
        value={props.value}
        open={open}
        renderItem={(item, isHightlited) => {
          let className;
          className = 'autocomplete-item'
          if (isHightlited) {
            className += ' active'
          }
          return  <div key={preparedItems.indexOf(item)} className={className} style={{margin: '10px 0'}} >
            {item.name}
          </div>
        }}
        menuStyle={autocompleteStyles()}
        wrapperStyle={{
          display: 'inline-block',
          position: 'relative',
        }}
        renderMenu={(items, value, style) => {
          return <div style={{...autocompleteStyles(), 'minWidth': style.minWidth}} children={items}/>
        }}
        renderInput={props =>
          <FormControl
            error={props.error}
            fullWidth
            onMouseDown={(e) => { if (document.activeElement === e.target) {setOpen(!open)} }}
          >
            <TextField {...props} />
            { props.error && <FormHelperText id="component-error-text">Выберите станцию из списка</FormHelperText>}
          </FormControl>
        }
      />
    </React.Fragment>
  )
}

export default React.memo(Autocomplete)
