const Sequelize = require('sequelize')


class User extends Sequelize.Model { // 모델은 Sequelize.Model을 확장(extends)한 클래스로 선언함.
    // 모델은 크게 initiate 메서드와  associate 메서드로 나뉘어짐.

    static initiate(sequelize) {// initiate 메서드: 테이블에 대해 설정함.
        User.init({ // 모델명.init({테이블 '컬럼'에 대한 설정},{ 테이블 '자체'에 대한 설정 })
            // 시퀄라이즈는 자동으로 id를 기본키로 연결함. -> id 컬럼을 적어주지 않아도 됨. 
            name: {
                type: Sequelize.STRING(20),
                allowNull: false,
                unique: true,
            },
            age: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
            },
            married: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },
            comment: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
        }, {
            sequelize, // initiate 메서드의 매개변수와 연결되는 옵션으로서, db.sequelize객체를 넣어야 함.
            timestamps: false, // timestamps: true일 경우, 자동으로 로우가 생성될 때의 시간(createdAt)과 수정될 때의 시간(updatedAt)이 추가됨.
            underscored: false, //  underscored: true일 경우, 캐멀 케이스를 스네이크 케이스(_)로 바꿈.
            modelName: 'User', 
            tableName: 'users',
            paranoid: false, // paranoid: true일 경우, 로우를 삭제할때 나중에 복원하기 위해 deletedAt 컬럼에 지운 시각을 기록함. 
            charset: 'utf8', // 'utf8'일 경우, 한글을 입력할 수 있음. // 'utf8mb4'일 경우, 한글과 이모티콘을 입력할 수 있음.
            collate: 'utf8_general_ci' 
        })
    }

    static associate(db) {} // associate 메서드: 다른 모델과의 관계를 설정함.
}

module.exports = User;