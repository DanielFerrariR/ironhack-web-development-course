import React, { Component } from 'react';
import './Profile.scss';
import userService from '../../../services/userService';
import Tab from '../../tab/Tab';
import Message from '../../message/Message';
import Navbar from '../../navbar/Navbar'
import $ from 'jquery';

class Profile extends Component {
  constructor(props){
    super(props);
    const { name, username, aboutMe, interest, pictureUrl, status } = this.props.user;
    this.state = {
      loggedInUser: this.props.user,
      name,
      username,
      password: '',
      aboutMe,
      interest,
      pictureUrl,
      file: null,
      message: '',
      status
    };
    this.service = new userService();
  }

  componentWillUnmount () {
    $('.message').dialog('destroy');
  }
  
  getUser = () => {
    this.props.getUser(null);
  }

  handleChange = (event) => {
    const {name, value} = event.target;
    this.setState({[name]: value});
  }

  handleChangeFile(e) {
    this.setState({
      file: e.target.files[0],
      pictureUrl: URL.createObjectURL(e.target.files[0])
    })
  }

  handleSubmit(e) {
    e.preventDefault();

    const { name, username, password, aboutMe, interest, file } = this.state;
    
    if(!name || !username || !aboutMe || !interest) {
      this.setState({ message: 'Provide all information.' });
      $('.message').dialog('open');
    }
    else if (password && (password.length < 7 || password.length > 40)) {
      this.setState({ message: 'The password needs 8-40 characters.' });
      $('.message').dialog('open');
    }
    else if (username.length < 7 || username.length > 40) {
      this.setState({ message: 'The email needs 8-40 characters.' });
      $('.message').dialog('open');
    }
    else if (name.length < 7 || name.length > 20) {
      this.setState({ message: 'The name needs 8-20 characters' });
      $('.message').dialog('open');
    }
    else if (interest.length > 30) {
      this.setState({ message: 'The interest needs less than 30 characters' });
      $('.message').dialog('open');
    }
    else if (aboutMe.length > 200) {
      this.setState({ message: 'The about me needs less than 200 characters' });
      $('.message').dialog('open');
    }
    else {
      this.service.updateUser(name, username,
        password, aboutMe, interest, file)
      .then( response => {
        this.setState({ status: response.status, message: response.message });
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

  render(){
    return(
      <div>
        <Navbar user = {this.state.loggedInUser} getUser={this.getUser} />
        <Tab user = {this.state.loggedInUser} to={[['/', 'Chat'], ['/pending', 'Pending'], ['/requested', 'Requested'], ['/search/people', 'Search'] ]}/>
        <div className="profile-component">
          <form onSubmit={(e)=>this.handleSubmit(e)}>

            <div className="field is-grouped is-grouped-centered">
              <img className="profile-picture" src={this.state.pictureUrl} alt="profile"/>
            </div>

            <div className="field is-grouped is-grouped-centered profile-upload">
              <div className="file is-primary">
                <label className="file-label">
                  <input className="file-input" type="file" onChange={(e)=>this.handleChangeFile(e)}/>
                  <span className="file-cta">
                    <span className="file-label">
                      Upload…
                    </span>
                  </span>
                </label>
              </div>
            </div>

            <div className="field profile-input">
              <div className="control">
                <label className="label profile-label profile-name">Name</label>
                <input className="input is-primary" name="name" type="text" value={this.state.name} onChange={ e => this.handleChange(e)}/>
              </div>
            </div>

            <div className="field profile-input">
              <div className="control">
                <label className="label profile-label">Email - <span className="profile-status">{this.state.status}</span></label>
                <input className="input is-primary" name="username" type="email" value={this.state.username} onChange={ e => this.handleChange(e)}/>
              </div>
            </div>

            <div className="field profile-input">
              <div className="control">
                <label className="label profile-label">New Password</label>
                <input className="input is-primary" name="password" type="text"  value={this.state.password} onChange={ e => this.handleChange(e)}/>
              </div>
            </div>

            <div className="field profile-input">
              <div className="control">
                <label className="label profile-label">About Me</label>
                <textarea className="textarea is-primary" name="aboutMe" value={this.state.aboutMe} onChange={ e => this.handleChange(e)}></textarea>
              </div>
            </div>

            <div className="field profile-input">
              <div className="control">
                <label className="label profile-label">Interest</label>
                <input className="input is-primary" name="interest" value={this.state.interest} onChange={ e => this.handleChange(e)}></input>
              </div>
            </div>

            <Message message={this.state.message}/>

            <div className="field is-grouped is-grouped-centered">
              <button className="button is-primary profile-button" type="submit">Update Info</button>
            </div>

          </form>
        </div>
      </div>
    )
  }
}

export default Profile;