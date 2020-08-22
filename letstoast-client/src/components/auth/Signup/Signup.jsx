import React, { Component } from 'react';
import authService from '../../../services/authService';
import { withRouter, Link } from 'react-router-dom';
import './Signup.scss';
import Message from '../../message/Message';
import $ from 'jquery';

class Signup extends Component {
  constructor(props){
    super(props);
    this.state = { username: '', password: '', message: '' };
    this.service = new authService();
  
  }
  
  componentWillUnmount () {
      $('.message').dialog('destroy');
  }
  
  handleFormSubmit = (event) => {
    event.preventDefault();

    const { username, password } = this.state;

       
    if(!username || !password) {
      this.setState({ message: 'Provide all information.' });
      $('.message').dialog('open');
    }
    else if (username.length < 7 || username.length > 40) {
      this.setState({ message: 'The email needs 8-40 characters.' });
      $('.message').dialog('open');
      return;
    }
    else if (password.length < 7 || password.length > 40) {
      this.setState({ message: 'The password needs 8-40 characters.' });
      $('.message').dialog('open');
      return;
    }
    else {
      this.service.signup(username, password)
      .then((response) => {
          this.props.getUser(response);
          this.props.history.push('/');
      })
      .catch((error) => {
        if(error.response && error.response.data) {
          this.setState({ message: error.response.data.message });
          $('.message').dialog('open');
        }
      });
    }
  }

  handleChange = (event) => {  
    const {name, value} = event.target;
    this.setState({[name]: value});
  }

  render(){
    return(
      <div>
        <div className="signup-component">
          <form onSubmit={this.handleFormSubmit}>

            <div className="field is-grouped is-grouped-centered">
              <h1 className="title signup-title">Let's Toast</h1>
            </div>

            <div className="field">
              <div className="control">
                <label className="label signup-label">Email</label>
                <input className="input is-primary" name="username" type="email" value={this.state.username} onChange={ e => this.handleChange(e)}/>
              </div>
            </div>

            <div className="field">
              <div className="control">
                <label className="label signup-label">Password</label>
                <input className="input is-primary" name="password" type="password"  value={this.state.password} onChange={ e => this.handleChange(e)}/>
              </div>
            </div>

            <Message message={this.state.message}/>

            <div className="field is-grouped is-grouped-centered">
              <div className="control">
                <input className="button is-primary signup-button" type="submit" value="Sign Up" />
              </div>
            </div>

            <div className="field is-grouped is-grouped-centered">
              <h6 className='subtitle signup-subtitle'>Already have an account?
                <Link to={"/"} className="signup-link"> Login</Link>
              </h6>
            </div>

          </form>
        </div>
      </div>
    )
  }
}

export default withRouter(Signup);