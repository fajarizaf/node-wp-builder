'use strict';
module.exports = (sequelize, DataTypes) => {
  const Site = sequelize.define('Site', {
    UserCode:{
        type: DataTypes.STRING(30)
    },
    domain_id:{
        type: DataTypes.INTEGER(11)
    },
    domain_name:{
      type: DataTypes.STRING(90)
    },
    guid: {
      type:DataTypes.STRING(30),
      allowNull: false
    },
    ftp_login: {
      type:DataTypes.STRING(50),
      allowNull: true
    },
    ftp_password: {
        type:DataTypes.TEXT,
        allowNull: true
      },
  }, {});
  Site.associate = function(models) {
    Site.hasOne(models.Cms,  {foreignKey: 'site_id', as: 'cms'})
  };
  return Site;
};
