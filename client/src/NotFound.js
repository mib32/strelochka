import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class NotFound extends Component {
  render () {
    return <div>
      <h1>404: Страница не найдена</h1>
      <Link to='/'>На главную</Link>
    </div>
  }
}

export default NotFound
