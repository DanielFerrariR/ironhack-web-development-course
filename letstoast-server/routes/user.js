const express = require('express');

const router = express.Router();

// Bcrypt to encrypt passwords
const bcrypt = require('bcrypt');

const bcryptSalt = 10;

const nodemailer = require('nodemailer');

const User = require('../models/User');
const Message = require('../models/Message');
const parser = require('../configs/cloudinary');
const templates = require('../templates/template');

// Middleware
router.use((req, res, next) => {
  // req.isAuthenticated() is defined by passport
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).json({ message: 'Not Logged' });
  }
});

router.get('/messages/:id', (req, res) => {
  User.findOne({ _id: req.user.id })
    .then((user) => {
      if (!user) {
        res.status(500).send({ message: 'User doesn\'t exist.' });
        return;
      }

      User.findOne({ _id: req.params.id })
        .then((targetUser) => {
          if (!targetUser) {
            res.status(500).send({ message: 'Can\'t find the target user in the database.' });
            return;
          }

          if(!targetUser.permanentUsers.map(id=>id.toString()).includes(user.id)) {
            res.status(500).send({ message: 'You aren\'t in target user permanent list.' });
            return;
          }

          Message.find({ userId: user.id })
            .then((userMessages) => {
              Message.find({ userId: targetUser.id })
              .then((targetMessages) => {

                const targetUserInfo = {
                  id: targetUser.id,
                  name: targetUser.name,
                  pictureUrl: targetUser.pictureUrl,
                  aboutMe: targetUser.aboutMe,
                  interest: targetUser.interest
                }; 


                let userMessagesStyle = userMessages.map((message) => {
                  return {
                    created_at: message.created_at,
                    message: user.name + ': ' + message.message
                    }
                });
                let targetUserMessagesStyle = targetMessages.map((message) => {
                  return {
                    created_at: message.created_at,
                    message: targetUser.name + ': ' + message.message
                    }
                });
                let receivedMessages = userMessagesStyle.concat(targetUserMessagesStyle).sort(function compare(a, b) {
                  var dateA = new Date(a.created_at);
                  var dateB = new Date(b.created_at);
                  return dateA - dateB;
                })

                if (!receivedMessages || receivedMessages.length === 0) {
                 receivedMessages = null;
                }
                res.status(200).json({ receivedMessages, targetUser: targetUserInfo });
              })
              .catch(() => {
                res.status(500).json({ message: 'Target user messages check went bad.' });
              });
            })
            .catch(() => {
              res.status(500).json({ message: 'User messages check went bad.' });
            });
        })
        .catch(() => {
          res.status(500).json({ message: 'Target user check went bad.' });
        });
    })
    .catch((err) => {
      res.status(500).json({ message: 'User check went bad.' });
    });
});

router.post('/messages/:id', (req, res) => {

  const { message } = req.body;

  User.findOne({ _id: req.user.id })
    .then((user) => {
      if (!user) {
        res.status(500).send({ message: 'User doesn\'t exist.' });
        return;
      }

      User.findOne({ _id: req.params.id })
        .then((targetUser) => {
          if (!targetUser) {
            res.status(500).send({ message: 'Can\'t find the target user in the database.' });
            return;
          }

          // if(!targetUser.permanentUsers.map(id=>id.toString()).includes(user.id) && !targetUser.pendingUsers.map(id=>id.toString()).includes(user.id) && !targetUser.requestedUsers.map(id=>id.toString()).includes(user.id)) {
          //   res.status(500).send({ message: 'You aren\'t allowed to talk to this person' });
          //   return;
          // }

          const newMessage = new Message({
            userId: user.id,
            targetId: targetUser.id,
            message
          });

          newMessage.save()
            .catch(() => {
              res.status(500).json({ message: 'Error saving the message.' });
            });
        })
        .catch(() => {
          res.status(500).json({ message: 'Target user check went bad.' });
        });
    })
    .catch(() => {
      res.status(500).json({ message: 'User check went bad.' });
    });
});

router.post('/logout', (req, res) => {
  // req.logout() is defined by passport
  req.logout();
  res.status(200).json({ message: 'Log out success!' });
});

