const crudRoutes = require("../utils/crudRoutes");
const controller = require("../controllers/speakerController");

module.exports = crudRoutes(controller);
