const Room = require('../schemas/room');
const Chat = require('../schemas/chat');
const { removeRoom: removeRoomService } = require('../services'); 


exports.renderMain = async (req, res, next) => {
  try {
    const rooms = await Room.find({}) || {};
    res.render('main', { rooms, title: 'GIF 채팅방' });
  } 
  catch (error) {
    console.error(error);
    next(error);
  }
};


exports.renderRoom = (req, res) => {
  res.render('room', { title: 'GIF 채팅방 생성' });
};


exports.createRoom = async (req, res, next) => {
  try {
    const newRoom = await Room.create({
      title: req.body.title,
      max: req.body.max,
      owner: req.session.color,
      password: req.body.password,
    });
    const io = req.app.get('io'); // app.set('io', io)로 저장했던 io 객체를 가져옴.
    io.of('/room').emit('newRoom', newRoom); // room 네임스페이스에 연결한 모든 클라이언트에 데이터를 보냄.

    if (req.body.password) { // 비밀번호가 있는 방이면
      res.redirect(`/room/${newRoom._id}?password=${req.body.password}`);
    } 
    else {
      res.redirect(`/room/${newRoom._id}`);
    }
  } 
  catch (error) {
    console.error(error);
    next(error);
  }
};


exports.enterRoom = async (req, res, next) => {
  try {
    const room = await Room.findOne({ _id: req.params.id });
    if (!room) {
      return res.redirect('/?error=존재하지 않는 방입니다.');
    }
    if (room.password && room.password !== req.query.password) {
      return res.redirect('/?error=비밀번호가 틀렸습니다.');
    }
    const io = req.app.get('io');
    const { rooms } = io.of('/chat').adapter; // rooms에 방 목록이 들어 있음.
    console.log(rooms.get(req.params.id)); // 해당 방의 소켓 목록이 나옴.

    if (room.max <= rooms.get(req.params.id)?.size) {
      return res.redirect('/?error=허용 인원이 초과하였습니다.');
    }
    const chats = await Chat.find({ room: room._id }).sort('createdAt');
    
    return res.render('chat', {
      room,
      title: room.title,
      chats,
      user: req.session.color,
    });
  } 
  catch (error) {
    console.error(error);
    return next(error);
  }
};


exports.removeRoom = async (req, res, next) => {
  try {
    await removeRoomService(req.params.id);
    res.send('ok');
  }  
  catch (error) {
    console.error(error);
    next(error);
  }
};


exports.sendChat = async (req, res, next) => {
  try {
    const chat = await Chat.create({ // 채팅을 데이터베이스에 저장함.
      room: req.params.id,
      user: req.session.color,
      chat: req.body.chat,
    });
    req.app.get('io').of('/chat').to(req.params.id).emit('chat', chat); // 같은 방에 들어있는 소켓들에 메시지를 전송함.
    res.send('ok');
  } 
  catch (error) {
    console.error(error);
    next(error);
  }
};


exports.sendGif = async (req, res, next) => {
  try {
    const chat = await Chat.create({
      room: req.params.id,
      user: req.session.color,
      gif: req.file.filename,
    });
    req.app.get('io').of('/chat').to(req.params.id).emit('chat', chat);
    res.send('ok');
  } 
  catch (error) {
    console.error(error);
    next(error);
  }
};