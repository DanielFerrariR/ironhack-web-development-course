import React from 'react';
import ReactDOM from 'react-dom';
import './reset.scss';
import './bulma.scss';
import './index.scss';
import 'font-awesome/css/font-awesome.min.css';
import $ from 'jquery';
import 'jquery-ui-dist/jquery-ui';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from "react-router-dom";

(window).jQuery = $;
require('jquery-ui-touch-punch');


ReactDOM.render(
  <BrowserRouter>
      <App />
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
