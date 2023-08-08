/* 
const express = require('express')

const app = express() // 익스프레스 모듈을 실행해 변수에 할당함.

app.set('port', process.env.PORT || 3000) // app.set('port', 포트번호)로 서버가 실행될 포트를 설정함.

app.get('/', (req, res) => {
    res.send('Hello Express') // 익스프레스에서는 .write()나 .end()대신 .send()를 사용하여 응답을 전송함.
})

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중')
}) 
*/

//////////////////


/* 
// HTML 파일로 응답하고 싶을 경우, .sendFile() 메서드를 사용하며, 파일의 경로는 path 모듈을 사용해 지정함.

const express = require('express')
const path = require('path')

const app = express()

app.set('port', process.env.PORT || 3000)

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'))
})

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중')
}) 
 */




/////////////////////////




/* const express = require('express')
const path = require('path')

const app = express()

app.set('port', process.env.PORT || 3000)


app.use((req, res, next) => {
    console.log('hello')
    next() 
})

app.get('/', (req, res, next) => {
   console.log('nice to meet you')
   next()
} , (req, res) => { // 한번에 미들웨어를 여러 개 장착할 수도 있음.
    throw new Error('bye') // 발생한 에러는 '에러 처리 미들웨어'의 첫번째 매개변수로 전달됨.
})

// 에러 처리 미들웨어 
app.use((err, req, res, next) => { 
    console.error(err)
    res.status(500).send(err.message)
})



app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중')
}) 

// http://localhost:3000/ 로 접속할 경우, 콘솔에 "hello   nice to meet you   Error: bye" 가 출력되고, 브라우저에 "bye" 가 출력됨.
 */



////////////////////////


/* 
const express = require('express')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv') // .env 파일을 관리함.
const path = require('path')

dotenv.config()
const app = express()
app.set('port', process.env.PORT || 3000)

app.use(morgan('dev')) 
app.use('/', express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser(process.env.COOKI_SECRET))


app.use((req, res, next) => {
    console.log('모든 요청에 다 실행됩니다.')
    next()
}) */


//////////////////////



const express = require('express')
const app = express()

app.set('port', process.env.PORT || 3000)

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중')
}) 


const indexRouter = require('./routes')
const userRouter = require('./routes/user')

app.use('/', indexRouter) 
app.use('/user', userRouter)
// http://localhost:3000/ 로 접속할 경우, 브라우저에 Hello 가 출력됨.
// http://localhost:3000/user 로 접속할 경우, 브라우저에 Hello Seongjin 가 출력됨.



