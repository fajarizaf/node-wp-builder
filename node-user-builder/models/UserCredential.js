'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserCredential = sequelize.define('UserCredential', {
    UserCode:{
        type: DataTypes.STRING(30),
        allowNull: false,
        validate: {
            notEmpty:true
        }
    },
    RoleCode: {
      type:DataTypes.INTEGER(11),
      allowNull: true,
      validate: {
        notEmpty:true
      }
    },
    UserLogin: {
      type:DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty:true
      }
    },
    PasswordLogin: {
        type:DataTypes.TEXT,
        allowNull: true,
        validate: {
          notEmpty:false
        }
    },
    VerifyCode: {
      type:DataTypes.STRING(45),
      validate: {
          notEmpty:false
      }
    },
    FgVerified: {
      type:DataTypes.INTEGER(1),
      validate: {
          notEmpty:false
      }
    },
    rtoken: {
      type:DataTypes.TEXT,
      allowNull: true,
      validate: {
          notEmpty:false
      }
    },
    FgActive: {
      type:DataTypes.CHAR(1),
      allowNull: true
    },
  }, {});
  UserCredential.associate = function(models) {  
    UserCredential.belongsTo(models.UserProfile, {foreignKey: 'UserCode', as: 'usr_profile'})
    UserCredential.belongsTo(models.Role, {foreignKey: 'RoleCode', as: 'usr_role'})
  };
  return UserCredential;
};
