/* eslint no-restricted-globals: 0 */
import sortItems from './sortItems'
import filterResults from './filterResults'
import { dateFromRussian, HHMMtoMins } from '../utils/time'
import { format } from 'date-fns'
import ruLocale from 'date-fns/locale/ru';
import {
    journeysOf,
    registerCarType
  } from '../utils/strelochka_functions'

const CarTypeSortingArr = [
  'Мягкий',
  'Люкс',
  'Купе',
  'Плац',
  'Общий',
  'Сид',
  'Сапсан',
  'Микс'
]

export default function loadResults({results}) {
  const strelochkas = results.flatMap(data => typeof(data) === "string" ? JSON.parse(data).map(data =>  JSON.parse(data)) : data)
  self.results = self.results.concat(strelochkas)

  strelochkas.forEach(strelochka => {
    if (strelochka.result === 'OK') {
      const item = strelochka.tp[0]
      strelochka.date = dateFromRussian(item.date)
      strelochka.ticketLink = `https://pass.rzd.ru/tickets/public/ru?STRUCTURE_ID=704&code0=${item.fromCode}&st0=${item.from}&checkSeats=1&dt0=${format(strelochka.date, 'dd.MM.yyyy')}&code1=${item.whereCode}&st1=${item.where}&tfl=3&md=${self.transferRoutes ? 1 : 0}&layer_name=e3-route`
      if (item.list.length === 0 && strelochka.tp[0].msgList[0]) { // strelochka.tp[0].msgList[0].type === 'TICKET_SEARCH_MESSAGE'
        strelochka.noTickets = true
        strelochka.msg = strelochka.tp[0].msgList[0].message
      }
    }
    strelochka.humanDate = format(strelochka.date, 'dd MMM', {locale: ruLocale})

    journeysOf(strelochka).forEach(journey => {
      // WARNING: all this things are very order-coupled
      if (!journey.cases) {
        journey.totalTravelTime = HHMMtoMins(journey.timeInWay)
      }

      // register durations
      self.durations.push(journey.totalTravelTime)

      journey.parts = journey.cases ? journey.cases.map(cas => cas[0]) : [journey]

      // register cars
      journey.parts.forEach(part => {
        if (part.brand === 'САПСАН') registerCarType('Сапсан', self.carTypes)
        else part.cars.forEach(car => registerCarType(car.type, self.carTypes))

        part.departureInt = HHMMtoMins(part.time0)
        part.arrivalInt = HHMMtoMins(part.time1)
      })
    })
  })
  if (self.transferRoutes) registerCarType("Микс", self.carTypes)
  self.carTypes.sort((a, b) => CarTypeSortingArr.indexOf(b) - CarTypeSortingArr.indexOf(a))

  const sortedDurations = self.durations.sort((a, b) => a - b )
  sortItems(self.results, self.sort, self.sortDir)
  self.minDuration = sortedDurations[0]
  self.maxDuration = sortedDurations.slice(-1)[0]

  const _results = filterResults({sort: self.sort, sortDir: self.sortDir})
  self.postMessage({
    type: 'data_loaded',
    carTypes: self.carTypes,
    durations: {min: self.minDuration, max: self.maxDuration},
    tableData: _results
  });
}
