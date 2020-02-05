import React from 'react'
import { API_BASE } from '../consts';
import Button from '@material-ui/core/Button';


export default function RestartNotice(props) {
  const [available, setAvailable] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    fetch(`${API_BASE}/restart`, {
      headers: {
        'Content-Type': 'application/json'
      }}).then((res) => res.json()).then(res => {
      if (res.available) {
        setAvailable(true)
      }
    })
  }, [])

  function handleRestartClick() {
    setLoading(true)
    fetch(`${API_BASE}/restart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }}).then(() => {
        setLoading(false)
        alert('Сервер перезагружается. Время перезагрузки - приблизительно 30 секунд. Нажмите ОК чтобы перезагрузить страницу  и продолжить.')
        window.location.reload()
      })
  }
  return(
    <React.Fragment>
      { available && <React.Fragment>
        <p>Если ошибок слишком много, попробуйте перезагрузить сервер:</p>
        <p><Button disabled={loading} onClick={handleRestartClick} variant="contained" size="small">{loading ? "..." : "Перезагрузить сервер"}</Button></p>
      </React.Fragment>}
    </React.Fragment>
  )
}
