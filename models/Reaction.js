const { Schema, Types } = require('mongoose');
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
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    }
  },
  {
    toJSON: {
      getters: true
    },
    id: false
  }
);

// format date 
reactionSchema.virtual('Date').get(function () {
  return moment(reactionSchema.createdAt).format('MMMM, DD, YYYY');
});


module.exports = reactionSchema;