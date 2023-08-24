const mongoose = require('mongoose')

const { MONGO_ID, MONGO_PASSWORD, NODE_ENV } = process.env;
const MONGO_URL =`mongodb://${MONGO_ID}:${MONGO_PASSWORD}@localhost:27017/admin`


const connect = () => {

        if (NODE_ENV !== 'production') {
            mongoose.set('debug', true)
        }

        mongoose.connect(MONGO_URL, {
            dbName: 'gifchat',
            useNewUrlParser: true,
          })
          .then(() => {
            console.log("몽고디비 연결 성공");
          })
          .catch((err) => {
            console.error("몽고디비 연결 에러", err);
          });
        };


mongoose.connection.on('error', (error) => {
    console.error('연결 에러', error)
})

mongoose.connection.on('disconnected', () => {
    console.error('연결이 끊겼습니다.')
    connect() // 재연결 시도
})

module.exports = connect;

