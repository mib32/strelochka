export default function validate(fromStation, toStation, dates){
  let errors = {}

  if (fromStation.text.length === 0 || fromStation.code === null) {
    errors.fromError = true
  }

  if (toStation.text.length === 0 || toStation.code === null) {
    errors.toError = true
  }

  if (!dates.startDate) {
    errors.dateError = true
  }

  if (dates.startDate && dates.endDate && dates.startDate.getTime() > dates.endDate.getTime()) {
    errors.dateInverseError = true
  }

  return errors
}
