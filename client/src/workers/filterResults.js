/* eslint no-restricted-globals: 0 */
import {
    sapsanNotSapsan,
    allCasesHaveType,
    allCasesHaveTickets,
    journeyForType,
    journeyForMix,
    filterJourneys,
    journeysOf,
    registerCarType
  } from '../utils/strelochka_functions'
import { minBy, max, min } from '../utils/math';
import sortItems from './sortItems'

export default function filterResults(filters) {
  let results = self.results;
  const {
    departTime,
    arriveTime,
    durationFilter,
    disabledSeats,
    minSeats,
    sort,
    sortDir
  } = filters
  let carTypes = self.carTypes;
  let _results = {}

  let _tableItems = [], _highestPrices = {}, _lowestPrices = {}

  if (results && results.length > 0) {
    // Parse and filter results
    results.forEach(strelochka => {
      if (strelochka.result === 'OK') {
        const allJourneys = journeysOf(strelochka)
        const availableJourneys = filterJourneys(allJourneys, departTime, arriveTime, durationFilter, disabledSeats, minSeats)
        let carTypeGroupedMinJourneys = {}

        carTypes.forEach(carType =>
          carTypeGroupedMinJourneys[carType] = minBy(availableJourneys
            .filter(journey => allCasesHaveTickets(journey))
            .filter(journey => sapsanNotSapsan(journey, carType))
            .filter(journey => allCasesHaveType(journey, carType))
            .map(journey => journeyForType(journey, carType))
            .filter(journey => journey !== null)
            , 'tariff')
          )

        if (self.transferRoutes) {
          const mixLowestPriceCars = minBy(availableJourneys
            .filter(journey => allCasesHaveTickets(journey))
            .map(journey => journeyForMix(journey))
            .filter(journey => journey !== null)
            , 'tariff'
          )
          carTypeGroupedMinJourneys["Микс"] = mixLowestPriceCars
        }
        carTypeGroupedMinJourneys["humanDate"] = strelochka.humanDate
        carTypeGroupedMinJourneys["ticketLink"] = strelochka.ticketLink
        carTypeGroupedMinJourneys["date"] = strelochka.date
        carTypeGroupedMinJourneys["noTickets"] = strelochka.noTickets
        carTypeGroupedMinJourneys["msg"] = strelochka.msg
        _tableItems.push(carTypeGroupedMinJourneys)
      } else {
        _tableItems.push(strelochka)
      }
    })

    carTypes.forEach(carType => {
      Object.keys(_tableItems).forEach(date => {
        if (_tableItems[date][carType]) {
          if (!_highestPrices[carType] || _tableItems[date][carType].tariff > _highestPrices[carType]) {
            _highestPrices[carType] = _tableItems[date][carType].tariff
          }

          if (!_lowestPrices[carType] || _tableItems[date][carType].tariff < _lowestPrices[carType]) {
            _lowestPrices[carType] = _tableItems[date][carType].tariff
          }
        }
      })
    })
    if (sort && sortDir && !(sort === self.sort && sortDir === self.sortDir)) {
      sortItems(_tableItems, sort, sortDir)
    }
  }

  _results.items = _tableItems
  _results.lowestPrice = min(Object.values(_lowestPrices))
  _results.highestPrice = max(Object.values(_highestPrices))
  _results.lowestPrices = _lowestPrices
  _results.highestPrices = _highestPrices
  return _results
}
