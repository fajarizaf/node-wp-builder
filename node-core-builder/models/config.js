'use strict';
module.exports = (sequelize, DataTypes) => {
  const Config = sequelize.define('Config', {
    config_name:{
      type: DataTypes.STRING(90)
    },
    config_value:{
        type: DataTypes.STRING(90)
      },
  }, {});
  Config.associate = function(models) {

  };
  return Config;
};
