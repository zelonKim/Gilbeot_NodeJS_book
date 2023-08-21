const Sequelize = require('sequelize')
const User = require('./user')
const Post = require('./post')
const Hashtag = require('./hashtag')
const Domain = require('./domain')

const env = process.env.NODE_ENV || 'development'
const config = require('../config/config')[env]

const db = {};
const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
)

db.sequelize = sequelize;

db.User = User;
db.Post = Post;
db.Hashtag = Hashtag;
db.Domain = Domain;


User.initiate(sequelize)
Post.initiate(sequelize)
Hashtag.initiate(sequelize)
Domain.initiate(sequelize)

User.associate(db)
Post.associate(db)
Hashtag.associate(db)
Domain.associate(db)

module.exports = db;

