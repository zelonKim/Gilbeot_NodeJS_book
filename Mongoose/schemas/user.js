const mongoose = require('mongoose')

const { Schema } = mongoose;

const userSchema = new Schema({ // Schema 생성자를 사용하여 필드를 각각 정의함으로써 스키마를 만듦.
// 몽구스는 자동으로 _id 필드(기본키)를 생성해줌.
// 몽구스 스키마에서는 자료형으로 String, Number, Date, Buffer, Boolean, Mixed, ObjectId, Array 등을 가짐. 
    name: {
        type: String,
        required: true, // 필수값
        unique: true, // 고유값
    },
    age: {
        type: Number,
        required: true,
    },
    married: {
        type: Boolean,
        required: true,
    },
    comment: String,
    createdAt: {
        type: Date,
        default: Date.now, // 기본값으로 데이터 생성 시의 시간을 가짐.
    }
})

module.exports = mongoose.model('User', userSchema)