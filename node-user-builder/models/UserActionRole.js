'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserActionRole = sequelize.define('UserActionRole', {
    RoleCode: {
      type:DataTypes.INTEGER(11),
      allowNull: true
    },
    UserCode: {
      type:DataTypes.STRING(30),
      allowNull: true,
      validate: {
        notEmpty:false
      }
    },
    RoleAction: {
      type:DataTypes.TEXT,
      allowNull: true
    },
    CreatedBy: {
        type:DataTypes.STRING(50),
        allowNull: true,
        validate: {
          notEmpty:true
        }
    },
    ModifiedBy: {
        type:DataTypes.STRING(50),
        allowNull: true,
        validate: {
        notEmpty:true
        }
    },
  }, {});
  UserActionRole.associate = function(models) {

  };
  return UserActionRole;
};
