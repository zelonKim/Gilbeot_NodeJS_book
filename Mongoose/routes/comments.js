// 댓글에 관련된 CRUD 작업을 하는 라우터

const express = require('express')
const Comment = require('../schemas/comment')

const router = express.Router()

router.post('/', async(req, res, next) => { // 다큐먼트를 등록함.
    try {
        const comment = await Comment.create({ // 댓글을 저장함.
            commenter: req.body.id,
            comment: req.body.comment
        })
        console.log(comment)

        const result = await Comment.populate(comment, {path: 'comenter'})
        // populate 메서드를 통해 프로미스의 결과로 반환된 comment 객체에 다른 컬렉션 다큐먼트를 불러옴.
        // path 옵션에 어떤 필드를 합칠지 설정함.
        res.status(201).json(result)
    }
    catch (err) {
        console.error(err)
        next(err)
    }
})


router.route('/:id')
    .patch(async (req, res, next) => { // 다큐먼트를 수정함.
        try {
            const result = await Comment.update({  // update({ 어떤 다큐먼트를 수정할지에 대한 조건 }, { 수정할 필드와 값 })
                _id: req.params.id,
            }, {
                comment: req.body.comment,
            })
            res.json(result)
        } 
        catch (err) {
            console.error(err)
            next(err)
        }
    })
    .delete(async(req, res, next) => { // 다큐먼트를 삭제함.
        try {
            const result = await Comment.remove({ _id: req.params.id }) // remove({ 어떤 다큐먼트를 삭제할지에 대한 조건 })
            res.json(result)
        }
        catch (err) {
            console.error(err)
            next(err)
        }
    })

module.exports = router;