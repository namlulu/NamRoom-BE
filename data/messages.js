import SQ from 'sequelize';
import { sequelize } from '../db/database.js';
import { User } from './auth.js';
const DataTypes = SQ.DataTypes;
const Sequelize = SQ.Sequelize;

export const Message = sequelize.define('message', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});
Message.belongsTo(User);

const INCLUDE_USER = {
  attributes: [
    'id',
    'text',
    'createdAt',
    'userId',
    [Sequelize.col('user.name'), 'name'],
    [Sequelize.col('user.username'), 'username'],
    [Sequelize.col('user.url'), 'url'],
  ],
  include: {
    model: User,
    attributes: [],
  },
};

const ORDER_DESC = {
  order: [['createdAt', 'DESC']],
};

export const getAll = async () => {
  return await Message.findAll({ ...INCLUDE_USER, ...ORDER_DESC, raw: true });
};

export const getAllByUsername = async (username) => {
  return await Message.findAll({
    ...INCLUDE_USER,
    ...ORDER_DESC,
    include: {
      ...INCLUDE_USER.include,
      where: {
        username,
      },
    },
    raw: true,
  });
};

export const getById = async (id) => {
  return await Message.findOne({
    ...INCLUDE_USER,
    where: {
      id,
    },
  });
};

export const create = async (text, userId) => {
  return Message.create({ text, userId }) //
    .then((data) => getById(data.dataValues.id));
};

export const update = async (id, text) => {
  return Message.findByPk(id, INCLUDE_USER) //
    .then((message) => {
      message.text = text;
      return message.save();
    });
};

export const remove = async (id) => {
  return Message.findByPk(id) //
    .then((message) => {
      message.destroy();
    });
};
