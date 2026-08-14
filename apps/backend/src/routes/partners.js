const crudRoutes = require("../utils/crudRoutes");
const controller = require("../controllers/partnerController");

module.exports = crudRoutes(controller);
