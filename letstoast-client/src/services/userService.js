import axios from 'axios';

class userService {
  constructor() {
    let service = axios.create({
      baseURL: `${process.env.REACT_APP_API_URL}`,
      withCredentials: true
    });
    this.service = service;
  }

  getMessages = (targetId) => {
    return this.service.get('/messages/' + targetId)
    .then(response => response.data)
  }

  postMessage = (targetId, message) => {
    return this.service.post('/messages/' + targetId, { message })
    .then(response => response.data)
  }

  findUsers = () => {
    return this.service.get('/find/users')
    .then(response => response.data)
  }

  findPending = () => {
    return this.service.get('/find/pending')
    .then(response => response.data)
  }

  findRequested = () => {
    return this.service.get('/find/requested')
    .then(response => response.data)
  }

  findPermanent = () => {
    return this.service.get('/find/permanent')
    .then(response => response.data)
  }

  accept = (targetId) => {
    return this.service.get('/accept/' + targetId)
    .then(response => response.data)
  }

  refuse = (targetId) => {
    return this.service.get('/refuse/' + targetId)
    .then(response => response.data)
  }

  updateInfo = (name, aboutMe, interest, file)  => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("aboutMe", aboutMe);
    formData.append("interest", interest);
    if(file) formData.append("picture", file);
    return this.service
      .post('/update/info', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => response.data)
  }

  updateUser = (name, username, password, aboutMe, interest, file)  => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("username", username);
    formData.append("password", password);
    formData.append("aboutMe", aboutMe);
    formData.append("interest", interest);
    if(file) formData.append("picture", file);
    return this.service
      .post('/profile/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => response.data)
  }

}

export default userService;