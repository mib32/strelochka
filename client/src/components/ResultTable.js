import React, { useState, useEffect, useMemo, useCallback } from 'react';
import TableItem from './TableItem';
import PriceTag from './PriceTag'
import RestartNotice from './RestartNotice'
import TableAdBlock from './TableAdBlock'
import {LinearProgress} from '@material-ui/core';
import { diffInDays } from '../utils/time'
import { pluralize } from '../utils/lang'
import { Tooltip, Popover } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const LightTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}))(Tooltip);

function ResultTable(props) {
  const [adRendered, setAdRendered] = useState(false)
  const [detailsPopoverAnchor, setDetailsPopoverAnchor] = useState(null)
  const [detailsPopoverContent, setDetailsPopoverContent] = useState(null)

  const datesCount = (props.loading && props.dates.endDate ? diffInDays(props.dates.endDate, props.dates.startDate) + 1 : "1")
  const { items, columns, loading, lowestPrice, highestPrice } = props;

  const hasError = items.find((item) => item.result === 'error')


  const handlePriceTagClick = useCallback((e, number, time0, timeInWay, freeSeats) => {
    setDetailsPopoverContent(<div className="DetailsPopover">№ {number} Отпр: {time0} В пути: {timeInWay}{freeSeats ? ` Мест: ${freeSeats}` : ''}</div>)
    setDetailsPopoverAnchor(e.target)
  }, [])


  const handlePopoverClose = useCallback((e) => setDetailsPopoverAnchor(null), [])

  useEffect(() => {
    const yaScript = document.createElement('script')
    yaScript.setAttribute('type', 'text/javascript')
    yaScript.innerHTML = `(function(w, d, n, s, t) {
        w[n] = w[n] || [];
        w[n].push(function() {
            window.Ya.Context.AdvManager.render({
                blockId: "R-A-395183-6",
                renderTo: "yandex_rtb_R-A-395183-6",
                async: true
            });
            window.Ya.Context.AdvManager.render({
                blockId: "R-A-395183-14",
                renderTo: "yandex_rtb_R-A-395183-14",
                async: true
            });
        });
        t = d.getElementsByTagName("script")[0];
        s = d.createElement("script");
        s.type = "text/javascript";
        s.src = "//an.yandex.ru/system/context.js";
        s.async = true;
        t.parentNode.insertBefore(s, t);
    })(this, this.document, "yandexContextAsyncCallbacks");`
    document.head.appendChild(yaScript)
  }, [])

  useEffect(() => {
    if (props.loading) {
      if (window.innerWidth <= 800) setTimeout(() => document.querySelector('#minSeatsHeader') && document.querySelector('#minSeatsHeader').scrollIntoView({behavior: 'smooth', block: 'start'}), 400)
      else setTimeout(() => document.getElementById('goButton') && document.getElementById('goButton').scrollIntoView({behavior: 'smooth', block: 'start'}), 400)
    }
  }, [props.loading])



  function toggleSort(type) {
    let newSortDir = 'd'
    if (type === props.sort) {
      newSortDir = props.sortDir === 'd' ? 'u' : 'd'
    }
    props.onSortChange(type)
    props.onSortDirChange(newSortDir)
  }

  function jsonLDSchema(lowestPrice, highestPrice) {
    return(`{
              "@context": "http://schema.org/",
              "@type": "Product",
              "name": "Билеты на поезд ${props.match.params.from} — ${props.match.params.to}",
              "offers": {
                  "@type": "AggregateOffer",
                  "lowPrice": "${lowestPrice}",
                  "highPrice": "${highestPrice}",
                  "priceCurrency": "RUB"}
              }`)
  }

  function translate(carType) {
    const translations = {
      "Сид": "Сидячий",
      "Мягкий": "Люкс",
      "Люкс": "СВ"
    }

    return(translations[carType] || carType)
  }

  let tableClassName = "table"
  if (props.columns.includes('Микс')) tableClassName += " tableTransferRoutes"
  const colspan = columns.length + 2
  let adIndex = 0
  return <React.Fragment>
    {props.match.params.from && <script type="application/ld+json" dangerouslySetInnerHTML={{__html: jsonLDSchema(lowestPrice, highestPrice)}}></script>}
    <div className="tableDiv">
      <table className={tableClassName} style={{marginTop: '20px'}}>
        <thead>
          <tr style={{marginBottom: 6}}>
            <th
              style={{cursor: 'pointer', paddingBottom: 8}}
              onClick={() => toggleSort('date')}
            >
              Дата
              { props.sort === 'date' ? (props.sortDir === 'd' ? '↓' : '↑') : '↕' }
            </th>
            {props.columns && props.columns.map((carType, i) =>
              <th
                style={{cursor: 'pointer'}}
                onClick={() => toggleSort(carType)}
                key={i}
                >
                {translate(carType)}
                { props.sort === carType ? (props.sortDir === 'd' ? '↓' : '↑') : '↕' }
              </th>
            )}
            <th className="buyButtonTh"></th>
          </tr>
        </thead>
        <tbody>
          {hasError && <tr className="errorTr">
            <td colSpan={colspan}>
              <div className="has-error">
                <p>Обратите внимание: Как минимум в одном из результатов произошла ошибка!</p>
                <RestartNotice />
                <p>Пожалуйста, воспользуйтесь формой обратной связи если ошибку не получается устранить.</p>
              </div>
            </td>
          </tr>
          }
          { props.loading && <tr className="loadingTr">
            <td colSpan={colspan}>
              <div className="loadingTagContainer">
                <span className="loadingTag">Осталось: {datesCount - items.length} из {datesCount} {pluralize(datesCount, "даты", "дат", "дат")}</span>
                <LinearProgress />
              </div>
            </td>
          </tr>}
          {items.map((item, i) =>
              [(i === 4 || (i > 0 && i % 15 === 0)) && <TableAdBlock adIndex={adIndex++} colSpan={colspan} key={i + "_ad"} />,
              <TableItem
                key={i}
                i={i}
                colSpan={colspan - 1}
                item={item}
                onPriceTagClick={handlePriceTagClick}
                columns={columns}
              >
            </TableItem>]
            )}
        </tbody>
      </table>
    </div>
    <Popover
      open={Boolean(detailsPopoverAnchor)}
      anchorEl={detailsPopoverAnchor}
      onClose={handlePopoverClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      >
      {detailsPopoverContent}
    </Popover>
  </React.Fragment>
}
// function areEqual(prevProps, nextProps) {
//   if (nextProps.items !== prevProps.items ||
//     nextProps.loading !== props.loading ||
//     nextState.sort !== sort || nextState.sortDir !== sortDir ||
//     nextState.adRendered !== this.state.adRendered
//   ) {
//     return true
//   } else {
//     return false
//   }
// }
export default React.memo(ResultTable);
