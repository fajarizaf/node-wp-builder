'use strict';
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    RoleCode:{
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true
    },
    RoleName:{
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    RoleSlug: {
      type:DataTypes.STRING(20),
      allowNull: true
    },
    RoleAlias: {
      type:DataTypes.STRING(20),
      allowNull: true
    },
    RoleDesc: {
      type:DataTypes.STRING(80),
      allowNull: true
    },
    RoleType: {
      type:DataTypes.STRING(30),
      allowNull: true
    },
    Department: {
      type:DataTypes.STRING(30),
      allowNull: false
    },
    CreatedBy: {
        type:DataTypes.STRING(50),
        allowNull: false,
        validate: {
          notEmpty:true
        }
    },
    ModifiedBy: {
        type:DataTypes.STRING(50),
        allowNull: false,
        validate: {
        notEmpty:true
        }
    },
  }, {});
  Role.associate = function(models) {
    Role.hasMany(models.UserCredential,  {foreignKey: 'RoleCode', as: 'usr_role'})
  };
  return Role;
};
