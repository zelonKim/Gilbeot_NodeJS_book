const jwt = require('jsonwebtoken')
const rateLimit = require('express-rate-limit')

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

exports.apiLimiter = rateLimit({
    windowMs: 60 * 1000, // 기준 시간을 1분으로 설정함.
    max: 1, // 허용 횟수를 1회로 설정함.
    handler(req, res) { // 허용 횟수 초과시 핸들러를 실행함.
        res.status(this.statusCode).json({
            code: this.statusCode, // statusCode의 기본값은 429임.
            message: '1분에 한번만 요청할 수 있습니다.'
        })
    }
})

exports.deprecated = (req, res) => {
    res.status(410).json({
        code: 410,
        message: '새로운 버전을 사용하세요'
    })
}

exports.corsWhenDomainMatches = async(req, res, next) => {
    const domain = await Domain.findOne({
        where: { host: new URL(req.get('origin')).host },
    }) // 클라이언트의 도메인과 호스트가 일치하는 것이 있는지 검사함. (주소를 URL객체로 만들고 host속성을 사용해 프로토콜을 떼어냄.)
    if(domain) {
        cors({
            origin: req.get('origin'),  // origin 속성에 허용할 도메인을 따로 적어줌.
            credentials: true, // 다른 도메인 간에 쿠키를 공유함.
        })(req, res, next)
    }
     else {
        next()
    }
}