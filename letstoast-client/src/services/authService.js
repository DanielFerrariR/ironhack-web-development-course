import axios from 'axios';

class AuthService {
  constructor() {
    let service = axios.create({
      baseURL: `${process.env.REACT_APP_API_URL}`,
      withCredentials: true
    });
    this.service = service;
  }

  signup = (username, password) => {
    return this.service.post('/signup', {username, password})
    .then(response => response.data)
  }

  loggedin = () => {
    return this.service.get('/loggedin')
    .then(response => response.data)
  }

  login = (username, password) => {
    return this.service.post('/login', {username, password})
    .then(response => response.data)
  }

  resetPassword = (username) => {
    return this.service.post('/reset', {username})
    .then(response => response.data)
  }

  getResetPasswordUpdate = (token) => {
    return this.service.get('/reset/update/' + token)
    .then(response => response.data)
  }

  resetPasswordUpdate = (username, password, token) => {
    return this.service.post('/reset/update/' + token, {username, password})
    .then(response => response.data)
  }
  
  confirmEmail = (token) => {
    return this.service.get('/confirm/' + token)
    .then(response => response.data)
  }

  logout = () => {
    return this.service.post('/logout', {})
    .then(response => response.data)
  }

}

export default AuthService;