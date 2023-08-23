const mongoose = require('mongoose')

const { Schema } = mongoose;
const { Types: { ObjectId }} = Schema;

const chatSchema = new Schema({
    room: {
        type: ObjectId,
        required: true,
        ref: 'Room', // room 필드에는 Room 스키마와 연결해 Room 컬렉션의 ObjectId가 들어감.
    },
    user: {
        type: String,
        required: true,
    },
    chat: String,
    gif: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

module.exports = mongoose.model('Chat', chatSchema)