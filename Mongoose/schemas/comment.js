const mongoose = require('mongoose')

const { Schema } = mongoose;

const { Types: { ObjectId }} = Schema;

const commentSchema = new Schema({
    commenter: { // Commenter 필드에 User 스키마의 ObjectId 가 들어감. (JOIN과 비슷한 기능) 
        type: ObjectId,
        required: true,
        ref: 'User',
    }, 
    comment: {
        type: String,
        required: true,
    }, 
    createdAt: {
        type: Date,
        default: Date.now
    },
})

module.exports = mongoose.model('Comment', commentSchema) // model메서드로 컬렉션과 스키마를 연결해주는 '모델'을 만듦.