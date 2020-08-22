import React, { Component } from 'react';
import './UpdateProfile.scss';
import userService from '../../../services/userService';
import authService from '../../../services/authService';
import Message from '../../message/Message';
import { Link } from 'react-router-dom';
import $ from 'jquery';

class UpdateProfile extends Component {
  constructor(props){
    super(props);
    this.state = {
      loggedInUser: this.props.user,
      name: '',
      aboutMe: '',
      interest: '',
      pictureUrl: this.props.user.pictureUrl,
      file: null,
      message: ''
    };
    this.userService = new userService();
    this.authService = new authService();
  }

  componentWillUnmount () {
    $('.message').dialog('destroy');
  }

  logoutUser = () =>{
    this.authService.logout()
    .then(() => {
      this.props.getUser(null);
    });
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

    const { name, aboutMe, interest, file } = this.state;

    if(!name || !aboutMe || !interest) {
      this.setState({ message: 'Provide all information.' });
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
      this.userService.updateInfo(name, aboutMe, interest, file)
      .then(() => {
        this.props.getUser(null);
      })
      .catch((error) => {
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
        <div className="update-profile-component">
          <form onSubmit={(e)=>this.handleSubmit(e)}>

            <div className="field is-grouped is-grouped-centered insert-message">
                  <div className="control">
                    <h1 className="subtitle update-profile-title">Welcome!</h1>
                  </div>
            </div>

            <div className="field is-grouped is-grouped-centered insert-message">
                  <div className="control">
                    <h1 className="subtitle update-profile-text">Just a bit more information!</h1>
                  </div>
            </div>

            <div className="field is-grouped is-grouped-centered">
              <img className="profile-picture" src={this.state.pictureUrl} alt="profile"/>
            </div>

            <div className="field is-grouped is-grouped-centered update-profile-upload">
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
                <label className="label update-profile-label profile-name">Name</label>
                <input className="input is-primary" name="name" type="text" value={this.state.name} onChange={ e => this.handleChange(e)}/>
              </div>
            </div>

            <div className="field profile-input">
              <div className="control">
                <label className="label update-profile-label">About Me</label>
                <textarea className="textarea is-primary" name="aboutMe" value={this.state.aboutMe} onChange={ e => this.handleChange(e)}></textarea>
              </div>
            </div>

            <div className="field profile-input">
              <div className="control">
                <label className="label update-profile-label">Interest</label>
                <input className="input is-primary" name="interest" value={this.state.interest} onChange={ e => this.handleChange(e)}></input>
              </div>
            </div>

            <Message message={this.state.message}/>

            <div className="field is-grouped is-grouped-centered">
              <button className="button is-primary update-profile-button" type="submit">Update Info</button>
            </div>

            <div className="field is-grouped is-grouped-centered">
              <Link to='/' onClick={() => this.logoutUser()} className="button is-primary update-profile-button">Logout</Link>
            </div>

          </form>
        </div>
      </div>
    )
  }
}

export default UpdateProfile;