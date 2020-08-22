import React, { Component } from 'react';
import './Box.scss';
import $ from 'jquery';
import { Link } from 'react-router-dom';

class Box extends Component {
  constructor(props){
    super(props);
    this.state = { user: this.props.user };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ user: nextProps["user"] });
  }

  componentDidMount() {
    $('.box-style').draggable({
      revert: 'invalid',
      opacity: 0.8,
      zIndex: 100,
      scroll: false
    });
  
    $('.box-refuse').height($(document).height());
    $('.box-accept').height($(document).height());

    window.addEventListener('resize', () => {
      $('.box-refuse').height($(document).height());
      $('.box-accept').height($(document).height());
    });

    $('.box-refuse').droppable({
      tolerance: "fit",
      drop: ( event, ui ) => {
        ui.draggable.toggle('fade');
        this.props.refuse(ui.draggable.attr('id'));
      },
      over: function(event, ui) {
        ui.draggable.addClass('box-red');
      },
      out: function( event, ui ) {
        ui.draggable.removeClass('box-red');
      }
    });
    
    $('.box-accept').droppable({
      tolerance: 'fit',
      drop: ( event, ui ) => {
        ui.draggable.toggle('fade');
        this.props.accept(ui.draggable.attr('id'));
      },
      over: function(event, ui) {
        ui.draggable.addClass('box-green');
      },
      out: function( event, ui ) {
        ui.draggable.removeClass('box-green');
      }
    });
  }

  render() {
    if(this.props.noChat) {
      return(
        <li className="box-style" id={this.state.user.id}>
          <img src={this.state.user.pictureUrl} alt="profile" className="box-picture"/>
          <div className="box-content">
            <p className="box-name">{this.state.user.name}</p>
            <p className="box-interest">{this.state.user.interest}</p>
          </div>
        </li>
      )
    } else {
        return (
          <Link to={'/chat/' + this.state.user.id}>
          <li className="box-style" id={this.state.user.id}>
            <img src={this.state.user.pictureUrl} alt="profile" className="box-picture"/>
            <div className="box-content">
              <p className="box-name">{this.state.user.name}</p>
              <p className="box-interest">{this.state.user.interest}</p>
            </div>
          </li>
          </Link>
        )
      }
  }
}

export default Box;