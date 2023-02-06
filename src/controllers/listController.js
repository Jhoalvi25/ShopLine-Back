const listService = require("../services/listServices");

exports.getAllList = async (req, res) => {
  const { userId } = req.query;
  try {
    const allLists = await listService.getAllListInfo(userId);
    res.status(200).send(allLists);
  } catch (err) {
    res.status(404).send(err.message);
  }
};

exports.getListFavorites = async (req, res) => {
  const { id } = req.params;
  try {
    const info = await listService.getFavorites(id);
    res.status(200).send(info);
  } catch (error) {
    res.status(404).send(error.message);
  }
};

exports.getList = async (req, res) => {
  const { id } = req.params;
  try {
    const info = await listService.getListInfo(id);
    res.status(200).send(info);
  } catch (err) {
    res.status(404).send(err.message);
  }
};

exports.postList = async (req, res) => {
  // En este body tengo que tener el nombre que va a llevar la lista y
  // el email del usuario para hacer la relacion
  const listInfo = req.body;
  try {
    const info = await listService.postListDb(listInfo);
    res.status(200).send(info);
  } catch (err) {
    res.status(404).send(err.message);
  }
};

exports.editList = async (req, res) => {
  const listInfo = req.body;
  try {
    const editedList = await listService.addProductToList(listInfo);
    res.status(200).send(editedList);
  } catch (err) {
    res.status(404).send(err.message);
  }
};

exports.changeNameList = async (req, res) => {
  const listInfo = req.body;
  try {
    const editedList = await listService.editNameList(listInfo);
    res.status(200).send(editedList);
  } catch (err) {
    res.status(404).send(err.message);
  }
};

exports.deleteProductInList = async (req, res) => {
  const productToDelete = req.body;
  try {
    const response = await listService.destroyProductInList(productToDelete);
    res.status(200).send(response);
  } catch (err) {
    res.status(404).send(err.message);
  }
};

exports.deleteList = async (req, res) => {
  const id = req.params.id;
  try {
    const response = await listService.destroyList(id);
    res.status(200).send(response);
  } catch (err) {
    res.status(404).send(err.message);
  }
};
