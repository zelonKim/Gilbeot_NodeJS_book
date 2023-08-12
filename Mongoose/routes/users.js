const express = require('express')
const User = require('../schemas/user')
const Comment = require('../schemas/comment')

const router = express.Router()

router.route('/')
    .get(async (req, res, next) => {
        try {
            const users = await User.find({}) // 사용자를 조회함.
            res.json(users) // 데이터를 JSON형식으로 반환함.
        } catch (err) {
            console.error(err)
            next(err)
        }
    })
    .post(async (req, res, next) => {
        try {
            const user = await User.create({ // 모델명.create()메서드로 사용자를 등록함.
                name: req.body.name,
                age: req.body.age,
                married: req.body.married,
            })
            console.log(user)
            res.status(201).json(user)
        } 
        catch (err) {
            console.error(err)
            next(err)
        }
    })


router.get('/:id/comments', async (req, res, next) => {
    try {
        const comments = await Comment.find({ commenter: req.params.id }).populate('commenter') 
        // populate 메서드로 관련 있는 컬렉션의 다큐먼트를 불러옴. 
        // Comment 스키마 commenter 필드의 ref가 'User'로 되어 있음. -> 자동으로 'users 컬렉션'에서 다큐먼트를 찾아 합침. 
        console.log(comments)
        res.json(comments)
    }
    catch(err) {
        console.error(err)
        next(err)
    }
})

module.exports = router;