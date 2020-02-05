import React, { Component } from 'react'
import { API_BASE } from './consts'
import queryString from 'query-string';
import strelochkaWorker from './workers/strelochka.worker';

class GoogleBotTest extends Component {
  constructor() {
    super()
    this.state = {}
    this.worker = new strelochkaWorker()
  }
  componentDidMount() {
    this.worker.addEventListener('message', event => {
      if (event.data.type === 'googlebot_test') {
        this.setState({workerMessage: event.data.message})
      }
    })
    this.worker.postMessage({type: 'googlebot_test', message: 'hello man!'})

    if (localStorage) {
      var visits = localStorage.getItem('visits');
      if (visits == null) visits = 1;
      else visits = parseInt(visits)

      localStorage.setItem('visits', visits + 1);

      this.setState({visits: visits})
    }
  }

  uniqueId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c === 'x' ? r : (r&(0x3|0x8));
      return v.toString(16);
    });
  }

  render () {
    return <div>
        {new Date().toString()}
        <br />
        {this.state.workerMessage}
        <br />
        {this.uniqueId()}
        <br />
        This is {this.state.visits} time
        <br />
        {Object.assign && 'We have object.assign! :)'}
        {!Object.assign && 'No object.assign available! :('}
        <br />
        {String.prototype.padStart && 'We have String.prototype.padStart! :)'}
        {!String.prototype.padStart && 'No String.prototype.padStart available! :('}
        <br />
        Object.values: {Object.values.toString()}
    </div>
  }
}

export default GoogleBotTest
