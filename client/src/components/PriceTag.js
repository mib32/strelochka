import React from 'react';

function PriceTag(props) {
  if (props.item) {
    const {tariff, number, time0, timeInWay, freeSeats, backgroundColor, lowestPrice} = props.item

    const tdStyle = {backgroundColor: backgroundColor}

    function handleClick(e) {
      props.onClick(e, number, time0, timeInWay, freeSeats)
    }

    return <td style={tdStyle}>
      <div onClick={handleClick} className="PriceTagContainer">
        <div className="journeyMetadata">{time0} {number}</div>
        <span>{tariff} р.</span>
        {lowestPrice && <span title="Самый дешевый билет" className="lowestPrice"> * </span>}
      </div>
    </td>
  }

  return <td></td>
}

export default PriceTag
