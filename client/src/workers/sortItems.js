/* eslint no-restricted-globals: 0 */
import { compareAsc, compareDesc, format } from 'date-fns'

export default function sortItems(items, sort, sortDir) {
  switch (sort) {
    case 'date':
      return items.sort( (item1,item2) => {

        return sortDir === 'd' ? compareAsc(item1.date, item2.date) : compareDesc(item1.date, item2.date);
      })
    default:
      return items.sort( (item1,item2) => {
        let aValue = item1[sort] ? item1[sort].tariff : 0
        let bValue = item2[sort] ? item2[sort].tariff : 0

        if (aValue === 0)
          return 1
        else if (bValue === 0)
          return -1

        if (sortDir === 'd')
          return aValue - bValue
        else
          return bValue - aValue
      })
  }
}
