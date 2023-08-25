const { Op } = require('sequelize');
const { Good, Auction, User, sequelize } = require('../models');
const schedule = require('node-schedule');

exports.renderMain = async (req, res, next) => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1); // 어제 시간

    const goods = await Good.findAll({ 
      where: { SoldId: null, createdAt: { [Op.gte]: yesterday } },
    });

    res.render('main', {
      title: 'NodeAuction',
      goods,
    });
  } 
  catch (error) {
    console.error(error);
    next(error);
  }
};


exports.renderJoin = (req, res) => {
  res.render('join', {
    title: '회원가입 - NodeAuction',
  });
};


exports.renderGood = (req, res) => {
  res.render('good', { title: '상품 등록 - NodeAuction' });
};


exports.createGood = async (req, res, next) => {
  try {
    const { name, price } = req.body;

    await Good.create({
      OwnerId: req.user.id,
      name,
      img: req.file.filename,
      price,
    });
    res.redirect('/');
  } 
  catch (error) {
    console.error(error);
    next(error);
  }
};



exports.renderAuction = async (req, res, next) => {
  try {
    const [good, auction] = await Promise.all([

        Good.findOne({
            where: { id: req.params.id },
            include: {
                model: User,
                as: 'Owner',
            },
        }),

        Auction.findAll({
            where: { GoodId: req.params.id },
            include: { model: User },
            order: [['bid', 'ASC']],
        }),
    ]);

    res.render('auction', {
      title: `${good.name} - NodeAuction`,
      good,
      auction,
    });
  } 
  catch (error) {
    console.error(error);
    next(error);
  }
};



exports.bid = async (req, res, next) => { // 클라이언트로부터 받은 입찰 정보를 저장함.
  try {
    const { bid, msg } = req.body;

    const good = await Good.findOne({
      where: { id: req.params.id },
      include: { model: Auction },
      order: [[{ model: Auction }, 'bid', 'DESC']],
    });

    if (!good) {
      return res.status(404).send('해당 상품은 존재하지 않습니다.');
    }

    if (good.price >= bid) {
      return res.status(403).send('시작 가격보다 높게 입찰해야 합니다.');
    }

    if (new Date(good.createdAt).valueOf() + (24 * 60 * 60 * 1000) < new Date()) {
      return res.status(403).send('경매가 이미 종료되었습니다');
    }

    if (good.Auctions[0]?.bid >= bid) {
      return res.status(403).send('이전 입찰가보다 높아야 합니다');
    }

    const result = await Auction.create({
      bid,
      msg,
      UserId: req.user.id,
      GoodId: req.params.id,
    });

    // 실시간으로 입찰 내역 전송
    req.app.get('io').to(req.params.id).emit('bid', { // 해당 경매방의 모든 사람에게 입찰가격, 입찰 메시지, 입찰자 등을 웹 소켓으로 전달함. 
      bid: result.bid,
      msg: result.msg,
      nick: req.user.nick,
    });
    return res.send('ok');
  } 
  catch (error) {
    console.error(error);
    return next(error);
  }
};





exports.createGood = async (req, res, next) => {
    try {
      const { name, price } = req.body;

      const good = await Good.create({
        OwnerId: req.user.id,
        name,
        img: req.file.filename,
        price,
      });

      const end = new Date();
      end.setDate(end.getDate() + 1); // 하루 뒤

      // scheduleJob메서드는 job객체를 반환함. -> on메서드를 통해 이벤트 수신
      const job = schedule.scheduleJob(end, async () => {  // schedule객체의 scheduleJob메서드로 일정을 예약함.
        // scheduleJob(실행될 시각, 콜백함수)
        const success = await Auction.findOne({
          where: { GoodId: good.id },
          order: [['bid', 'DESC']],
        }); // 경매 모델에서 가장 높은 가격으로 입찰한 사람을 찾음.

        await good.setSold(success.UserId); // 낙찰자를 상품 모델의 낙찰자 아이디에 넣어줌.

        await User.update({
          money: sequelize.literal(`money - ${success.bid}`), // 낙찰자의 보유자산을 낙찰 금액만큼 뺌.
        }, { // {컬럼명: sequelize.literal(컬럼명 - 숫자)}를 통해 시퀄라이즈에서 해당 컬럼의 숫자를 뺌.
          where: { id: success.UserId },
        });
      });


      job.on('error', (err) => {
        console.error('스케줄링 에러', err);
      });

      job.on('success', () => { // 스케줄링이 성공하면 success 이벤트가 발생함.
        console.log('스케줄링 성공');
      });
      res.redirect('/');
    } 
    catch (error) {
      console.error(error);
      next(error);
    }
  };
  // 스케줄링이 취소될때는 canceled 이벤트가 발생함.
  // 스케줄링이 실행될때는 run 이벤트가 발생함.




  exports.renderList = async (req, res, next) => {
    try {
      const goods = await Good.findAll({
        where: { SoldId: req.user.id },
        include: { model: Auction },
        order: [[{ model: Auction }, 'bid', 'DESC']],
      });
      res.render('list', { title: '낙찰 목록 - NodeAuction', goods });
    } 
    catch (error) {
      console.error(error);
      next(error);
    }
  };