router.get('/accept/:id', (req, res) => {
  User.findOne({ _id: req.user.id })
    .then((user) => {
      if (!user) {
        res.status(500).send({ message: 'User doesn\'t exist.' });
        return;
      }

      if (user.status !== 'Active') {
        res.status(500).send({ message: 'You aren\'t active. Please confirm your email.' });
        return;
      }

      User.findOne({ _id: req.params.id })
        .then((targetUser) => {
          if (!targetUser) {
            res.status(500).send({ message: 'Can\'t find the target user in the database.' });
            return;
          }

          if (targetUser.status !== 'Active') {
            res.status(500).send({ message: 'The target user isn\'t active.' });
            return;
          }

          if(targetUser.refusedUsers.map(id=>id.toString()).includes(user.id)) {
            res.status(500).send({ message: 'You are in target user refused list.' });
            return;
          }

          if(targetUser.pendingUsers.map(id=>id.toString()).includes(user.id)) {
            res.status(500).send({ message: 'You are in target user pending list.' });
            return;
          }

          if(targetUser.permanentUsers.map(id=>id.toString()).includes(user.id)) {
            res.status(500).send({ message: 'You are in target user permanent list.' });
            return;
          }

          //User
          let userPermanentUsers = user.permanentUsers.filter((userPermanentUser) => {
            return (userPermanentUser === targetUser.id);
          })

          let userPendingUsers = user.pendingUsers.filter((userPendingUser) => {
            return (userPendingUser === targetUser.id);
          })

          let userRequestedUsers = user.requestedUsers.filter((userRequestedUser) => {
            return (userRequestedUser === targetUser.id);
          })

          //Target User
          let targetUserPermanentUsers = targetUser.permanentUsers.filter((targetUserPermanentUser) => {
            return (targetUserPermanentUser === user.id);
          })

          let targetUserPendingUsers = targetUser.pendingUsers.filter((targetUserPendingUser) => {
            return (targetUserPendingUser === user.id);
          })

          let targetUserRequestedUsers = targetUser.requestedUsers.filter((targetUserRequestedUser) => {
            return (targetUserRequestedUser === user.id);
          })

          if(user.pendingUsers.map(id=>id.toString()).includes(targetUser.id)) {
            userPermanentUsers.push(targetUser.id);
            targetUserPermanentUsers.push(user.id);
          } else {
            userRequestedUsers.push(targetUser.id);
            targetUserPendingUsers.push(user.id);
          }

          user.update({ permanentUsers: userPermanentUsers, pendingUsers: userPendingUsers, requestedUsers: userRequestedUsers })
            .then(() => {
              targetUser.update({ permanentUsers: targetUserPermanentUsers, pendingUsers: targetUserPendingUsers, requestedUsers: targetUserRequestedUsers })
            .catch(() => {
              res.status(400).json({ message: 'Saving target user to database went wrong.' });
            });
          })
          .catch(() => {
            res.status(400).json({ message: 'Saving current user to database went wrong.' });
          });
        })
        .catch(() => {
          res.status(500).json({ message: 'Target user check went bad.' });
        });
    })
    .catch((err) => {
      res.status(500).json({ message: 'User check went bad.' });
    });
});


