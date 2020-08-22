import React, { Component } from 'react';
import './Message.scss';
import $ from 'jquery';

class Message extends Component {
  constructor(props){
    super(props);
    this.state = { message: '' };
  }

  componentDidMount () {
    $('.message').dialog({
      classes: { 'ui-dialog': 'message-component' },
      autoOpen: false,
      modal: true,
      minHeight: 0,
      show: {
        effect: 'fade',
        duration: 1000,
      },
      hide: {
        effect: 'fade',
        duration: 1000
      },
      buttons: [
        {
          text: 'OK',
          click: function() {
            $(this).dialog( 'close' );
          }
        }
      ],
      create: function () {
        $(this).closest('.ui-dialog')
        .find('.ui-button')
        .addClass('message-button');
      },
      open: function () {
        $('.ui-widget-overlay').height($(document).height());
        $('.ui-widget-overlay').addClass('message-overlay');
      }
    })
    
    window.addEventListener('resize', () => {
      $('.message-component').position({
        my: "center",
        at: "center",
        of: window
      });
      $('.ui-widget-overlay').height($(document).height());
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ message: nextProps["message"] });
  }

  render() {
    return(
      <div className="message">
        <p>{this.state.message}</p>
      </div>
    )
  }
}

export default Message;