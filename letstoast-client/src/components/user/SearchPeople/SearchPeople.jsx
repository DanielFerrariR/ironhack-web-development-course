import React, { Component } from 'react';
import './SearchPeople.scss';
import userService from '../../../services/userService';
import Tab from '../../tab/Tab';
import Box from '../../box/Box';
import Navbar from '../../navbar/Navbar';
import Message from '../../message/Message';
import $ from 'jquery';

class SearchPeople extends Component {
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
          return <Box key={i} user={user} refuse={this.refuse} accept={this.accept} noChat={true}/>
      });
  }
    
  getUser = () => {
    this.props.getUser(null);
  }

  fetchUsers = () => {
    this.service.findUsers()
    .then((response) => {
      if(response.users === null) {
        this.setState({ users: [], searchMessage: response.message });
      } else {
        this.setState({ users: response.users, searchMessage: response.message });
      }
    })
    .catch((error) => {
      if(error.response && error.response.data) {
          this.setState({ searchMessage: error.response.data.message });
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
        <Tab current="Search" user = {this.state.loggedInUser} to={[['/', 'Chat'], ['/pending', 'Pending'], ['/requested', 'Requested'], ['/search/people', 'Search']]}/>
        <div className="search-people-component">
          <Message message={this.state.message}/>
          <p className="search-people-message">{this.state.searchMessage}</p>
          <ul>{this.listUsers()}</ul>
        </div>
      </div>
    )
  }
}

export default SearchPeople;