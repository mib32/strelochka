import {minBy, sum} from '../utils/math';
import {HHMMtoMins, MinstoHHMM} from '../utils/time';

// Filter by car filters
export function filterCars(journey, disabledSeats, minSeats) {
  journey.parts.forEach(part => {
    part.filteredCars = part.cars.filter(car =>
    ((disabledSeats && car.disabledPerson === true) ||
    (!disabledSeats && car.disabledPerson !== true)) && (
      !minSeats || car.freeSeats >= minSeats
    ))
  })
}

export function sapsanNotSapsan(journey, carType) {
  if (carType === 'Сапсан') {
    return journey.parts.every(part => part.brand === 'САПСАН')
  } else {
    return journey.parts.every(part => part.brand !== 'САПСАН')
  }
}

export function allCasesHaveType(journey, carType) {
  if (carType === 'Сапсан') {
    return true
  } else {
    return journey.parts.every(part =>
      part.filteredCars.some(car => car.type === carType)
    )
  }
}

export function allCasesHaveTickets(journey) {
  return journey.parts.every(part =>
    part.filteredCars.length > 0
  )
}

export function journeyForType(journey, carType) {
  let tariff, cars
  if (carType === 'Сапсан') {
    cars = journey.parts.map(part => minBy(part.filteredCars, 'tariff')).filter((part) => typeof part !== "undefined")
  } else {
    cars = journey.parts.map(part => minBy(part.filteredCars.filter(car => car.type === carType), 'tariff'))
  }
  if (cars.length === 0) {
    return null
  } else {
    const part = journey.parts[0]
    return {
      tariff: sum(cars.map((car) => car.tariff)),
      timeInWay: part.timeInWay,
      freeSeats: cars[0].freeSeats,
      time0: part.time0,
      number: part.number
    }
  }
}

export function journeyForMix(journey) {
  let cars = journey.parts.map(part => minBy(part.filteredCars, 'tariff')).filter((part) => typeof part !== "undefined")
  if (cars.length > 0)
    return {
      tariff: sum(cars.map((car) => car.tariff)),
      timeInWay: MinstoHHMM(journey["totalTravelTime"]),
      freeSeats: 0,
      time0: journey.parts[0].time0,
      number: journey.parts.map(train => train.number).join(' => '),
    }
  else
    return null
}

export function filterJourneys(journeys, departTime, arriveTime, durationFilter, disabledSeats, minSeats) {
  return journeys.filter(journey => {
    filterCars(journey, disabledSeats, minSeats)
    const departure = journey.parts[0].departureInt
    const arrival = journey.parts.slice(-1)[0].arrivalInt
    const duration = journey.totalTravelTime
      return(
        (!departTime || (departTime[0] <= departure && departure <= departTime[1])) &&
        (!arriveTime || (arriveTime[0] <= arrival && arrival <= arriveTime[1])) &&
        (!durationFilter || (durationFilter[0] <= duration && duration <= durationFilter[1]))
      )
    }
  )
}

export function journeysOf(strelochka) {
  if (strelochka.result === 'OK')
    return strelochka.tp[0].list
  else
    return []
}

export function registerCarType(carType, carTypes) {
  if (carTypes.indexOf(carType) === -1) carTypes.push(carType)
}
