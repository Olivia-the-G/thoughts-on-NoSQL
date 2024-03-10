const { User, Thought } = require('../models');

module.exports = {
  // get all thoughts
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      res.status(400).json(err);
    }
  },

  // get single thought by id
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId });

      if (!thought) {
        return res.status(404).json({ message: 'no thoughts, head empty' });
      }
      res.json(thought);
    } catch (err) {
      res.status(400).json(err);
    }
  },

  // create a new thought
  async createThought(req, res) {
    try {
      // create the thought
      const thought = await Thought.create(req.body);
      // update the user's thoughts array
      const user = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $addToSet: { thoughts: thought._id } },
        { new: true }
      );
      
      if (!user) {
        return res.status(404).json({
          message: "Created thought but could not find user"
        });
      }
      res.json('Thought created');
    } catch (err) {
      console.log(err)
      return res.status(400).json(err);
    }
  },

  // update thought by id
  async updateThought(req, res) {
    try {
      // update the thought
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!thought) {
        return res.status(404).json({ message: 'Thought not found' });
      }

      res.json(thought);
    } catch (err) {
      res.status(400).json(err);
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

      // update the user's thoughts array
      const user = await User.findOneAndUpdate(
        { _id: thought.userId },
        { $pull: { thoughts: thought._id } },
        { runValidators: true, new: true }
      );

      res.json({ message: 'Thought deleted' });
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
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      );

      if (!thought) {
        res.status(404).json({ message: 'no thoughts here' });
      }

      res.json({ message: 'Reaction deleted' });
    } catch (err) {
      res.status(400).json(err);
    }
  }
};