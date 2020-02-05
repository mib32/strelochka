import React, { Component } from 'react';
import { checkStatus } from '../utils/fetch.js'

class FeedbackForm extends Component {
  constructor() {
    super();
    this.state = {
      feedback: ''
    };
  }

  handleSubmit = () => {
    const params = {
      uid: this.props.uid,
      feedback: this.state.feedback
    }

    this.setState({loading: true})

    window.fetch('/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    }).then(checkStatus)
      .then((res) => {
        this.setState({success: true, loading: null})
    })
  }

  handleFeedbackChange = (e) => {
    this.setState({feedback: e.target.value})
  }

  handleOneMoreTime = (e) => {
    this.setState({success: null, loading: null, feedback: ''})
  }

  handleCmdEnter = (e) => {
    if (!(e.keyCode === 13 && e.metaKey)) return;

    this.handleSubmit()
  }

  render() {
    return <div id="feedback">
      { this.state.success && <div>Готово! <button className='link-button' onClick={this.handleOneMoreTime}>Написать еще</button></div>}
      { this.state.loading && <div>Отправляется...</div>}
      { !this.state.success && !this.state.loading && <div>
        <div className="form-group">
          <textarea className="form-control" type="text" onKeyDown={this.handleCmdEnter} value={this.state.feedback} onChange={this.handleFeedbackChange} name="feedback" placeholder='Напишите здесь ваше пожелание. Укажите в письме ваш адрес для связи по желанию чтобы я мог вам ответить.'/>
        </div>
        <button className="btn btn-default" onClick={this.handleSubmit} type="submit">Отправить</button>
      </div>}
    </div>
  }
}

export default FeedbackForm;
