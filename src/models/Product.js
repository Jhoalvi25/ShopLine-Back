const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    "product",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
      },
      price: {
        type: DataTypes.FLOAT,
      },
      category: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.TEXT,
      },
      image: {
        type: DataTypes.TEXT,
      },
      rating: {
        type: DataTypes.FLOAT,
      },
      stock: {
        type:DataTypes.INTEGER,
        defaultValue: 10
      }
    },
    {
      timestamps: false,
    }
  );
};
