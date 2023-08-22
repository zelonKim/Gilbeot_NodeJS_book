const axios = require('axios')

const URL = process.env.API_URL;
axios.defaults.headers.origin = process.env.ORIGIN;

const request = async(req, api) => { // NodeBird API에 요청을 보내는 함수 
    try {
        if(!req.session.jwt) { // 세션에 토큰이 없으면 -> clientSecret을 사용해 토큰을 발급받는 요청을 보냄.
            const tokenResult = await axios.post(`${URL}/token`, {
                clientSecret: process.env.CLIENT_SECRET,
            })
            req.session.jwt = tokenResult.data.token; // 세션에 토큰을 저장함.
        }

        return await axios.get(`${URL}${api}`, { // 발급받은 후에는 토큰을 이용해 API 요청을 보냄.
            headers: { authorizaion: req.session.jwt }
        })
    } 
    catch (error) {
        if (error.response?.status === 419) { // 토큰이 만료되면 -> 토큰을 지우고, request함수를 재귀적으로 호출해 다시 요청을 보냄.
            delete req.session.jwt;
            return request(req, api) 
        }
        return error.response;
    }
}

exports.getMyPosts = async(req, res, next) => {
    try {
        const result = await request(req, '/posts/my')
        res.json(result.data)  // API를 사용해 자신이 작성한 포스트를 JSON 형식으로 가져옴.
    } 
    catch(error) {
        console.error(error)
        next(error)
    }
}


exports.searchByHashtag = async(req, res, next) => {
    try {
        const result = await request(
            req, `/posts/hashtag/${encodeURIComponent(req.params.hashtag)}`
        ) // API를 사용해 해시태그를 검색함.
        res.json(result.data)
    } 
    catch (error) {
        if (error.code) {
            console.error(error)
            next(error)
        }
    }
}


exports.test = async(req, res, next) => {
    try{
        if(!req.session.jwt) { // 세션에 토큰이 없을 경우 -> 토큰을 발급함.
            const tokenResult = await axios.post('http://localhost:8002/v1/token', {
                clientSecret: process.env.CLIENT_SECRET, // HTTP 요청의 본문에 클라이언트 비밀키를 함께 보냄.
            })
            if (tokenResult.data?.code === 200) { // 토큰 발급 성공 시 -> 세션에 토큰을 저장함.
                req.session.jwt = tokenResult.data.token;
            } else { // 토큰 발급 실패 시 -> 발급 실패 사유를 응답함.
                return res.json(tokenResult.data)
            }
        }
        const result = await axios.get('http://localhost:8002/v1/test', { // 발급받은 토큰을 테스트함.
            headers: { authorization: req.session.jwt } // JWT토큰을 authorization 헤더에 넣어 전송함.
        })
        return res.json(result.data)
    } 
    catch(error) {
        console.error(error)
        if(error.response?.status === 419) { // 토큰 만료 시
            return res.json(error.response.data)
        }
        return next(error)
    } 
}

exports.renderMain = (req, res) => {
    res.render('main', { key: process.env.CLIENT_SECRET })
}

