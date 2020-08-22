import React, { Component } from 'react';
import authService from '../../../services/authService';
import { Link } from 'react-router-dom';
import './ResetPassword.scss';
import Message from '../../message/Message';
import $ from 'jquery';

class ResetPassword extends Component {
  constructor(props){
    super(props);
    this.state = { username: '', message: '' };
    this.service = new authService();
  }

  componentWillUnmount () {
    $('.message').dialog('destroy');
  }
  
  getTheUser = () => {
    this.props.getUser(null);
  }

  handleFormSubmit = (event) => {
    event.preventDefault();

    const { username } = this.state;

    if(!username) {
      this.setState({ message: 'Provide your email.' });
      $('.message').dialog('open');
    } else {
      this.service.resetPassword(username)
      .then( response => {
        this.setState({ message: response.message });
        $('.message').dialog('open');
      })
      .catch( error => {
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
        <div className="reset-password-component">
          <form onSubmit={this.handleFormSubmit}>

            <div className="field is-grouped is-grouped-centered">
              <h1 className="title reset-password-title">Let's Toast</h1>
            </div>

            <div className="field">
              <div className="control">
                <label className="label reset-password-label">Email</label>
                <input className="input is-primary" name="username" type="text" value={this.state.username} onChange={ e => this.handleChange(e)}/>
              </div>
            </div>

            <Message message={this.state.message}/>

            <div className="field is-grouped is-grouped-centered">
              <div className="control">
                <input className="button is-primary reset-password-button" type="submit" value="Reset Password" />
              </div>
            </div>

            <div className="field is-grouped is-grouped-centered">
              <div className="control">
                <Link to={"/"} className="reset-password-link"> Back to Home</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default ResetPassword;