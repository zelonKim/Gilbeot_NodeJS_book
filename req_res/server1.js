/* 
const http = require('http')

http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    res.write('<h1> Hello Node </h1>')
    res.end('<p> Hello Server </p>')
})
.listen(8080, () => {
    console.log('8080번 포트에서 서버 대기 중입니다')
}) 
// 주소창에 http://localhost:8080/ 혹은 http://127.0.0.1:8080/ 를 입력하면 화면에 Hello Node와 Hello Server가 출력됨.



http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    res.write('<h1> Hello Node </h1>')
    res.end('<p> Hello Server </p>')
})
.listen(8081, () => {
    console.log('8081번 포트에서 서버 대기 중입니다')
}) 
// createServer를 여러 번 호출하여 한 번에 여러 서버를 실행할 수도 있음.
 */


///////////////////////


/* const http = require('http')

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    res.write('<h1> Hello Node </h1>')
    res.end('<p> Hello Server </p>')
})
.listen(8080)

server.on('listening', () => { // listen 메서드에 콜백함수를 넣는 대신, 서버에 listening 이벤트 리스너를 붙여도 됨.
    console.log('8080번 포트에서 서버 대기 중입니다')
})

server.on('error', (error) => { // error 이벤트 리스너도 붙일 수 있음.
    console.log(error)
}) */


//////////////////////


const http = require('http');
const fs = require('fs').promises;

http.createServer(async (req, res) => {
    try {
        const data = await fs.readFile('./pre.html');
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
        res.end(data)
    }   
    catch (err) {
        console.log(err)
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8'})
        res.end(err.message)
    }
})
.listen(8081, () => {
    console.log('8081번 포트에서 서버 대기 중입니다.')
})
// 요청이 들어오면 fs 모듈로 HTML파일을 읽음.

