import React, { Component } from 'react';
import authService from '../../../services/authService';
import { Link, withRouter } from 'react-router-dom';
import './ResetPasswordUpdate.scss';
import Tab from '../../tab/Tab';
import Message from '../../message/Message';
import Navbar from '../../navbar/Navbar'
import $ from 'jquery';

class ResetPasswordUpdate extends Component {
  constructor(props){
    super(props);
    this.state = { username: '', password: '', message: '', loggedInUser: this.props.user };
    this.service = new authService();
  }
  
  componentWillUnmount () {
    $('.message').dialog('destroy');
  }
  
  getUser = () => {
    this.props.getUser(null);
  }

  componentDidMount() {
    this.service.getResetPasswordUpdate(this.props.match.params.token)
    .then((response) => {
        this.setState({ username: response.username });
    })
    .catch((error) => {
      if(error.response && error.response.data) {
        this.setState({ message: error.response.data.message });
      }
    });
  }

  handleFormSubmit = (event) => {
    event.preventDefault();

    const { username, password } = this.state;

    if(!password) {
      this.setState({ message: 'Provide a new password.' });
      $('.message').dialog('open');
    } else if (password.length < 7) {
      this.setState({ message: 'The password needs at least 8 characters.' });
      $('.message').dialog('open');
    } else {
      this.service.resetPasswordUpdate(username, password, this.props.match.params.token)
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
    if(this.state.username) {
      return(
        <div>
        <Navbar user = {this.state.loggedInUser} getUser={this.getUser} />
        <Tab user = {this.state.loggedInUser} to={[['/', 'Chat'], ['/pending', 'Pending'], ['/requested', 'Requested'], ['/search/people', 'Search'] ]}/>
          <div className="reset-password-update-component">
            <form onSubmit={this.handleFormSubmit}>
    
              <div className="field is-grouped is-grouped-centered">
                <h1 className="title reset-password-update-title">Let's Toast</h1>
              </div>
    
              <div className="field">
                <div className="control">
                  <label className="label reset-password-update-label">Password</label>
                  <input className="input is-primary" name="password" type="text" value={this.state.password} onChange={ e => this.handleChange(e)}/>
                </div>
              </div>
      
              <Message message={this.state.message}/>
              
              <div className="field is-grouped is-grouped-centered">
                <div className="control">
                  <input className="button is-primary reset-password-update-button" type="submit" value="Update Password" />
                </div>
              </div>
    
              <div className="field is-grouped is-grouped-centered">
                <div className="control">
                  <Link to={"/"} className="reset-password-link">Back</Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      )
    } else {
      return(
        <div>
        <Navbar user = {this.state.loggedInUser} getUser={this.props.getUser} />
        <Tab user = {this.state.loggedInUser} to={[['/', 'Chat'], ['/pending', 'Pending'], ['/requested', 'Requested'], ['/search/people', 'Search'] ]}/>
          <div className="reset-password-update-component">
            <form onSubmit={this.handleFormSubmit}>
    

              <div className="field is-grouped is-grouped-centered">
                <h1 className="title reset-password-update-title">Let's Toast</h1>
              </div>

              <div className="field is-grouped is-grouped-centered">
                <h3 className="subtitle reset-password-update-message">{this.state.message}</h3>
              </div>
    
              <div className="field is-grouped is-grouped-centered reset-password-update-link-div">
                <div className="control">
                  <Link to={"/"} className="reset-password-update-link">Back</Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      )
    }
  }
}

export default withRouter(ResetPasswordUpdate);