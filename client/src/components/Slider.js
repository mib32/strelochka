import React, { useCallback } from 'react'
import MuiSlider from '@material-ui/core/Slider';

function Slider(props) {
  const handleChange = useCallback((e, v) => {
    props.onChangeActive(props.name)
    props.onChange(e, v)
  }, [props.name])

  const handleChangeCommited = useCallback((e, v) => {
    props.onChangeActive(null)
  }, [])

  return <MuiSlider
    {...props}
    onChange={handleChange}
    onChangeCommitted={handleChangeCommited}
  />
}
// Slider.whyDidYouRender = true
// export default Slider
export default React.memo(Slider)
