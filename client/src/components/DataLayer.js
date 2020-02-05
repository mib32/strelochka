import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import ControlFields from './ControlFields';
import validate from '../utils/validate';
import queryString from 'query-string';
import { API_BASE } from '../consts';
import FiltersWrapper from './FiltersWrapper'
import ResultTable from './ResultTable'
// import {MockedAPIResultSpb31, MockedAPIResultSpb120} from '../utils/mocked_api'
import strelochkaWorker from '../workers/strelochka.worker';
import { addDays, diffInDays } from '../utils/time'
import { eachDayOfInterval, format } from 'date-fns'
import Grid from '@material-ui/core/Grid';

const worker = {current: new strelochkaWorker()}

export default function DataLayer(props) {
  const params = useMemo(() => queryString.parse(window.location.search), [])
  const [fromStation, setFromStation] = useState({text: params["from_string"] || '', code: params["from_code"]});
  const [toStation, setToStation] = useState({text: params["to_string"] || '', code: params["to_code"]});
  const [transferRoutes, setTransferRoutes] = useState(params["md"] === 'true');
  const [dates, setDates] = useState({startDate: params["from_date"] ? new Date(params["from_date"]) : null, endDate: params["to_date"] ? new Date(params["to_date"]) : null});
  const [departTime, setDepartTime] = useState(null)
  const [arriveTime, setArriveTime] = useState(null)
  const [disabledSeats, setDisabledSeats] = useState(false)
  const [durationFilter, setDurationFilter] = useState(null)
  const [minSeats, setMinSeats] = useState(1)
  const [displayedErrors, setShowErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [tableData, setTableData] = useState([])
  const [highestPrice, setHighestPrice] = useState(null)
  const [lowestPrice, setLowestPrice] = useState(null)
  const [sort, setSort] = useState('date')
  const [sortDir, setSortDir] = useState('d')
  const [carTypes, setCarTypes] = useState([])
  const [durations, setDurations] = useState({})
  const [showResults, setShowResults] = useState(false)
  const working = useRef([])
  const run = useRef(0)
  const pendingTableData = useRef([])
  const [activeSlider, setActiveSlider] = useState(null)
  const activeSliderRef = useRef(activeSlider)

  // useEffect(() => {
  //   worker.current.postMessage({type: 'load_results', args: [MockedAPIResultSpb120, transferRoutes]})
  //   setShowResults(true)
  // }, [])

  const errors = useMemo(() => validate(fromStation, toStation, dates), [fromStation, toStation, dates])

  const clearFilters = useCallback(() => {
    setDepartTime(null)
    setArriveTime(null)
    setDurationFilter(null)
    setDisabledSeats(false)
    setMinSeats(1)
    setSort('date')
    setSortDir('d')
  }, [])

  const onFinishRequest = useCallback((start, startDate, endDate, fromStation, toStation, transferRoutes) => {
    const finish = performance.now()
    setLoading(false)
    filterResults({})
    window.fetch(`${API_BASE}/strelochka`, {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        count: diffInDays(startDate, endDate) + 1,
        fromString: fromStation.text,
        toString: toStation.text,
        fromDate: format(startDate, 'dd.MM.yyyy'),
        toDate: format(endDate, 'dd.MM.yyyy'),
        timing: (finish - start) / 1000,
        md: transferRoutes,
      }),
      method: 'POST'
    });
  }, [])

  const search = useCallback((fromStation, toStation, dates, transferRoutes, options={bulk: false, sort: sort, sortDir: sortDir}) => {
    setTableData([])
    worker.current.postMessage({type: 'new_search', transferRoutes, sort: 'date', sortDir: 'd'})
    setTimeout(() => clearFilters(), 300)

    const startDate = dates.startDate
    const endDate = dates.endDate ? dates.endDate : startDate
    var datesParams
    if (options.bulk) {
      datesParams = ['bulk']
    } else {
      datesParams = eachDayOfInterval({start: startDate, end: endDate}).map(date => format(date, 'dd.MM.yyyy'))
    }

    const hashParams = {
      from_string: fromStation.text,
      from_code: fromStation.code,
      to_string: toStation.text,
      to_code: toStation.code,
      from_date: format(startDate, 'yyyy-MM-dd'),
      to_date: format(endDate, 'yyyy-MM-dd'),
      md: transferRoutes
    }

    if (!options.bulk) {
      setTimeout(() => props.history.push('/search?'+queryString.stringify(hashParams)), 800)
    }

    const params = {
      from_string: fromStation.text,
      from_code: fromStation.code,
      to_string: toStation.text,
      to_code: toStation.code,
      md: transferRoutes
    }

    setShowResults(true)
    setError(null)

    const start = performance.now()
    const step = transferRoutes ? 12 : 31
    setTimeout(processChunk(datesParams), 100)
    function processChunk(dates) {
      if (dates.length > 0) {
        const promises = dates.slice(0, step).map(date => {
          params.dates = date
          const request = window.fetch(`${API_BASE}/strelochka.json?` + queryString.stringify(params, {arrayFormat: 'bracket'}));
          return request
            .then((response) => {
              if (response.status > 300) {
                const error = new Error('Strelochka Error')
                if (response.status !== 400) {
                  error.our = true
                }
                throw error
              } else if (response.status === 200) {
                return response.text()
              }
            }).then((response) => {
              worker.current.postMessage({type: 'load_results', results: [response]})
            }).catch(error => {
              worker.current.postMessage({type: 'load_error', date: date, our: error.our})
            })
        })
        Promise.all(promises).then(() => processChunk(dates.splice(step)))
      } else {
        onFinishRequest(start, startDate, endDate, fromStation, toStation, transferRoutes)
      }
    }

    window.ga('send', 'event', 'Strelochka', 'Search', 'Tickets Search', 0)
  }, [props.history, clearFilters, onFinishRequest])

  useEffect(() => {
    // Refresh errors only if some errors disappeared
    if (Object.keys(displayedErrors).some(key => displayedErrors[key] && !errors[key] )) {
      setShowErrors(errors)
    }
  }, [errors, displayedErrors]);

  useEffect(() => {
    if (props.sPage) {
      window.fetch(`${API_BASE}/cities.json?cities[]=${props.match.params.from}&cities[]=${props.match.params.to}`)
        .then((response) => response.json())
        .then((cities) => {
          const _startDate = new Date()
          const _endDate = addDays(new Date(), 10)
          if (cities[0]) setFromStation({text: cities[0].caps_name, code: cities[0].code})
          if (cities[1]) setToStation({text: cities[1].caps_name, code: cities[1].code})
          setDates({startDate: _startDate, endDate: _endDate})
          if (cities[0] && cities[1]) {
            setLoading(true)
            search(
              {text: cities[0].caps_name, code: cities[0].code},
              {text: cities[1].caps_name, code: cities[1].code},
              {startDate: _startDate, endDate: _endDate},
              false,
              {bulk: true}
            )
          }
        })
    }
  }, []) // eslint-disable-next-line react-hooks/exhaustive-deps

  const handleSearchClick = useCallback((e) => {
    // setTimeout(() => setLoading(true), 200)
    setShowErrors(errors)
    if (Object.keys(errors).length > 0) {
      document.getElementById('StationInputs').scrollIntoView({behavior: "smooth"})
    } else {
      setLoading(true)
      setTimeout(() => {
        search(fromStation, toStation, dates, transferRoutes, {sort, sortDir})
      }, 200)
    }
  }, [errors, fromStation, toStation, dates, transferRoutes, search, sort, sortDir])

  const handleFilterEvent = useCallback((event) => {
    // console.log(event)
    if (event.data.type === 'data_loaded') {
      // console.log('data_loaded', event.data)
      setCarTypes(carTypes => {
        // TODO: But why should it be like this?
        if (event.data.carTypes.length === carTypes.length && carTypes.every((value, index) => value === event.data.carTypes[index])) return carTypes
        else return event.data.carTypes
      })
      setDurations(event.data.durations)
      setHighestPrice(event.data.tableData.highestPrice)
      setLowestPrice(event.data.tableData.lowestPrice)
      setTableData(tableData => {
        event.data.tableData.items.forEach((newItem, i) => {
          if (!tableData[i] || tableData[i].date.getTime() !== newItem.date.getTime()) {
            // console.log('install new Item', newItem)
            tableData[i] = newItem
          }
        })
        // console.log('after tD', tableData)
        return tableData.concat()
      })
    } else if (event.data.type === 'data_filtered') {
      const screenHeight = window.innerHeight
      const itemsCountToUpdate = Math.floor(screenHeight / 60)
      // console.log('data run: ', run.current)
      // const hostedRun = run.current
      setHighestPrice(event.data.tableData.highestPrice)
      setLowestPrice(event.data.tableData.lowestPrice)
      if (activeSliderRef.current) {
        setTableData(tableData => {
          tableData.splice(0, itemsCountToUpdate, ...event.data.tableData.items.slice(0, itemsCountToUpdate))
          // console.log('setTableData', tableData)
          // console.log('Chunk -> tabledata', tableData)
          return tableData.concat()
        })

        pendingTableData.current = event.data.tableData.items
      } else {
        setTableData(event.data.tableData.items)
      }

    if (working.current.length >= 2) {
      filterResults(working.current[0])
    }
    working.current = []
    run.current = run.current + 1
    }
  }, [activeSliderRef])

  useEffect(() => {
    worker.current.addEventListener('message', handleFilterEvent)
  }, [])

  function filterResults(filters) {
    worker.current.postMessage({type: 'filter_results', filters: filters})
  }

  useEffect(() => {
    // console.log('tracking:', durationFilter)
    const filters = {departTime, arriveTime, durationFilter, disabledSeats, minSeats, transferRoutes, sort, sortDir}
    if (working.current.length === 0) {
      filterResults(filters)
    }
    working.current.unshift(filters)
  }, [departTime, arriveTime, durationFilter, disabledSeats, minSeats, sort, sortDir]) // eslint-disable-line react-hooks/exhaustive-deps

  // console.log('tableData: ', tableData)
  // console.log('durations ', durations)
  // console.log(carTypes)

  const onSortChange = useCallback((v) => setSort(v), [])
  const onSortDirChange = useCallback((v) => setSortDir(v), [])
  const handleDurationChange = useCallback((e, v) => setDurationFilter(v), [])
  const handleDisabledChange = useCallback((v) => setDisabledSeats(v), [])
  const handleMinSeatsChange = useCallback((e, v) => setMinSeats(v), [])
  const handleArriveTimeChange = useCallback((e, v) => setArriveTime(v), [])
  const handleDepartTimeChange = useCallback((e, v) => setDepartTime(v), [])
  const handleActiveSliderChange = useCallback((v) => {
    setActiveSlider(v)
    activeSliderRef.current = v
    if (!v && pendingTableData.current.length > 0) {
      // console.log('slider -> setTableData')
      setTimeout(() => setTableData(tableData => pendingTableData.current), 0)
    }
  }, [])

  let resultsFragment
  if (showResults) {
    resultsFragment = <React.Fragment>
      <Grid item xs={12} md={8} lg={9} >
        <FiltersWrapper
          departTime={departTime}
          handleDepartTimeChange={handleDepartTimeChange}
          arriveTime={arriveTime}
          handleArriveTimeChange={handleArriveTimeChange}
          disabledSeats={disabledSeats}
          handleDisabledChange={handleDisabledChange}
          durationFilter={durationFilter}
          handleDurationChange={handleDurationChange}
          minSeats={minSeats}
          handleMinSeatsChange={handleMinSeatsChange}
          handleClearClick={clearFilters}
          activeSlider={activeSlider}
          handleActiveSliderChange={handleActiveSliderChange}
          minDuration={durations.min}
          maxDuration={durations.max}
        />
      </Grid>
      <Grid container justify="center" spacing={2}>
        <Grid item xs={12} md={8} lg={9} >
          <div className={`tableAndAdContainer ${activeSlider ? 'tableAndAdContainer-activeSlider' : ''}`} >
            <div className="topAdBlockContainer">
              <div className="topAdBlock" id="yandex_rtb_R-A-395183-14"></div>
            </div>
            <ResultTable
              items={tableData}
              loading={loading}
              dates={dates}
              match={props.match}
              lowestPrice={lowestPrice}
              highestPrice={highestPrice}
              columns={carTypes}
              error={error}
              sort={sort}
              sortDir={sortDir}
              onSortChange={onSortChange}
              onSortDirChange={onSortDirChange}
            />
            <div className="rightAdBlockContainer">
              <div className="rightAdBlock" id="yandex_rtb_R-A-395183-6"></div>
            </div>
          </div>
        </Grid>
      </Grid>
    </React.Fragment>
  }

  const onFromStationChange = useCallback((v) => { setFromStation(v) }, [])
  const onToStationChange = useCallback((v) => { setToStation(v) }, [])
  const onTransferRoutesChange = useCallback((v) => { setTransferRoutes(v)}, [])
  const onDatesChange = useCallback((v) => {
    setDates(dates => Object.assign({}, dates, v))
  }, [])
  const onFlipClick = useCallback((fromStation, toStation) => {
    setFromStation(toStation)
    setToStation(fromStation)
  }, [])

  return(<React.Fragment>
    <Grid item xs={12} md={7} lg={6} >
      <ControlFields
        fromStation={fromStation}
        toStation={toStation}
        onFromStationChange={onFromStationChange}
        onToStationChange={onToStationChange}
        onFlipClick={onFlipClick}
        transferRoutes={transferRoutes}
        onTransferRoutesChange={onTransferRoutesChange}
        dates={dates}
        onDatesChange={onDatesChange}
        errors={displayedErrors}
        onSearch={handleSearchClick}
        loading={loading}
        sPage={props.sPage}
      />
    </Grid>
  {resultsFragment}
  </React.Fragment>)
}
