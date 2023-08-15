const Sequelize = require('sequelize')
const User = require('./user')
const Comment = require('./comment')

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];  // ../config/config 파일에서 "development" 데이터베이스 설정을 불러옴.
const sequelize = new Sequelize(config.database, config.username, config.password, config); // Sequelize 생성자를 통해 MySQL 연결객체를 생성함.

const db = {};

db.sequelize = sequelize; // 재사용을 위해 연결객체를 db.sequelize에 넣어둠.
db.User = User;
db.Comment = Comment;

User.initiate(sequelize) // 모델의 static initiate 메서드를 호출함. -> 모델명.init이 실행되어야 테이블이 모델로 연결됨.
Comment.initiate(sequelize)

User.associate(db) // 모델의 static associate 메서드를 호출함.
Comment.associate(db)

module.exports = db;


