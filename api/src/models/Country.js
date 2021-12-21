const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  sequelize.define(
    "country",
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
        validate: {
          isUrl: true,
        },
      },
      map: {
        type: DataTypes.STRING,
        validate: {
          isUrl: true,
        },
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
        type: DataTypes.INTEGER,
      },
    },
    {
      timestamps: false,
      createdAt: false,
    }
  );
};
