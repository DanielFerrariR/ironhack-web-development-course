// navbar/Navbar.js
import React, { Component } from 'react';
import AuthService from '../../services/authService';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import './Navbar.scss';

class Navbar extends Component {
  constructor(props){
    super(props);                                                                                           
    this.service = new AuthService();
  }

  componentDidMount() {
    if($(".navbar-burger").length) {
      $(".navbar-menu").toggleClass("navbar-menu-color");
      $(".navbar-item").toggleClass("navbar-item-color");
    }

    $(".navbar-burger").click(function() {
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active navbar-menu-absolute");
    });
  }

  toggleOff() {
      if($(".navbar-burger").hasClass('is-active')) {
        $(".navbar-burger").toggleClass("is-active");
        $(".navbar-menu").toggleClass("is-active navbar-menu-absolute");
      }
  }
  
  logoutUser = () =>{
    this.service.logout()
    .then(() => {
      this.props.getUser();
    })
  }

  render(){
    if(this.props.user)
    return(
      <div>
        <nav className="navbar is-link">
          <div className="navbar-brand">
            <Link to='/' className="navbar-item navbar-title"><span>Let's Toast</span></Link>

            <div className="navbar-burger burger" data-target="navbarExampleTransparentExample">
                <span></span>
                <span></span>
                <span></span>
            </div>
          </div>

            <div className="navbar-menu">
                <div className="navbar-end">
                  <Link to='/profile' onClick={() => this.toggleOff()} className="navbar-item navbar-text">Profile</Link>
                  {/* <Link to='/' onClick={() => this.toggleOff()} className="navbar-item navbar-text">Create Event</Link>
                  <Link to='/' onClick={() => this.toggleOff()} className="navbar-item navbar-text">Create Group</Link> */}
                  <Link to='/' onClick={() => this.logoutUser()} className="navbar-item navbar-text">Logout</Link>
                </div>
            </div>
        </nav>
      </div>
    )
    else return null;
  }
}

export default Navbar;