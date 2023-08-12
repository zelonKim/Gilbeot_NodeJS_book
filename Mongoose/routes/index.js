const express = require('express')
const User = require('../schemas/user')

const router = express.Router()

router.get('/', async(req, res, next) => { 
    try{
        const users = await User.find({}); // 모든 사용자를 찾음.
        res.render('mongoose', { users }) // mongoose.html을 렌더링 할때 찾은 모든 사용자를 변수로 넣음.
    }
    catch (err) {
        console.error(err)
        next(err)
    }
})

module.exports = router;