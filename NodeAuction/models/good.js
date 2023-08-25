const Sequelize = require('sequelize');

class Good extends Sequelize.Model {
  static initiate(sequelize) {
    Good.init({
      name: {
        type: Sequelize.STRING(40),
        allowNull: false,
      },
      img: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    }, {
      sequelize,
      timestamps: true,
      paranoid: true,
      modelName: 'Good',
      tableName: 'goods',
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) { 
    db.Good.belongsTo(db.User, { as: 'Owner' }); // 사용자가 여러 상품을 등록할 수 있음. -> 일대다 관계
    db.Good.belongsTo(db.User, { as: 'Sold' }); // 사용자가 여러 상품을 낙찰 받을 수 있음. -> 일대다 관계
    db.Good.hasMany(db.Auction); // 한 상품에 여러 명이 입찰할 수 있음. -> 일대다 관계
  }
};

module.exports = Good;