const { DataTypes } = require('sequelize');
const { tokenTypes } = require('../config/tokens');

module.exports = (sequelize) => {
  const Token = sequelize.define('Token', {
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user: {
      type: DataTypes.INTEGER, // FK to User.id
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(
        tokenTypes.REFRESH,
        tokenTypes.RESET_PASSWORD,
        tokenTypes.VERIFY_EMAIL
      ),
      allowNull: false,
    },
    expires: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    blacklisted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    tableName: 'tokens',
    timestamps: true,
  });

  return Token;
};
