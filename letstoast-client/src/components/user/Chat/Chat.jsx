import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import userService from '../../../services/userService';
import './Chat.scss';
import Tab from '../../tab/Tab';
import Navbar from '../../navbar/Navbar'
import $ from 'jquery';
import Message from '../../message/Message';

class Chat extends Component {
  constructor(props){
    super(props);
    this.state = { loggedInUser: this.props.user, targetUser: null, receivedMessages: [], message: '', inputMessage: '', alertMessage: '' };
    this.service = new userService();
  }
  
  listMessages = () => {
    console.log(this.state.receivedMessages);
    return this.state.receivedMessages.map((message, i) => {
      return <li className="chat-message" key={i}>{message.message}</li>
    });
  }
  
  handleSubmit(e) {
    e.preventDefault();

    const { inputMessage } = this.state;

    if(!inputMessage) {
      this.setState({ alertMessage: 'You can\'t send an empty message.' });
      $('.message').dialog('open');
    }
    else if (inputMessage.length > 300) {
      this.setState({ alertMessage: 'The message needs less than 300 characters.' });
      $('.message').dialog('open');
    }
    else {
      this.service.postMessage(this.state.targetUser.id, inputMessage)
      .catch( error => {
        if(error.response && error.response.data) {
          this.setState({ alertMessage: error.response.data.message });
          $('.message').dialog('open');
        }
      });
    }

  }

  getUser = () => {
    this.props.getUser(null);
  }

  componentDidMount () {
    this.fetchMessages();
    this.interval = setInterval(() => this.fetchMessages(), 1000);
  }

  componentWillUnmount () {
    $('.message').dialog('destroy');
    clearInterval(this.interval);
  }

  fetchMessages = () => {
    this.service.getMessages(this.props.match.params.token)
    .then((response) => {
        if(response.receivedMessages === null) {
          this.setState({ receivedMessages: [], targetUser: response.targetUser });
        } else {
          this.setState({ receivedMessages: response.receivedMessages, targetUser: response.targetUser });
        }
    })
    .catch((error) => {
      if(error.response && error.response.data) {
        this.setState({ message: error.response.data.message });
      }
    });
  }

  handleChange = (event) => {
    const {name, value} = event.target;
    this.setState({[name]: value});
  }

  render() {
    if(this.state.targetUser) {
      return(
        <div>
          <Navbar user = {this.state.loggedInUser} getUser={this.getUser} />
          <Tab current="Chat" user = {this.state.loggedInUser} to={[['/', 'Chat'], ['/pending', 'Pending'], ['/requested', 'Requested'], ['/search/people', 'Search'] ]}/>
          <Message message={this.state.alertMessage}/>
          <div className="chat-component">
          <div className="chat-targetuser-info">
            <img className="chat-picture" src={this.state.targetUser.pictureUrl} alt="profile"/>
            <p className="chat-targetuser-name">{this.state.targetUser.name}</p>
          </div>

            <ul className="chat-container">{this.listMessages()}</ul>
          
            <form onSubmit={(e)=>this.handleSubmit(e)}>

            <div className="field profile-input">
              <div className="control">
                <textarea className="input is-primary chat-input" name="inputMessage" value={this.state.inputMessage} onChange={ e => this.handleChange(e)}></textarea>
              </div>
            </div>

            <div className="field is-grouped is-grouped-centered">
              <button className="button is-primary chat-button" type="submit">Send Message</button>
            </div>

          </form>
          </div>
        </div>
      )
    } else {
      return(
        <div>
          <Navbar user = {this.state.loggedInUser} getUser={this.getUser} />
          <Tab current="Chat" user = {this.state.loggedInUser} to={[['/', 'Chat'], ['/pending', 'Pending'], ['/requested', 'Requested'], ['/search/people', 'Search'] ]}/>
          <div className="chat-component">
            <p className="chat-error-message">{this.state.message}</p>
          </div>
        </div>
      )
    }
  }
}

export default withRouter(Chat);