/* 
const http = require('http')

http.createServer((req, res) => {
    console.log(req.url, req.headers.cookie)
    res.writeHead(200, { 'Set-Cookie': 'mycookie=test'})
    res.end('Hello Cookie')
})
    .listen(8083, () => {
        console.log('8083번 포트에서 서버 대기 중입니다')
    })
*/

////////////////



const http = require('http')
const fs = require('fs').promises;
const path = require('path')

// 쿠키 문자열을 자바스크립트 객체 형식으로 바꿔주는 함수
const parseCookies = (cookie='') => 
    cookie.split(';')
            .map(v => v.split('='))
            .reduce((acc, [k, v]) => {
                acc[k.trim()] = decodeURIComponent(v);
                return acc;
            }, {})


            
http.createServer(async(req,res) => {
    const cookies = parseCookies(req.headers.cookie)

    // 입력창에 '김성진'을 입력하고 로그인 버튼을 누르면 http://localhost:8084/login?name=김성진 으로 이동함.
    if(req.url.startsWith('/login')) {
        const url = new URL(req.url, 'http://localhost:8084') // URL 객체로 쿼리스트링을 분석함.
        const name = url.searchParams.get('name')

        const expires = new Date();
        expires.setMinutes(expires.getMinutes() + 5) // 쿠키의 유효기간을 현재시간 +5분 으로 설정함.
        
        res.writeHead(302, {  Location: '/', 'Set-Cookie': `name=${encodeURIComponent(name)};  Expires=${expires.toGMTString()};  HttpOnly;  Path=/`
            }) // 리다이렉트될 주소(Location)를 설정하고, 헤더에 쿠키를 넣음.
        res.end()
    } 


    else if (cookies.name) { // 쿠키가 있을 경우, 인사말을 출력함.
        res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'})
        res.end(`${cookies.name}님 안녕하세요`)
    }

    else { // 쿠키가 없을 경우, 로그인 페이지를 출력함.
        try {
            const data = await fs.readFile(path.join(__dirname, 'login.html'))
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' } )
            res.end(data)
        } 
        catch (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
            res.end(err.message)
        }
    }
})

.listen(8084, () => {
    console.log('8084번 포트에서 서버 대기 중입니다.')
})