router.get('/refuse/:id', (req, res) => {
  User.findOne({ _id: req.user.id })
    .then((user) => {
      if (!user) {
        res.status(500).send({ message: 'User doesn\'t exist.' });
        return;
      }

      User.findOne({ _id: req.params.id })
        .then((targetUser) => {
          if (!targetUser) {
            res.status(500).send({ message: 'Can\'t find the target user in the database.' });
            return;
          }

          //User
          const userPermanentUsers = user.permanentUsers.filter((userPermanentUser) => {
            return (userPermanentUser === targetUser.id);
          })

          const userPendingUsers = user.pendingUsers.filter((userPendingUser) => {
            return (userPendingUser === targetUser.id);
          })

          const userRequestedUsers = user.requestedUsers.filter((userRequestedUser) => {
            return (userRequestedUser === targetUser.id);
          })

          let userRefusedUsers = user.refusedUsers.filter((userRefusedUser) => {
            return (userRefusedUser === targetUser.id);
          })

          userRefusedUsers.push(targetUser.id);

          //Target User
          const targetUserPermanentUsers = targetUser.permanentUsers.filter((targetUserPermanentUser) => {
            return (targetUserPermanentUser === user.id);
          })

          const targetUserPendingUsers = targetUser.pendingUsers.filter((targetUserPendingUser) => {
            return (targetUserPendingUser === user.id);
          })

          const targetUserRequestedUsers = targetUser.requestedUsers.filter((targetUserRequestedUser) => {
            return (targetUserRequestedUser === user.id);
          })

          let targetUserRefusedUsers = targetUser.refusedUsers.filter((targetUserRefusedUser) => {
            return (targetUserRefusedUser === user.id);
          })

          targetUserRefusedUsers.push(user.id);

          user.update({ permanentUsers: userPermanentUsers, pendingUsers: userPendingUsers, requestedUsers: userRequestedUsers, refusedUsers: userRefusedUsers })
            .then(() => {
              targetUser.update({ permanentUsers: targetUserPermanentUsers, pendingUsers: targetUserPendingUsers, requestedUsers: targetUserRequestedUsers, refusedUsers: targetUserRefusedUsers })
                .catch(() => {
                  res.status(400).json({ message: 'Saving target user to database went wrong.' });
                });
            })
            .catch(() => {
              res.status(400).json({ message: 'Saving current user to database went wrong.' });
            });
        })
        .catch(() => {
          res.status(400).json({ message: 'Target user check went bad.' });
        });
    })
    .catch(() => {
      res.status(500).json({ message: 'User check went bad.' });
    });
});


router.get('/find/users', (req, res) => {
  User.find({ _id: { $ne: req.user.id }, permanentUsers: { $nin: [req.user.id] }, requestedUsers: { $nin: [req.user.id] }, pendingUsers: { $nin: [req.user.id] }, refusedUsers: { $nin: [req.user.id] }, status: 'Active', name: { $exists: true } })
    .then((users) => {
      if (!users || users.length === 0) {
        res.status(200).json({ users: null, message: 'There is no one near you.' });
        return;
      }
      
      const filterUsersInfo = users.map((user) => {
        return { id: user.id, name: user.name, pictureUrl: user.pictureUrl, aboutMe: user.aboutMe, interest: user.interest };
      });

      if(users.length === 1) {
        res.status(200).json({ users: filterUsersInfo, message: 'Found: ' + filterUsersInfo.length + ' user.' });
      } else {
        res.status(200).json({ users: filterUsersInfo, message: 'Found: ' + filterUsersInfo.length + ' users.' });
      }
    })
    .catch(() => {
      res.status(500).json({ message: 'Users check went bad.' });
    });
});

router.get('/find/pending', (req, res) => {
  User.findOne({ _id: req.user.id })
    .populate({ path: 'pendingUsers', select: 'name interest aboutMe pictureUrl' })
    .then((user) => {
      if (!user.pendingUsers || user.pendingUsers.length === 0) {
        res.status(200).json({ user: null, message: 'You didn\'t add anyone yet!' });
        return;
      }

      res.status(200).json({ user, message: '' });
    })
    .catch(() => {
      res.status(500).json({ message: 'Users check went bad.' });
    });
});

router.get('/find/requested', (req, res) => {
  User.findOne({ _id: req.user.id })
    .populate({ path: 'requestedUsers', select: 'name interest aboutMe pictureUrl' })
    .then((user) => {
      if (!user.requestedUsers || user.requestedUsers.length === 0) {
        res.status(200).json({ user: null, message: 'You didn\'t add anyone yet!' });
        return;
      }
      res.status(200).json({ user, message: '' });
    })
    .catch(() => {
      res.status(500).json({ message: 'Users check went bad.' });
    });
});

router.get('/find/permanent', (req, res) => {
  User.findOne({ _id: req.user.id })
    .populate({ path: 'permanentUsers', select: 'name interest aboutMe pictureUrl' })
    .then((user) => {
      if (!user.permanentUsers || user.permanentUsers.length === 0) {
        res.status(200).json({ user: null, message: 'You didn\'t add anyone yet!' });
        return;
      }
      res.status(200).json({ user });
    })
    .catch((err) => {
      res.status(500).json({ message: 'Users check went bad.' });
    });
});

