'use strict';

module.exports = (sequelize, DataTypes) => {
  const UserProfile = sequelize.define('UserProfile', {
    UserCode:{
        type: DataTypes.STRING(30),
        primaryKey: true
    },
    ContactName: {
        type:DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty:true
        }
    },
    Address: {
        type:DataTypes.TEXT
    },
    ZipCode: {
        type:DataTypes.STRING(15)
    },
    Phone: {
        type:DataTypes.STRING(50),
        allowNull: true,
        validate: {
            notEmpty:false
        }
    },
    MobilePhone: {
        type:DataTypes.STRING(50),
        allowNull: true,
        validate: {
            notEmpty:false
        }
    },
    Email: {
        type:DataTypes.STRING(50),
        allowNull: false,
        validate: {
            isEmail: true,
            notEmpty:true
        }
    },
  }, {});
  UserProfile.associate = function(models) {
    UserProfile.hasOne(models.UserCredential,  {foreignKey: 'UserCode', as: 'usr_credential'})
    UserProfile.hasMany(models.Userlog,  {foreignKey: 'UserCode', as: 'usr_log'})
  };

  
  return UserProfile;
};


