const express = require('express');

const router = express.Router();
const passport = require('passport');
const nodemailer = require('nodemailer');

// Bcrypt to encrypt passwords
const bcrypt = require('bcrypt');

const bcryptSalt = 10;

const User = require('../models/User');

const templates = require('../templates/template');

router.get('/loggedin', (req, res) => {
  // req.isAuthenticated() is defined by passport


  if (req.isAuthenticated()) {
    const { _id, name, username, pictureUrl, interest, aboutMe, status } = req.user;

    const user = {
      _id,
      name,
      username,
      pictureUrl,
      interest,
      aboutMe,
      status
    }
    res.status(200).json({ user, message: 'Logged' });
    return;
  }
  res.status(200).json({ message: 'Not Logged' });
});

router.post('/login', (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    this.setState({ message: 'Provide all information.' });
    return;
  }

  if (req.body.username.length < 7 || req.body.username.length > 40) {
    res.status(400).json({ message: 'The email needs 8-40 characters.' });
    return;
  }

  if (req.body.password.length < 7 || req.body.password.length > 40) {
    res.status(400).json({ message: 'The password needs 8-40 characters.' });
    return;
  }

  passport.authenticate('local', (err, theUser, failureDetails) => {
    if (err) {
      res.status(500).json({ message: 'Something went wrong authenticating user.' });
      return;
    }

    if (!theUser) {
      // "failureDetails" contains the error messages
      // from our logic in "LocalStrategy" { message: '...' }.
      res.status(401).json(failureDetails);
      return;
    }

    // save user in session
    req.login(theUser, (errLogin) => {
      if (errLogin) {
        res.status(500).json({ message: 'Login after signup went bad.' });
        return;
      }

      const { _id, name, username, pictureUrl, interest, aboutMe, status } = theUser;
              
      const user = {
        _id,
        name,
        username,
        pictureUrl,
        interest,
        aboutMe,
        status
      }

      // Send the user's information to the frontend
      // We can use also: res.status(200).json(req.user);
      res.status(200).json(user);
    });
  })(req, res, next);
});

router.post('/signup', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: 'Provide email and password.' });
    return;
  }

  if (username.length < 7 || username.length > 40) {
    res.status(400).json({ message: 'The email needs 8-40 characters.' });
    return;
  }

  if (password.length < 7 || password.length > 40) {
    res.status(400).json({ message: 'The password needs 8-40 characters.' });
    return;
  }

  User.findOne({ username }, (err, user) => {
    if (err) {
      res.status(500).json({ message: 'Email check went bad.' });
      return;
    }

    if (user) {
      res.status(400).json({ message: 'Email taken. Choose another one.' });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let token = '';

    for (let count = 0; count < 100; count += 1) {
      token += characters[Math.floor(Math.random() * characters.length)];
    }

    const newUser = new User({
      username,
      password: hashPass,
      pictureUrl: 'http://res.cloudinary.com/danielferrari/image/upload/v1544104094/lets-toast/no-profile-picture-icon.jpg.png',
      resetPasswordToken: null,
      resetPasswordExpires: null,
      status: 'Pending Confirmation',
      confirmationCode: token
    });

    newUser.save()
      .then(() => {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.NODEMAILER_EMAIL_ADRESS,
            pass: process.env.NODEMAILER_PASSWORD
          }
        });

        const mailOptions = {
          from: '"Lets Toast" <support@letstoast.com>',
          to: username,
          subject: 'Link to Confirm Email',
          html: templates.confirmEmail(token)
        };

        transporter.sendMail(mailOptions)
          .then(() => {
            // Automatically log in user after sign up
            // .login() here is actually predefined passport method
            req.login(newUser, (errLogin) => {
              if (errLogin) {
                res.status(500).json({ message: 'Login after signup went bad.' });
                return;
              }

              const { _id, username, pictureUrl, interest, aboutMe, status } = newUser;
              
              const user = {
                _id,
                username,
                pictureUrl,
                interest,
                aboutMe,
                status
              }
              
              // Send the user's information to the frontend
              // We can use also: res.status(200).json(req.user);
              res.status(200).json(user);
            });
          })
          .catch(() => {
            res.status(400);
          });
      })
      .catch(() => {
        res.status(400).json({ message: 'Saving user to database went wrong.' });
      });
  });
});

router.get('/confirm/:confirmationToken', (req, res) => {
  User.findOne({ confirmationCode: req.params.confirmationToken })
    .then((user) => {
      if (user === null) {
        res.status(500).send({ message: 'Invalid link.' });
        return;
      }

      user.update({
        confirmationCode: null,
        status: 'Active'
      })
        .then(() => {
          res.status(200).send({ message: 'Email confirmed.' });
        })
        .catch(() => {
          res.status(500).send({ message: 'Email confirmation error.' });
        });
    })
    .catch(() => {
      res.status(500).json({ message: 'User check went bad.' });
    });
});

router.post('/reset/update/:resetPasswordToken', (req, res) => {
  const { username, password } = req.body;

  User.findOne({
    username,
    resetPasswordToken: req.params.resetPasswordToken,
    resetPasswordExpires: {
      $gt: Date.now()
    }
  })
    .then((user) => {
      if (user === null) {
        res.status(500).send({ message: 'User doesn\'t exist or invalid link.' });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      user.update({
        password: hashPass,
        resetPasswordToken: null,
        resetPasswordExpires: null
      })
        .then(() => {
          res.status(200).send({ message: 'Password updated.' });
        })
        .catch(() => {
          res.status(500).send({ message: 'Password wasn\'t updated.' });
        });
    })
    .catch(() => {
      res.status(500).send({ message: 'User check went bad.' });
    });
});

router.get('/reset/update/:resetPasswordToken', (req, res) => {
  User.findOne({
    resetPasswordToken: req.params.resetPasswordToken,
    resetPasswordExpires: {
      $gt: Date.now()
    }
  })
    .then((user) => {
      if (user === null) {
        res.status(500).send({ message: 'Invalid or expired link.' });
        return;
      }
      res.status(200).send({ username: user.username, message: 'Password link is valid.' });
    })
    .catch(() => {
      res.status(500).send({ message: 'Password link check went bad.' });
    });
});

router.post('/reset', (req, res) => {
  if (req.body.username === '') {
    res.status(500).json({ message: 'Provide your email.' });
  }

  User.findOne({ username: req.body.username })
    .then((user) => {
      if (user === null) {
        res.status(500).json({ message: 'Email is\'t in database.' });
        return;
      }

      const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let token = '';
      for (let count = 0; count < 100; count += 1) {
        token += characters[Math.floor(Math.random() * characters.length)];
      }

      user.update({
        resetPasswordToken: token,
        resetPasswordExpires: Date.now() + 3600000
      }).then(() => {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.NODEMAILER_EMAIL_ADRESS,
            pass: process.env.NODEMAILER_PASSWORD
          }
        });

        const mailOptions = {
          from: '"Lets Toast" <support@letstoast.com>',
          to: user.username,
          subject: 'Link to Reset Password',
          html: templates.resetPassword(token)
        };

        transporter.sendMail(mailOptions)
          .then(() => {
            res.status(200).json({ message: 'The mail was sent.' });
          })
          .catch(() => {
            res.status(400).json({ message: 'The mail wasn\'t sent.' });
          });
      }).catch(() => {
        res.status(400).json({ message: 'The mail wasn\'t sent.' });
      });
    })
    .catch(() => {
      res.status(500).json({ message: 'Email check went bad.' });
    });
});

module.exports = router;
