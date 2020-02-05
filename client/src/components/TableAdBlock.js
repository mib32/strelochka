import React, { useEffect } from 'react';
import { Hidden } from '@material-ui/core';

const ads = [
  "3",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12"
]

export default function TableAdBlock(props) {
  useEffect(() => {
    if (window.Ya) {
      window.Ya.Context.AdvManager.render({
        blockId: "R-A-395183-" + ads[props.adIndex],
        renderTo: "yandex_rtb_R-A-395183-" + ads[props.adIndex],
        async: true
      });
    }
  }, [])

  return(<tr className="adTr">
        <td colSpan={props.colSpan}>
          <div className="adTrContainer">
            <div id={"yandex_rtb_R-A-395183-" + ads[props.adIndex]}></div>
          </div>
      </td>
    </tr>)
}
