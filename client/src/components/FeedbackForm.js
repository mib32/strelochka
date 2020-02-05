import React, { Component } from 'react';
import { checkStatus } from '../utils/fetch.js'

class FeedbackForm extends Component {
  constructor() {
    super();
    this.state = {
      feedback: ''
    };
  }

  handleSubmit = (e) => {
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

    e.preventDefault()
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
    return <form onSubmit={this.handleSubmit} id="feedback">
      <h4>Форма для замечаний и предложений</h4>
      { this.state.success && <div>Готово! Благодарим вас за отзыв. <button className='link-button' onClick={this.handleOneMoreTime}>Отправить еще раз</button></div>}
      { this.state.loading && <div>Отправляется...</div>}
      { !this.state.success && !this.state.loading && <div>
        <p>Все отзывы рассматриваются. Стрелочка создана для вас, чтобы быть максимально лучшей, и мы хотим слышать каждого из вас.</p>
        <div className="form-group">
          <textarea required className="form-control" type="text" onKeyDown={this.handleCmdEnter} value={this.state.feedback} onChange={this.handleFeedbackChange} name="feedback" placeholder='Напишите здесь. Укажите в письме ваш адрес для связи по желанию.'/>
        </div>
        <input type="submit" className="btn btn-default" value="Отправить" />
      </div>}
    </form>
  }
}

export default FeedbackForm;
