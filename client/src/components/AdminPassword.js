import React, { Component } from 'react';
import AdminDashboard from './AdminDashboard';

class AdminPassword extends Component {
  constructor() {
    super();
    this.password = 'коты'
    this.state = {
      logged: sessionStorage.getItem('admPassword') === this.password
    };
  }

  handlePasswordChange = (e) => {
    this.setState({password: e.target.value})
    if (e.target.value === this.password) {
      sessionStorage.setItem('admPassword', e.target.value)
      this.setState({logged: true})
    }
  }

  render() {
    const logged = this.state.logged;
    return <div>
      { logged ?
        <AdminDashboard />
        :
        <input autoFocus className='form-control-my' value={this.state.password} onChange={this.handlePasswordChange}/>
      }
    </div>
  }
}

export default AdminPassword;
