const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    "Activity",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
          this.setDataValue(`name`, value.toLowerCase());
        },
      },
      difficulty: {
        type: DataTypes.INTEGER,
        validate: {
          min: 1,
          max: 5,
        },
      },
      duration: {
        type: DataTypes.INTEGER,
        validate: {
          min: 1,
          max: 12,
        },
      },
      season: {
        type: DataTypes.ENUM,
        values: ["winter", "spring", "summer", "fall"],
      },
      about: {
        type: DataTypes.STRING,
        allowNull: true,
      }
    },
    {
      timestamps: false,
      createdAt: false,
    }
  );
};
