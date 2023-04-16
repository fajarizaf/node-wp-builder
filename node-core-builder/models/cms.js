'use strict';
module.exports = (sequelize, DataTypes) => {
  const Cms = sequelize.define('Cms', {
    site_id:{
        type: DataTypes.INTEGER(11)
    },
    instance_id:{
        type: DataTypes.INTEGER(11)
    },
    title:{
      type: DataTypes.STRING(90)
    },
    login_email:{
        type: DataTypes.STRING(30),
        allowNull: false,
    },
    login_username:{
        type: DataTypes.STRING(30),
        allowNull: false,
    },
    login_password: {
      type:DataTypes.TEXT,
      allowNull: false
    }
  }, {});
  Cms.associate = function(models) {
    Cms.belongsTo(models.Site, {foreignKey: 'site_id', as: 'site'})
  };
  return Cms;
};
