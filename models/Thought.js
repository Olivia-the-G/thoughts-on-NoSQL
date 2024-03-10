const { Schema, model } = require('mongoose');
const Reaction = require('./Reaction');
const moment = require('moment');

const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      min: 1,
      max: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    reactions: [Reaction]
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

// format data
thoughtSchema.virtual('Date').get(function () {
  return moment(thoughtSchema.createdAt).format('MMMM, DD, YYYY');
});

// get reaction count 
thoughtSchema.virtual('reactionCount').get(function () {
  return this.reactions.length;
});

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;