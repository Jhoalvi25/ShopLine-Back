const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      dni: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      phone: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      nationality: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      registered: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      rol: {
        type: DataTypes.ENUM("Admin", "User"),
        defaultValue: "User",
      },
      permissions: {
        type: DataTypes.ENUM("All", "Edit", "Client", "Banned"),
        defaultValue: "Client",
      },

      image: {
        type: DataTypes.TEXT,
      },
    },
    {
      timestamps: false,
    }
  );
};
