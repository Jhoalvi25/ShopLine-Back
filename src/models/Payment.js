const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    "payment",
    {
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      amount: {
        type: DataTypes.INTEGER,
      },
      currency: {
        type: DataTypes.STRING,
      },
      payment_method_types: {
       type:DataTypes.ARRAY(DataTypes.STRING)
      },
      status:{
        type:DataTypes.STRING
      },
      description: {
        type:DataTypes.STRING
      }
    },
    {
      timestamps: true,
    }
  );
};