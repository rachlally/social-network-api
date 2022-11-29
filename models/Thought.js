const { Schema, model } = require('mongoose');
const moment = require('moment/moment');

const reactionSchema = new Schema (
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: ()=> new Types.ObjectId(),
        },
        reactionBody: {
            type: String,
            required: true,
            maxLength: 280
        },
        username: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: formatDate
        }
    },
    {
        toJSON: {
            getters: true
        },
        id: false,
    }
 );

const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minLength: 1,
            maxLength: 280
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: formatDate
        },
        username: {
            type: String,
            required: true

        },
        reactions: [reactionSchema]
    }, {
        toJSON: {
            virtuals: true,
            getters: true,
        },
        id: false,
    }
);

function formatDate (date) {
    return moment (date).format('MMMM Do YYYY, h:mm:ss')
}

thoughtSchema
    .virtual('reactionCount')
    .get(function () {
        return this.reactions.length;
    });


const Thought = model('thought', thoughtSchema);

module.exports = Thought;