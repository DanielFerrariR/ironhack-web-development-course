import React, { Component } from 'react';
import './Pending.scss';
import userService from '../../../services/userService';
import Tab from '../../tab/Tab';
import Box from '../../box/Box';
import Navbar from '../../navbar/Navbar';
import Message from '../../message/Message';
import $ from 'jquery';

class Pending extends Component {
  constructor(props){
    super(props);
    this.state = { loggedInUser: this.props.user, users: [], message: '', searchMessage: '' };
    this.service = new userService();
  }
  
  componentDidMount () {
    this.fetchUsers();
    this.interval = setInterval(() => this.fetchUsers(), 1000);
  }

  componentWillUnmount () {
    clearInterval(this.interval);
    $('.message').dialog('destroy');
  }

  listUsers = () => {
      return this.state.users.map((user, i) => {

        const userInfo = {
          id: user._id,
          name: user.name,
          interest: user.interest,
          aboutMe: user.aboutMe,
          pictureUrl: user.pictureUrl
        };

        return <Box key={i} user={userInfo} refuse={this.refuse} accept={this.accept}/>
      });
  }
    
  getUser = () => {
    this.props.getUser(null);
  }

  fetchUsers = () => {
    this.service.findPending()
    .then((response) => {
      if(response.user === null) {
        this.setState({ users: [], searchMessage: response.message });
      } else {
        this.setState({ users: response.user.pendingUsers });
      }
    })
    .catch((error) => {
      if(error.response && error.response.data) {
          this.setState({ message: error.response.data.message });
          $('.message').dialog('open');
        }
    });
  }

  accept = (targetId) => {
    this.service.accept(targetId)
    .catch((error) => {
      if(error.response && error.response.data) {
        this.setState({ message: error.response.data.message });
        $('.message').dialog('open');
      }
    });
  }
  
  refuse = (targetId) => {
    this.service.refuse(targetId)
    .catch((error) => {
      if(error.response && error.response.data) {
        this.setState({ message: error.response.data.message });
        $('.message').dialog('open');
      }
    });
  }


  render(){
    return(
      <div> 
        <div className="box-refuse"></div>
        <div className="box-accept"></div>
        <Navbar user = {this.state.loggedInUser} getUser={this.getUser} />
        <Tab current="Pending" user = {this.state.loggedInUser} to={[['/', 'Chat'], ['/pending', 'Pending'], ['/requested', 'Requested'], ['/search/people', 'Search']]}/>
        <div className="pending-component">
        <p className="pending-message">{this.state.searchMessage}</p>
          <Message message={this.state.message}/>
          <ul>{this.listUsers()}</ul>
        </div>
      </div>
    )
  }
}

export default Pending;