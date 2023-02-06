const { Op } = require("sequelize");
const { Product, List, User } = require("../db.js");

exports.getAllListInfo = async (userId) => {
  try {
    const allListsAux = await List.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          attributes: ["id"],
          through: {
            attributes: [],
          },
        },
      ],
      order: [["id", "DESC"]],
    });
    let allListsUser;
    allListsUser = await allListsAux.map((list) => {
      list.dataValues.products = list.products.length;
      return list;
    });

    return allListsUser;
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.getFavorites = async (userId) => {
  try {
    if ((userId === null) | !userId) throw new Error("The userId is NULL");
    const list = await List.findOne({
      where: { name: "Favorites", userId: userId },
      include: [
        {
          model: Product,
          attributes: ["id", "title", "image", "price"],
          through: {
            attributes: [],
          },
        },
      ],
    });
    if (!list) throw new Error("List not found");
    return list;
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getListInfo = async (id) => {
  try {
    // Aca busco la lista con el id
    const list = await List.findByPk(id, {
      include: [
        {
          model: Product,
          attributes: ["id", "title", "image", "price"],
          through: {
            attributes: [],
          },
        },
      ],
    });
    if (!list) throw new Error("List not found");
    return list;
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.postListDb = async (listInfo) => {
  const listName = listInfo.name;
  const email = listInfo.email;

  try {
    const user = await User.findOne({ where: { email: email } });
    const listCheck = await List.findOne({
      where: { name: listName },
      include: [
        {
          model: User,
          where: { email: email },
        },
      ],
    });
    if (listCheck) {
      throw new Error("There is already a list with that Name for that user!");
    } else {
      if (!user || user.dataValues.id === null)
        throw new Error("The user does not exists");
      if (!listName) throw new Error("The list needs a name!");
      if (listName.length < 2)
        throw new Error("The list needs 2 or more characters!");
      delete listInfo.email;

      const listUserCheck = await User.findOne({
        where: { email: email },
        include: [
          {
            model: List,
            where: { name: listName },
          },
        ],
      });
      if (listUserCheck) {
        throw new Error("Ya existe una lista con para ese usuario");
      } else {
        const newList = await List.create(listInfo);
        await newList.setUser(user);
        return "List created succesfully!";
      }
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.addProductToList = async (listInfo) => {
  const productId = listInfo.product; // id of the product
  const listId = listInfo.list; // id of the list

  try {
    const product = await Product.findOne({ where: { id: productId } });
    const list = await List.findOne({ where: { id: listId } });

    if (!product) {
      throw new Error("Product not found");
    } else if (!list) {
      throw new Error("List not found");
    } else {
      const listChecked = await List.findByPk(listId, {
        include: [
          {
            model: Product,
            where: { id: productId },
            through: {
              attributes: [],
            },
          },
        ],
      });
      if (listChecked) {
        throw new Error("The product is already added to the list!");
      } else {
        // Add the relationship to list from product
        await list.addProduct(product);
        return "Product added to list succesfully!";
      }
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.editNameList = async (listInfo) => {
  const newName = listInfo.name;
  const listId = listInfo.id;

  try {
    const list = await List.findOne({ where: { id: listId } });
    if (!list) throw new Error("List not found");

    list.name = newName;
    await list.save();
    return "List edited succesfully!";
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.destroyProductInList = async (productToDelete) => {
  const productId = productToDelete.product;
  const listId = productToDelete.list;

  try {
    const product = await Product.findOne({ where: { id: productId } });
    const list = await List.findOne({ where: { id: listId } });

    await list.removeAnime(product);
    return "Product deleted succesfully";
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.destroyList = async (id) => {
  try {
    const deletingList = await List.findOne({ where: { id: id } });
    if (!deletingList) {
      throw new Error("List could not be founded");
    } else {
      await List.destroy({ where: { id: id } });
      return "List deleted successfully!";
    }
  } catch (err) {
    throw new Error(err.message);
  }
};
