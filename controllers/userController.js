const { User, Thought } = require('../models');

module.exports = {
  // get all users 
  async getUsers(req, res) {
    try {
      const users = await User.find();

      return res.json(users);
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  },

  // get single user by id
  async getSingleUser({ params }, res) {
    try {
      const user = await User.findOne({ _id: params.userId })
        .populate('thoughts')
        .populate('friends');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  },

  // create a new user  
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // update user by id
  async updateUser(req, res) {
    try {
      const user = await User.findOneAndUpdate({ _id: req.params.userId }, req.body, {
        new: true,
        runValidators: true,
      });
      res.json(user);
    } catch (err) {
      res.status(400).json(err);
    }
  },

  // delete user by id and their thoughts
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.userId });

      if (!user) {
        return res.status(404).json({ message: 'student not found' });
      }

      const thoughts = await Thought.deleteMany({ _id: { $in: user.thoughts } });

      if (!thoughts) {
        return res.status(404).json({ message: 'user deleted and no thoughts found' });
      }

      res.json({ message: 'user and thoughts deleted' });
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  },

  // add a friend to a user's friend list
  async addFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { new: true }
      ).populate('friends');

      if (!user) {
        return res.status(404).json({ message: 'no user found with this id' });
      }

      res.json(user);
    } catch (err) {
      res.status(400).json(err);
    }
  },
  
  // remove a friend from a user's friend list
  async removeFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { new: true }
      );

      if (!user) {
        res.status(404).json({ message: 'user not found' });
      }

      res.json(user);
    } catch (err) {
      res.status(400).json(err);
    }
  }
};