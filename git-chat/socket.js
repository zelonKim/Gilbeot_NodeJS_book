/* const WebSocket = require('ws')

module.exports = (server) => {
    const wss = new WebSocket.Server({ server }) //  웹소켓 서버와 익스프레스 서버를 연결함. (HTTP와 WS는 같은 포트를 공유할 수 있음.)

    wss.on('connection', (ws, req) => { // 웹 소켓 연결 시
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress; // 클라이언트의 IP를 알아내는 방법

        console.log('새로운 클라이언트 접속', ip)

        ws.on('message', (message) => { // 클라이언트로부터 메시지 수신 시
            console.log(message.toString())
        })

        ws.on('error', (error) => {
            console.error(error)
        })

        ws.on('close', () => { // 연결 종료 시
            console.log('클라이언트 접속 해제', ip)
            clearInterval(ws.interval)
        })

        ws.interval = setInterval(() => { 
            if(ws.readyState === ws.OPEN) {
                ws.send('서버에서 클라이언트로 메시지를 보냅니다')
            } // 3초마다 연결된 클라이언트에 메시지를 전송함.
        }, 3000)
    })
} */


////////////////////////////////////////

/* 
const SocketIO = require('socket.io')

module.exports = (server) => {
    const io = SocketIO(server, {path: '/socket.io'}) // 웹소켓 서버와 익스프레스 서버를 연결함.
    // SocketIO 객체의 두번째 인수에 옵션 객체를 넣어 서버에 관해 설정함. ( path 옵션을 통해 클라이언트가 접속할 경로를 설정함. )

    io.on('connection', (socket) => { // 클라이언트가 접속했을 때 발생함.
        const req = socket.request // 요청 객체에 접근함.
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        console.log('새로운 클라이언트 접속', ip, socket.id, req.ip) // socket.id로 소켓 고유의 아이디를 가져옴.

        socket.on('disconnect', () => { // 클라이언트가 연결을 끊었을 때 발생함.
            console.log('클라이언트 접속 해제', ip, socket.id)
            clearInterval(socket.interval)
        })

        socket.on('error', (error) => {
            console.error(error)
        })

        socket.on('reply', (data) => {  // 클라이언트에서 reply라는 이벤트명으로 데이터를 보낼 때 이를 서버에서 받음.
            console.log(data)
        })

        socket.interval = setInterval(() => { 
          socket.emit('news', 'Hello Socket.IO') // emit('이벤트명', '데이터'): 해당 이벤트명으로 해당 데이터를 클라이언트에 보냄.
        }, 3000) // 3초마다 연결된 클라이언트에 메시지 전송
    })
}
 */


//////////////////////////


const SocketIO = require('socket.io')

module.exports = (server, app) => {
    const io = SocketIO(server, { path: '/socket.io'})
    app.set('io', io) // 라우터에서 io 객체를 쓸 수 있도록 저장해둠. -> req.app.get('io')로 접근 가능함.
    
    const room = io.of('/room') // of 메서드를 통해 Socket.IO에 네임스페이스를 부여함. -> 같은 네임스페이스끼리만 데이터를 전달함.
    const chat = io.of('/chat')

    room.on('connection', (socket) => { // room 네임스페이스에 이벤트 리스너를 붙여줌.
        console.log('room 네임스페이스에 접속')

        socket.on('disconnect', () => {
            console.log('room 네임스페이스 해제')
        })
    })

    chat.on('connection', (socket) => { // chat 네임스페이스에 이벤트 리스너를 붙여줌.
        console.log('chat 네임스페이스 접속')

        socket.on('join', (data) => {
            socket.join(data)
        })

        socket.on('disconnect', () => {
            console.log('chat 네임스페이스 해제')
        })
    })
}