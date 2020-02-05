import React, { Component } from 'react';
import { ProgressBar } from 'react-bootstrap';

class Donate extends Component {
  constructor() {
    super();
    this.state = {
      together: 11050
    };
  }

  render() {
    return (
      <div id="support">
        <h3><a href="https://money.yandex.ru/to/410011091913898" rel="noopener noreferrer" target="_blank">Не могли ли бы вы сделать пожертвование?</a></h3>
        <p>Стрелочка — некоммерческий проект и существует на пожертвования. Необходимо собрать 15 000 руб. за обслуживание серверов на год.</p>
        <p>Уже собрано - {this.state.together} из 15 000 р.</p>
        <ProgressBar now={100 / (15000/this.state.together)} label={this.state.together + ' р.'} />
        <br />
        <a className="btn btn-default" href="https://money.yandex.ru/to/410011091913898" rel="noopener noreferrer" target="_blank">Сделать пожертвование</a>
      </div>
    )
  }
}

export default Donate;
