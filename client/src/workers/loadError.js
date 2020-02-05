/* eslint no-restricted-globals: 0 */
import { dateFromRussian } from '../utils/time'
import loadResults from './loadResults'

export default function loadError({date, our}) {
  const errorDate = date === 'bulk' ? new Date() : dateFromRussian(date)
  let errorResponse = {result: 'error', errorType: our ? 'our' : 'their', transferRoutes: self.transferRoutes, date: errorDate}
  loadResults({results: [errorResponse]})
}
