'use strict';

module.exports = (sequelize, DataTypes) => {
  const Userlog = sequelize.define('Userlog', {
    descriptions: {
        type:DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty:true
        }
    },
    user: {
        type:DataTypes.STRING(50),
        validate: {
            notEmpty:true
        }
    },
    UserCode: {
        type:DataTypes.STRING(30)
    },
    ipaddr: {
        type:DataTypes.STRING(170)
    },
    useragent: {
        type:DataTypes.TEXT('long'),
        allowNull: true,
        validate: {
            notEmpty:false
        }
    },
    req: {
        type:DataTypes.TEXT('long'),
        allowNull: true,
        validate: {
            notEmpty:false
        }
    },
    res: {
      type:DataTypes.TEXT('long'),
      allowNull: true,
      validate: {
          notEmpty:false
    }
    },
  }, {});
  Userlog.associate = function(models) {
        Userlog.belongsTo(models.UserProfile, {foreignKey: 'UserCode', as: 'log_usr_profile'})
  };
  return Userlog;
};


