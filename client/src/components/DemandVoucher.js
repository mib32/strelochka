import React, { Component } from 'react';
import { checkStatus } from '../utils/fetch.js'

class DemandVoucher extends Component {
  constructor() {
    super();
    this.state = {
      email: ''
    };
  }

  handleSubmit = () => {
    const params = {
      dates: this.props.items.map((i) => i.date),
      from_code: this.props.fromCode,
      to_code: this.props.toCode,
      from_string: this.props.fromString,
      to_string: this.props.toString,
      email: this.state.email,
      md: this.props.MD
    }

    window.fetch('/demands', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    }).then(checkStatus)
      .then((res) => {
        this.props.onDemandSuccess()
        return res.json()
      })
      .then((json) => {
        window.gtag('event', 'Demand Requested', {
          'event_category': 'Strelochka',
          'event_label': json.id,
          'value': 0
        });
      })
  }

  handleEmailChange = (e) => {
    this.setState({email: e.target.value})
  }

  render() {
    return <div>
      <p>Мы отправим вам сообщение, в случае если на указанном временном промежутке снизятся цены.</p>
      <div className="form-group">
        <input className="form-control" type="email" name="email" value={this.state.email} onChange={this.handleEmailChange} placeholder='Электронная почта'/>
      </div>
      <button className="btn btn-default" onClick={this.handleSubmit} type="submit">Подписаться</button>
    </div>
  }
}

export default DemandVoucher;
