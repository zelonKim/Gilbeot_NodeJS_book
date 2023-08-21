const Sequelize = require('sequelize')

class Domain extends Sequelize.Model {
    static initiate(sequelize) {
        Domain.init({
            host: {
                type: Sequelize.STRING(80),
                allowNull: false,
            },
            type: {
                type: Sequelize.ENUM('free', 'premium'), // free나 premium 중 하나만 값으로 입력할 수 있음.
                allowNull: false,
            },
            clientSecret: {
                type: Sequelize.UUID, // UUID는 충돌(conflict) 가능성이 적은 랜덤한 문자열임.
                allowNull: false,
            },
        }, {
            sequelize,
            timestaps: true,
            paranoid: true,
            modelName: 'Domain',
            tableName: 'domains',
        })
    }

    static associate(db) {
        db.Domain.belongsTo(db.User)
    }
}

module.exports = Domain; 

