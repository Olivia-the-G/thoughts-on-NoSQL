const { Schema, model } = require('mongoose');

// Schema to create the user model
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^\S+@\S+\.\S+$/,
    },
    thoughts: [{
      type: Schema.Types.ObjectId,
      ref: 'Thought',
    }],
    friends: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

// get user friend count
userSchema.virtual('friendCount').get(function () {
  return this.friends.length;
});

const User = model('User', userSchema);

module.exports = User;
