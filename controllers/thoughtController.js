const { User, Thought } = require('../models');

module.exports = {
  // get all thoughts
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      return res.json(thoughts);
    } catch (err) {
      return res.status(400).json(err);
    }
  },
  // get single thought by id
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId });

      if (!thought) {
        return res.status(404).json({ message: 'no thoughts, head empty' });
      }
      return res.json(thought);
    } catch (err) {
      return res.status(400).json(err);
    }
  },
  // create a new thought
  async createThought(req, res) {
    try {
      // create the thought
      const thought = await Thought.create(req.body);
      // update the user's thoughts array
      const user = await User.findOne({ _id: req.body.userId });
      user.thoughts.push(thought._id);
      await user.save();
      return res.json(thought);
    } catch (err) {
      return res.status(400).json(err);
    }
  },
  // update thought by id
  async updateThought(req, res) {
    try {
      // update the thought
      const updatedThought = await Thought.findOneAndUpdate({ _id: req.params.thoughtId }, req.body, {
        new: true,
        runValidators: true,
      });
      // update the user's thoughts array
      const user = await User.findOne({ thoughts: req.params.thoughtId });
      user.thoughts.pull(req.params.thoughtId);
      await user.save();
      return res.json(updatedThought);
    } catch (err) {
      return res.status(400).json(err);
    }
  },
  // delete thought by id
  async deleteThought(req, res) {
    try {
      // delete the thought
      const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });

      if (!thought) {
        return res.status(404).json({ message: 'no thoughts here' });
      }
      res.json(thought);
    } catch (err) {
      return res.status(400).json(err);
    }
  },
  // add reaction to thought
  async addReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { new: true, runValidators: true }
      );
      res.json(thought);
    } catch (err) {
      res.status(400).json(err);
    }
  },
  // remove reaction from thought
  async removeReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: req.params.reactionId } },
        { new: true }
      );

      if (!thought) {
        res.status(404).json({ message: 'no thoughts here' });
      }
      res.json(thought);
    } catch (err) {
      res.status(400).json(err);
    }
  }
};