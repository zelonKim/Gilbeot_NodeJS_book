const nunjucks = require('nunjucks')

const app = express()
app.set('view engine', 'html') // 뷰엔진 및 확장자로 'html' 혹은 'njk'를 사용함.

nunjucks.configure('views', { // 모듈명.configure('폴더 경로', { 옵션 })
    express: app,
    watch: true,
}) // 옵션의 express 속성에 app 객체를 연결함.
 // 옵션의 watch 속성에 true를 지정하면, HTML 파일이 변경될때 템플릿 엔진이 리렌더링됨.

