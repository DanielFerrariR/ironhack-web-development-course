import React, { Component } from 'react';
import './App.scss';
import { withRouter, Switch, Route } from 'react-router-dom';
import Signup from './components/auth/Signup/Signup';  
import AuthService from './services/authService';
import Login from './components/auth/Login/Login';
import Profile from './components/user/Profile/Profile';
import Permanent from './components/user/Permanent/Permanent';
import Pending from './components/user/Pending/Pending';
import Requested from './components/user/Requested/Requested';
import SearchPeople from './components/user/SearchPeople/SearchPeople';
import ResetPassword from './components/auth/ResetPassword/ResetPassword';
import ResetPasswordUpdate from './components/auth/ResetPasswordUpdate/ResetPasswordUpdate';
import EmailConfirmation from './components/auth/EmailConfirmation/EmailConfirmation';
import UpdateProfile from './components/auth/UpdateProfile/UpdateProfile';
import Chat from './components/user/Chat/Chat';

class App extends Component {

  constructor(props){
    super(props)
    this.state = { loggedInUser: null };
    this.service = new AuthService();
  }

  fetchUser(){
    if( this.state.loggedInUser === null ){
      this.service.loggedin()
      .then(response =>{
        if(response.message === 'Logged') {
          this.setState({ loggedInUser:  response.user });
        }
        if(response.message === 'Not Logged') {
          this.setState({ loggedInUser: false });
        }
      })
      .catch(() => {
        this.setState({ loggedInUser: false });
      });
    }
  }

  getUser = (userObj) => {
    this.setState({
      loggedInUser: userObj
    })
  }

  render() {
    this.fetchUser();
    if(this.state.loggedInUser && !this.state.loggedInUser.name) {
      return (
        <div className="App">
          <Switch>
            <Route path='/' render={() => <UpdateProfile getUser={this.getUser} user={this.state.loggedInUser}/>}/>
          </Switch>
        </div>
      );
    }
    if(this.state.loggedInUser){
      return (
        <div className="App">
          <Switch>
            <Route exact path='/chat/:token' render={() => <Chat getUser={this.getUser} user={this.state.loggedInUser}/>}/>
            <Route exact path='/profile' render={() => <Profile getUser={this.getUser} user={this.state.loggedInUser}/>}/>
            <Route exact path='/pending' render={() => <Pending getUser={this.getUser} user={this.state.loggedInUser}/>}/>
            <Route exact path='/requested' render={() => <Requested getUser={this.getUser} user={this.state.loggedInUser}/>}/>
            <Route exact path='/search/people' render={() => <SearchPeople getUser={this.getUser} user={this.state.loggedInUser}/>}/>
            <Route exact path='/reset/update/:token' render={() => <ResetPasswordUpdate getUser={this.getUser} user={this.state.loggedInUser}/>}/>
            <Route exact path='/confirm/:token' render={() => <EmailConfirmation getUser={this.getUser} user={this.state.loggedInUser}/>}/>
            <Route path='/' render={() => <Permanent getUser={this.getUser} user={this.state.loggedInUser}/>}/>
          </Switch>
        </div>
      );
    } else {
      if(this.state.loggedInUser === false)
      return (
        <div className="App">
            <Switch>
              <Route exact path='/reset' render={() => <ResetPassword user={this.state.loggedInUser}/>}/>
              <Route exact path='/reset/update/:token' render={() => <ResetPasswordUpdate user={this.state.loggedInUser}/>}/>
              <Route exact path='/confirm/:token' render={() => <EmailConfirmation user={this.state.loggedInUser}/>}/>
              <Route exact path='/signup' render={() => <Signup getUser={this.getUser}/>}/>
              <Route path='/' render={() => <Login getUser={this.getUser}/>}/>
            </Switch>
        </div>
      );
      else return null;
    }
  }
}

export default withRouter(App);
