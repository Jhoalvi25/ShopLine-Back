const { Router } = require("express");
const adminControllers = require("../controllers/adminController");
const adminRouter = Router();

adminRouter.patch("/", adminControllers.adminAction);

module.exports = adminRouter;