router.post('/update/info', (req, res) => {

  parser.single('picture')(req, res, function(err) {
    if (err) {
      res.status(500).json({ message: err.message });
      return;
    }

    const { name, aboutMe, interest } = req.body;

    if (!name || !aboutMe || !interest) {
      res.status(400).json({ message: 'Provide all information.' });
      return;
    }

    if (name.length < 7 || name.length > 20) {
      this.setState({ message: 'The name needs 8-20 characters' });
      return;
    }

    if (interest.length > 30) {
      this.setState({ message: 'The interest needs less than 30 characters' });
      return;
    }

    if (aboutMe.length > 200) {
      this.setState({ message: 'The about me needs less than 200 characters' });
      return;
    }

    User.findOne({ _id: req.user.id })
      .then((user) => {
        if (!user) {
          res.status(500).send({ message: 'User doesn\'t exist.' });
          return;
        }

        const picture = (req.file) ? req.file.url : user.pictureUrl;

        user.update({
          name,
          aboutMe,
          interest,
          pictureUrl: picture
        })
          .then(() => {
            res.status(200).json({ message: 'Sucess' });
          })
          .catch(() => {
            res.status(400).json({ message: 'Saving user to database went wrong.' });
          });
      })
      .catch(() => {
        res.status(500).json({ message: 'User check went bad.' });
      });
  });
})


router.post('/profile/update', (req, res) => {

  parser.single('picture')(req, res, function(err) {
    if (err) {
      res.status(500).json({ message: err.message });
      return;
    }

    const { name, username, password, aboutMe, interest } = req.body;
  
    if (!name || !username || !aboutMe || !interest) {
      res.status(400).json({ message: 'Provide all information.' });
      return;
    }
  
    if (password && (password.length < 7 || password.length > 40)) {
      res.status(400).json({ message: 'The password needs 8-40 characters.' });
      return;
    }
  
    if (username.length < 7 || username.length > 40) {
      res.status(400).json({ message: 'The email needs 8-40 characters.' });
      return;
    }
  
    if (name.length < 7 || name.length > 20) {
      this.setState({ message: 'The name needs 8-20 characters' });
      return;
    }
  
    if (interest.length > 30) {
      this.setState({ message: 'The interest needs less than 30 characters' });
      return;
    }
  
    if (req.body.aboutMe.length > 200) {
      this.setState({ message: 'The about me needs less than 200 characters' });
      return;
    }
  
    User.findOne({ username })
      .then((anotherUser) => {
        if (anotherUser && anotherUser.id !== req.user.id) {
          res.status(400).json({ message: 'Email taken. Choose another one.' });
          return;
        }
  
        User.findOne({ _id: req.user.id })
          .then((user) => {
            if (!user) {
              res.status(500).send({ message: 'User doesn\'t exist.' });
              return;
            }
  
            const salt = bcrypt.genSaltSync(bcryptSalt);
            const hashPass = (!password) ? user.password : bcrypt.hashSync(password, salt);
            const picture = (req.file) ? req.file.url : user.pictureUrl;
            let confirmationCode = null;
  
            let { status } = user;
  
            if (user.username !== username) {
              status = 'Pending Confirmation';
            }
  
            let token = '';
            const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
            if (status === 'Pending Confirmation') {
              for (let count = 0; count < 100; count += 1) {
                token += characters[Math.floor(Math.random() * characters.length)];
              }
              confirmationCode = token;
            }
  
            user.update({
              name,
              username,
              password: hashPass,
              aboutMe,
              interest,
              pictureUrl: picture,
              status,
              confirmationCode
            })
              .then(() => {
                if (status === 'Pending Confirmation') {
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
                      res.status(200).json({ message: 'The information was updated.', status });
                    })
                    .catch(() => {
                      res.status(400).json({ message: 'Saving user to database went wrong.' });
                    });
                  return;
                }
                res.status(200).json({ message: 'The information was updated.', status });
              })
              .catch(() => {
                res.status(400).json({ message: 'Saving user to database went wrong.' });
              });
          })
          .catch(() => {
            res.status(500).json({ message: 'User check went bad.' });
          });
      })
      .catch(() => {
        res.status(500).json({ message: 'Email check went bad.' });
      });
  });
})

module.exports = router;
