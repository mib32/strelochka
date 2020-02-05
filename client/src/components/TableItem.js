import React, { useMemo } from 'react';
import { format } from 'date-fns';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import PriceTag from './PriceTag'

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
  input: {
    display: 'none',
  },
}));

function handleRzdClick() {
  window.ga('send', 'event', 'Strelochka', 'BuyClick', 'Buy Clicked', 0)
}

function TableItem(props) {
  const {item} = props
  const {ticketLink, date, humanDate} = item
  const classes = useStyles();
  // console.log('TableItem')
  const buyButton = useMemo(() => {
    return <Button variant="contained" target="_blank" onClick={handleRzdClick} href={ticketLink} className={classes.button} color="secondary">
      Купить
    </Button>
  }, [ticketLink, classes.button])

  return(item.result === 'error' ?
    <tr className="itemTr errorTr">
      <td>{humanDate}</td>
      <td colSpan={props.colSpan}>
        { item.errorType === 'our' ?
          `Извините, произошла ошибка соединения. Пожалуйста перезагрузите страницу и попробуйте еще раз${item.transferRoutes ? ' или отключите Маршрут с пересадкой' : ''}.`
          :
          `Извините, произошла ошибка на стороне РЖД. Пожалуйста попробуйте еще раз${item.transferRoutes ? ' или отключите Маршрут с пересадкой' : ''}.`
        }
      </td>
    </tr>
      :
      (item.noTickets ?
        <tr className="itemTr">
          <td>{humanDate}</td>
          <td colSpan={props.colSpan}>
            {item.msg}
          </td>
        </tr>
        :
        <tr className="itemTr">
          <td><span style={{fontSize: '30%'}}></span><a target="_blank" rel="noopener noreferrer" onClick={handleRzdClick} href={ticketLink}>{humanDate}</a></td>
          {props.columns.map((carType, j) =>
            <PriceTag
              key={`${props.i}${j}`}
              carType={carType}
              item={item[carType]}
              onClick={props.onPriceTagClick}
            />)}
          <td className="BuyButtonContainer">
            {buyButton}
          </td>
        </tr>
      )
    )
}
function areEqual(prevProps, nextProps) {
  return prevProps.item === nextProps.item
}
export default React.memo(TableItem)
