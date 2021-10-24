const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    "Country",
    {
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nameToSerch: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
          this.setDataValue(`nameToSerch`, value.toLowerCase());
        },
      },
      flag: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
          isUrl: true
        }
      },
      map: {
        type: DataTypes.STRING,
        validate:{
          isUrl: true
        }
      },
      continent: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
          this.setDataValue(`continent`, value.toLowerCase());
        },
      },
      capital: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      subregion: {
        type: DataTypes.STRING,
      },
      area: {
        type: DataTypes.INTEGER,
      },
      population: {
        type: DataTypes.STRING,
      },
      activityAsosiated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      timestamps: false,
      createdAt: false,
    }
  );
};
