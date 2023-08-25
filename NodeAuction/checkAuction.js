const { scheduleJob } = require('node-schedule');
const { Op } = require('sequelize');
const { Good, Auction, User, sequelize } = require('./models');

// 서버를 시작할때마다 낙찰자를 지정함.

module.exports = async () => {
  console.log('checkAuction');
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1); // 어제 시간

    const targets = await Good.findAll({ 
      where: {
        SoldId: null, // 낙찰자가 없으면서
        createdAt: { [Op.lte]: yesterday }, // 생성된지 24시간이 지난 경매들
      },
    });


    // 트랜잭션을 지정한 DB작업들이 모두 성공해야만 데이터베이스에 반영됨. (하나라도 실패할 경우 모두 다 원상복귀 됨.)
    targets.forEach(async (good) => {
      const t = await sequelize.transaction(); // .transaction()으로 트랜잭션을 생성함.

      // 시퀄라이즈의 transaction 속성은 READ, DELETE 작업에서는 첫 번째 인수 객체에 존재함. / CREATE, UPDATE 작업에서는 두번째 인수 객체에 존재함.
      try {
        const success = await Auction.findOne({
          where: { GoodId: good.id },
          order: [['bid', 'DESC']],
          transaction: t,
        }); // 대상이 될 DB 작업의 옵션으로 트랜잭션을 적용함.

        await good.setSold(success.UserId, { transaction: t });  // 대상이 될 DB 작업의 옵션으로 트랜잭션을 적용함.

        await User.update({
          money: sequelize.literal(`money - ${success.bid}`),
        }, {
          where: { id: success.UserId },
          transaction: t,  // 대상이 될 DB 작업의 옵션으로 트랜잭션을 적용함.
        });

        await t.commit(); // 트랜잭션이 적용된 DB작업들이 전부 성공할 경우, .commit()에 의해 데이터베이스에 반영됨.
      } 
      catch (error) {
        await t.rollback(); // 트랜잭션이 적용된 DB작업들 중 하나라도 실패할 경우, catch문으로 이동함. -> .rollback()에서 전부 실패한 것으로 처리됨. 
      }
    });



    const ongoing = await Good.findAll({ 
      where: {
        SoldId: null, // 낙찰자가 없으면서
        createdAt: { [Op.gte]: yesterday }, // 생성된지 24시간이 지나지 않은 경매들
      },
    });

    ongoing.forEach((good) => {
      const end = new Date(good.createdAt);
      end.setDate(end.getDate() + 1); // 경매 생성일에 24시간을 더한 시간이 종료시간이 됨.

      const job = scheduleJob(end, async() => {
        const t = await sequelize.transaction();

        const success = await Auction.findOne({
          where: { GoodId: good.id },
          order: [['bid', 'DESC']],
        });

        await good.setSold(success.UserId); // 낙찰자를 지정함.

        await User.update({
          money: sequelize.literal(`money - ${success.bid}`),
        }, {
          where: { id: success.UserId },
        });
      });

      job.on('error', (err) => {
        console.error('스케줄링 에러', err);
      });
      job.on('success', () => {
        console.log('스케줄링 성공');
      });
    });
  } 
  catch (error) {
    console.error(error);
  }
};