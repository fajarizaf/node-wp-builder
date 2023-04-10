'use strict';
module.exports = (sequelize, DataTypes) => {

  const UserAction = sequelize.define('UserAction', {
    id:{
        type: DataTypes.INTEGER(50),
        autoIncrement: true,
        primaryKey: true
    },
    RoleCode: {
        type:DataTypes.INTEGER(11)
    },
    RoleAction: {
        type:DataTypes.TEXT,
        allowNull: true
    }
  }, {});
  UserAction.associate = function(models) {  
    
  };
  
  return UserAction;
};
