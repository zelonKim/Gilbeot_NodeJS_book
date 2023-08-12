const mongoose = require('mongoose')

const connect = () => {
    if(process.env.NODE_ENV !== 'production'){
        mongoose.set('debug', true) // 개발 환경 일때만 콘솔을 통해 몽구스가 생성하는 쿼리 내용을 확인할 수 있음.
    }
    try { // mongodb://유저명:비밀번호@localhost:27017/데이터 베이스명
        mongoose.connect('mongodb://seongjin:ksz40204@127.0.0.1:27017/admin', { // 몽구스와 몽고디비를 연결함.
        dbName: 'nodejs', // dbName 옵션으로 실제로 사용할 데이터베이스를 알려줌.
        useNewUrlParser: true,
        })
        console.log('연결 성공')
    }
    catch {
         console.log('연결 에러', error)
    }
}



mongoose.connection.on('disconnected', () => { // 몽구스 커넥션에 이벤트 리스너를 추가함.
    console.error('연결이 끊겼습니다.');
    connect();
})

module.exports = connect;