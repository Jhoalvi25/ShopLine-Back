const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    "review",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        defaultValue:null
      },
      replyingTo: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      rating: {
        type: DataTypes.FLOAT,
        validate:{
            min: 1.0,
            max: 5.0
        }
      },
    },
    {
      timestamps: false,
    }
  );
};
