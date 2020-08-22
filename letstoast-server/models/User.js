const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  name: String,
  username: String,
  password: String,
  pictureUrl: String,
  aboutMe: String,
  interest: String,
  resetPasswordToken: String,
  resetPasswordExpires: Number,
  confirmationCode: String,
  status: String,
  permanentUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  pendingUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  requestedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  refusedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
