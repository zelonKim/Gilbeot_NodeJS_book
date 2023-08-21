const jwt = require('jsonwebtoken')

exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) { // 로그인 상태이면 req.isAuthenticated()는 true임.
        next()
    } else {
        res.status(403).send('you are not logged in')
    }
}

exports.isNotLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) { // 로그아웃 상태이면 req.isAuthenticated()는 false임.
        next()
    } else {
        const message = encodeURIComponent('you are logged in')
        res.redirect(`/?error=${message}`)
    }
} 


exports.verifyToken = (req, res, next) => {
    try {
        res.locals.decoded = jwt.verify(req.headers.authorizaion, process.env.JWT_SECRET) 
        return next()
    } 
    catch(error) {
        if(error.name ==='TokenExpiredError') {
            return res.status(419).json({
                code: 419,
                message: '토큰이 만료되었습니다.'
            })
        }
        return res.status(401).json({
            code: 401,
            message: '유효하지 않은 토큰입니다'
        })
    }
}