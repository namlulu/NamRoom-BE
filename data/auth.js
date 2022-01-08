import SQ from 'sequelize';
import { sequelize } from '../db/database.js';
const DataTypes = SQ.DataTypes;

export const User = sequelize.define(
  'user',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    url: {
      type: DataTypes.TEXT,
    },
  },
  { timestamps: false }
);

export const findByUsername = async (username) => {
  return await User.findOne({ where: { username } });
};

export const findById = async (id) => {
  return await User.findByPk(id);
};

export const createUser = async (user) => {
  return await User.create(user).then((data) => {
    return data.dataValues.id;
  });
};
