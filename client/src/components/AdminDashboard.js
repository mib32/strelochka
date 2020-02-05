import React, { Component } from 'react';

class AdminDashboard extends Component {
  constructor() {
    super();
    this.state = {
      data: {
        demands: [],
        demanded_strelochkas: [],
        by_email: [],
        top_request: {},
        users: []
      }
    };
  }

  componentDidMount = () => {
    window.fetch('/admin_data.json', {
      headers: {Authorization: "Basic " + btoa("cats:cats")}
    })
      .then((response) => response.json())
      .then((json) => this.setState({data: json}))
  }

  render() {
    const data = this.state.data;
    return <React.Fragment >
      <h1>Привет!</h1>
      <h1><span className="integer">{data.demands.length}</span> текущих запросов</h1>
      <h1><span style={{fontSize: '64pt'}}>{data.demanded_strelochkas.length}</span> стрелочек в них</h1>
      <h3>Экие запросчики:</h3>
      {data.by_email.map((el) => {
        return <div>
          <h3>{el.email} {el.strelochkas.length} стрелочек</h3>
          <a href={`/demands/${el.id}/discard?token=${el.discard_token}`}>Удалить</a>
          <table className="table">
          {el.strelochkas.map((strelochka) => {
            return (
              <tr>
                <td>{strelochka.from_string}</td>
                <td>{strelochka.to_string}</td>
                <td>{strelochka.date}</td>
              </tr>
            )
          })}
          </table>
        </div>
      })}
      <br />
      <h1>Сёго дня</h1>
      <h2><span style={{fontSize: '64pt'}}>{data.requests_today}</span> запросов с <span style={{fontSize: '48pt'}}>{data.strelochkas_today}</span> стрелочками</h2>
      {data.top_request ? <h3>лидирует {data.top_request.from_string} – {data.top_request.to_string} с <span style={{fontSize: '36pt'}}>{data.top_request.count}</span> стрелочками</h3> : ''}
      <h2>Подписчики</h2>
      {data.users.map((user) => {
        return (
          <h3>{user.email} {user.created_at}</h3>
        )
      })}
    </React.Fragment>

  }
}

export default AdminDashboard;
