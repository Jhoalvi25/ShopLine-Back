require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_DEPLOY } = process.env;

// const sequelize = new Sequelize(
//   `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`,
//   {
//     logging: false, // set to console.log to see the raw SQL queries
//     native: false, // lets Sequelize know we can use pg-native for ~30% more speed
//   }
// );

const sequelize = new Sequelize(DB_DEPLOY,
  {
    logging: false, // set to console.log to see the raw SQL queries
    native: false, // lets Sequelize know we can use pg-native for ~30% more speed
  }
);

const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const { Product, Category, User, Cart, Review, Payment, List } = sequelize.models;

Product.hasOne(Category, {foreignKey: "category_id", as: "group"});
Category.belongsToMany(Product , {through: "Category_Product"});

User.hasOne(Cart);
Cart.belongsTo(User);

User.hasMany(Product); //revisar => posible cambio a belongsTo
Product.belongsToMany(User, {through: "Product_User"});

User.hasMany(Review)
Review.belongsTo(User)

User.hasMany(List);
List.belongsTo(User);

Review.hasMany(Review, {as: "Replies" ,foreignKey: 'reply_id'}) 
Review.belongsTo(Review, {foreignKey: 'reply_id', as: 'Parent'})


Product.belongsToMany(Cart, {through: "product_Cart" })
Cart.belongsToMany(Product, {through: "product_Cart" })

List.belongsToMany(Product, { through: 'list_product' });
Product.belongsToMany(List, { through: 'list_product' });

User.belongsToMany(Payment, {through: "user_payment"});
Payment.belongsToMany(User, {through: "user_payment"});

Product.belongsToMany(Review, {through: "product_review"})
Review.belongsToMany(Product, {through: "product_review"})



// Aca vendrian las relaciones
// Product.hasMany(Reviews);

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize, // para importart la conexión { conn } = require('./db.js');
};
