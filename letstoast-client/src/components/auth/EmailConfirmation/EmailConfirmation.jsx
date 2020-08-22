import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import authService from '../../../services/authService';
import './EmailConfirmation.scss';
import Tab from '../../tab/Tab';
import Navbar from '../../navbar/Navbar'

class EmailConfirmation extends Component {
  constructor(props){
    super(props);
    this.state = { message: '', loggedInUser: this.props.user };
    this.service = new authService();
  }
  
  getUser = () => {
    this.props.getUser(null);
  }

  componentDidMount() {
    this.service.confirmEmail(this.props.match.params.token)
    .then((response) => {
        this.setState({ message: response.message });
    })
    .catch((error) => {
      if(error.response && error.response.data) {
        this.setState({ message: error.response.data.message });
      }
    });
  }

  render() {
      return(
        <div>
          <Navbar user = {this.state.loggedInUser} getUser={this.getUser} />
          <Tab user = {this.state.loggedInUser} to={[['/', 'Chat'], ['/pending', 'Pending'], ['/requested', 'Requested'], ['/search/people', 'Search'] ]}/>
          <div className="email-confirmation-component">
            <form onSubmit={this.handleFormSubmit}>
    
              <div className="field is-grouped is-grouped-centered">
                <h1 className="title email-confirmation-title">Let's Toast</h1>
              </div>

              <div className="field is-grouped is-grouped-centered">
                <h3 className="subtitle email-confirmation-message">{this.state.message}</h3>
              </div>
    
              <div className="field is-grouped is-grouped-centered email-confirmation-link-div">
                <div className="control">
                  <Link to={"/"} className="email-confirmation-link">Back</Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      )
    }
}

export default withRouter(EmailConfirmation);