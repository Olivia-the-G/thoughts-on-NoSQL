const { Schema, model } = require('mongoose');
const moment = require('moment');

const reactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId()
    },
    reactionBody: {
      type: String,
      required: true,
      max: 230
    },
    username: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    }
  }
);

// format date 
reactionSchema.virtual('formatDate').get(function() {
  return moment(reactionSchema.createdAt).format('MMMM, DD, YYYY');
});

// get reaction count 
reactionSchema.virtual('reactionCount').get(function() {
  return this.reactions.length;
});

module.exports = reactionSchema;