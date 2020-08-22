import React, { Component } from 'react';
import './Requested.scss';
import userService from '../../../services/userService';
import Tab from '../../tab/Tab';
import Box from '../../box/Box';
import Navbar from '../../navbar/Navbar';
import Message from '../../message/Message';
import $ from 'jquery';

class Requested extends Component {
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
    $('.message').dialog('destroy');
    clearInterval(this.interval);
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

        return <Box key={i} user={userInfo} refuse={this.refuse}/>
      });
  }
    
  getUser = () => {
    this.props.getUser(null);
  }

  fetchUsers = () => {
    this.service.findRequested()
    .then((response) => {
      if(response.user === null) {
        this.setState({ users: [], searchMessage: response.message });
      } else {
        this.setState({ users: response.user.requestedUsers });
      }
    })
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
        <Navbar user = {this.state.loggedInUser} getUser={this.getUser} />
        <Tab current="Requested" user = {this.state.loggedInUser} to={[['/', 'Chat'], ['/pending', 'Pending'], ['/requested', 'Requested'], ['/search/people', 'Search']]}/>
        <div className="requested-component">
        <p className="requested-message">{this.state.searchMessage}</p>
          <Message message={this.state.message}/>
          <ul>{this.listUsers()}</ul>
        </div>
      </div>
    )
  }
}

export default Requested;