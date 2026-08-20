const crudRoutes = require("../utils/crudRoutes");
const controller = require("../controllers/pastSummitController");

module.exports = crudRoutes(controller);
