/* eslint no-restricted-globals: 0 */
export default function paintHeatmap(_tableData) {
  const heatMapScale = 256
  _tableData.items.map(tableItem => {
    // add heatmap info
    self.carTypes.forEach(carType => {
      const item = tableItem[carType]

      if (item) {
        const lowestPrice = _tableData.lowestPrices[carType]
        const highestPrice = _tableData.highestPrices[carType]
        const highestPriceToZero = highestPrice - lowestPrice
        const scaleFactor = highestPriceToZero === 0 ? 0 : 100 / highestPriceToZero

        const scaledValue = (item.tariff - lowestPrice) * scaleFactor

        const red = heatMapScale * (scaledValue / 100)
        item.backgroundColor = `rgba(${Math.round(red)},${Math.round(heatMapScale - red)},0,0.05)`
        item.lowestPrice = item.tariff === lowestPrice
      }
    })
  })
}
