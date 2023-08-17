const passport = require('passport')
const local = require('./localStrategy')
const kakao = require('./kakaoStrategy')
const User = require('../models/user')

module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, user.id) // 유저 정보 객체에서 아이디만 추려 세션에 저장함.
    })

    passport.deserializeUser((id, done) => {
        User.findOne({ where: { id }}) // 세션에 저장한 아이디를 통해 유저 정보 객체를 불러옴.
            .then(user => done(null, user)) // 조회한 정보를 req.user 에 저장함.
            .catch(err => done(err))
    })

    local()
    kakao()
}