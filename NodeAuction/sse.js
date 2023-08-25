const SSE = require('sse')

module.exports = (server) => {
    const sse = new SSE(server); // new SSE(익스프레스 서버)로 서버 객체를 생성함.
    sse.on('connection', (client) => { // 클라이언트 객체를 사용할 수 있음.
        setInterval(() => {
            client.send(Date.now().toString()) // 클라이언트에게 메시지를 보냄.
        }, 1000) // 1초마다 접속한 클라이언트에게 서버시간 타임스탬프를 보냄.
    })
}