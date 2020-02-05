import React, { useState, useCallback } from 'react';
import Filters from './Filters';
import {Popover, Button} from '@material-ui/core';

function FiltersWrapper(props) {
  const [helpPopoverAnchor, setHelpPopoverAnchor] = useState(null)

  const handlePopoverClick = useCallback((e) => {
    setHelpPopoverAnchor(e.currentTarget)
  })

  const handlePopoverClose = useCallback((e) => {
    setHelpPopoverAnchor(e.null)
  })

  return <React.Fragment>
    <Filters
      {...props}
      handlePopoverClick={handlePopoverClick}
    />
    <Popover
      open={Boolean(helpPopoverAnchor)}
      anchorEl={helpPopoverAnchor}
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
      <ul className="popoverHelp" style={{padding: 30, maxWidth: '68vw'}}>
        <li> • Для сортировки таблицы кликните на название столбца</li>
        <li> • Клик по дате или кнопке купить перенаправляет на сайт РЖД для покупки</li>
        <li> • Над ценой написано время отправление и номер поезда</li>
        <li> • Воспользуйтесь фильтрами чтобы уточнить результаты</li>
        <li> • Кликните по цене для деталей о поезде</li>
      </ul>
    </Popover>
  </React.Fragment>
}

export default React.memo(FiltersWrapper);
